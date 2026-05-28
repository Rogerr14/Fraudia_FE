import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AgentInputComponent } from '../../components/agent-input/agent-input.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { SuggestedQuestionsComponent } from '../../components/suggested-questions/suggested-questions.component';
import { AgentService } from '../../services/agent.service';
import { AgentQueryRequest, ChatMessage, SuggestedQuestion } from '../../models/agent.model';

@Component({
  selector: 'app-agent-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    AppCardComponent,
    AgentInputComponent,
    ChatMessageComponent,
    SuggestedQuestionsComponent,
  ],
  template: `
    <section class="page agent-page">
      <header class="page-header">
        <div>
          <p class="page-kicker">Asistente analítico</p>
          <h1>Agente IA</h1>
          <span>Consulta señales, explicaciones y prioridades sin reemplazar la revisión humana.</span>
        </div>
      </header>

      <app-card *ngIf="activeClaimId()" title="Chat asociado a siniestro" eyebrow="Contexto activo" [highlighted]="true">
        <p class="body-text">
          Primera pregunta con <strong>claim_id</strong>: {{ activeClaimId() }}. Las siguientes preguntas continuarán con
          <strong>session_id</strong> cuando el backend lo devuelva.
        </p>
      </app-card>

      <app-card title="Preguntas sugeridas" eyebrow="Inicio rápido">
        <app-suggested-questions [questions]="suggestedQuestions()" (questionSelected)="selectQuestion($event)"></app-suggested-questions>
      </app-card>

      <app-card title="Conversación" eyebrow="Consulta supervisada">
        <div class="chat-window">
          <p *ngIf="messages().length === 0" class="muted-text">Haz una pregunta al agente para comenzar.</p>
          <app-chat-message *ngFor="let message of messages()" [message]="message"></app-chat-message>
        </div>
        <p class="disclaimer">{{ disclaimer() }}</p>
        <app-agent-input #agentInput [loading]="loadingResponse()" (questionSubmitted)="sendQuestion($event)"></app-agent-input>
      </app-card>
    </section>
  `,
})
export class AgentChatPageComponent implements OnInit {
  @ViewChild('agentInput') agentInput?: AgentInputComponent;

  messages = signal<ChatMessage[]>([]);
  suggestedQuestions = signal<SuggestedQuestion[]>([]);
  loadingResponse = signal(false);
  activeClaimId = signal<string | null>(null);
  disclaimer = signal('La respuesta representa una alerta de revisión, no una acusación de fraude.');
  private sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService
  ) {}

  ngOnInit(): void {
    this.agentService.getSuggestedQuestions().subscribe((questions) => this.suggestedQuestions.set(questions));
    this.route.queryParamMap.subscribe((params) => {
      const claimId = params.get('claim_id');
      this.activeClaimId.set(claimId);
      this.sessionId = null;
      if (claimId) {
        this.agentInput?.setQuestion('Explícame el riesgo de este siniestro');
      }
    });
  }

  selectQuestion(question: string): void {
    this.agentInput?.setQuestion(question);
  }

  sendQuestion(question: string): void {
    const userMessage: ChatMessage = {
      id: this.createMessageId(),
      role: 'user',
      content: question,
      createdAt: new Date(),
    };
    this.messages.set([...this.messages(), userMessage]);
    this.loadingResponse.set(true);

    this.agentService
      .query(this.buildAgentRequest(question))
      .subscribe({
        next: (response) => {
          this.sessionId = response.sessionId ?? this.sessionId;
          this.activeClaimId.set(response.claimId ?? this.activeClaimId());
          this.disclaimer.set(response.disclaimer || this.disclaimer());
          this.messages.set([
            ...this.messages(),
            {
              id: this.createMessageId(),
              role: 'assistant',
              content: response.answer,
              relatedData: response.relatedData,
              createdAt: new Date(),
            },
          ]);
          this.loadingResponse.set(false);
        },
        error: () => this.loadingResponse.set(false),
      });
  }

  private createMessageId(): string {
    return `${Date.now()}-${Math.random()}`;
  }

  private buildAgentRequest(question: string): AgentQueryRequest {
    if (this.sessionId) {
      return {
        question,
        sessionId: this.sessionId,
        useLlm: true,
      };
    }

    const request: AgentQueryRequest = {
      question,
      useLlm: true,
    };

    const claimId = this.activeClaimId();
    if (claimId) {
      request.claimId = claimId;
    }

    return request;
  }
}
