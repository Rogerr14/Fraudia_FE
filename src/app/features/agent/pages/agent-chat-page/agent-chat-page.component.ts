import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AgentInputComponent } from '../../components/agent-input/agent-input.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { SuggestedQuestionsComponent } from '../../components/suggested-questions/suggested-questions.component';
import { AgentService } from '../../services/agent.service';
import { AgentQueryRequest, ChatMessage, ChatSession, SuggestedQuestion } from '../../models/agent.model';

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
          <span>Consulta señales y explicaciones como apoyo a la revisión humana.</span>
        </div>
      </header>

      <app-card *ngIf="sessions().length > 0" title="Sesiones recientes" eyebrow="Historial de conversación">
        <div class="suggested-questions">
          <button *ngFor="let session of sessions()" type="button" (click)="loadSession(session)">
            {{ session.title }}
          </button>
        </div>
      </app-card>

      <app-card *ngIf="activeClaimId()" title="Chat asociado a siniestro" eyebrow="Contexto activo" [highlighted]="true">
        <p class="body-text">
          Siniestro activo: <strong>{{ activeClaimId() }}</strong>. Las respuestas del agente son alertas o
          recomendaciones para revisión humana.
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
  sessions = signal<ChatSession[]>([]);
  suggestedQuestions = signal<SuggestedQuestion[]>([]);
  loadingResponse = signal(false);
  activeClaimId = signal<string | null>(null);
  disclaimer = signal('La respuesta es una alerta o recomendación para revisión humana y no una acusación de fraude.');
  private sessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private agentService: AgentService,
  ) {}

  ngOnInit(): void {
    this.loadSessions();
    this.agentService.getSuggestedQuestions().subscribe((questions) => this.suggestedQuestions.set(questions));

    this.route.queryParamMap.subscribe((params) => {
      const claimId = params.get('claim_id');
      const autoExplain = params.get('auto_explain') === 'true';

      this.activeClaimId.set(claimId);
      this.sessionId = null;
      this.messages.set([]);

      if (claimId && autoExplain) {
        this.loadingResponse.set(true);
        this.agentService.explainClaim(claimId).subscribe({
          next: (response) => {
            this.sessionId = response.sessionId ?? this.sessionId;
            this.upsertSession(response.sessionId, response.claimId ?? claimId, `Explicación ${claimId}`);
            this.disclaimer.set(response.disclaimer);
            this.messages.set([
              {
                id: this.createMessageId(),
                role: 'assistant',
                content: response.answer,
                createdAt: new Date(),
                sources: response.sources,
              },
            ]);
            this.loadingResponse.set(false);
          },
          error: () => this.loadingResponse.set(false),
        });
      }
    });
  }

  selectQuestion(question: string): void {
    this.agentInput?.setQuestion(question);
  }

  loadSession(session: ChatSession): void {
    this.sessionId = session.id;
    this.activeClaimId.set(session.claimId ?? null);
    this.agentService.getSessionMessages(session.id).subscribe((messages) => this.messages.set(messages));
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

    this.agentService.query(this.buildAgentRequest(question)).subscribe({
      next: (response) => {
        this.sessionId = response.sessionId ?? this.sessionId;
        this.activeClaimId.set(response.claimId ?? this.activeClaimId());
        this.disclaimer.set(response.disclaimer);
        this.messages.set([
          ...this.messages(),
          {
            id: this.createMessageId(),
            role: 'assistant',
            content: response.answer,
            createdAt: new Date(),
            sources: response.sources,
          },
        ]);
        this.loadingResponse.set(false);
        this.upsertSession(response.sessionId, response.claimId ?? this.activeClaimId(), question);
      },
      error: () => this.loadingResponse.set(false),
    });
  }

  private loadSessions(): void {
    this.agentService.getSessions().subscribe({
      next: (sessions) => this.sessions.set(sessions),
    });
  }

  private upsertSession(sessionId: string | null | undefined, claimId: string | null | undefined, question: string): void {
    if (!sessionId) {
      return;
    }

    const title = question.trim().slice(0, 60) || 'Sesión reciente';
    this.sessions.update((sessions) => {
      const existingSession = sessions.find((session) => session.id === sessionId);
      const nextSession: ChatSession = existingSession
        ? {
            ...existingSession,
            claimId: claimId ?? existingSession.claimId,
            updatedAt: new Date().toISOString(),
          }
        : {
            id: sessionId,
            title,
            claimId: claimId ?? null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      return [nextSession, ...sessions.filter((session) => session.id !== sessionId)];
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

    return {
      question,
      claimId: this.activeClaimId(),
      useLlm: true,
      context: this.activeClaimId()
        ? {
            claimId: this.activeClaimId(),
            limit: 5,
          }
        : undefined,
    };
  }
}
