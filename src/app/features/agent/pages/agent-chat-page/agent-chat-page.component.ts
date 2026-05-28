import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCardComponent } from '../../../../shared/components/card/app-card.component';
import { AppButtonComponent } from '../../../../shared/components/button/app-button.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { AgentService } from '../../services/agent.service';
import { AgentQueryRequest, AgentQueryResponse } from '../../../../core/models/agent.model';
import { NotificationService } from '../../../../core/services/notification.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-agent-chat-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppCardComponent,
    AppButtonComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="space-y-6 pb-16 md:pb-0 max-w-4xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">🤖 Agente IA</h1>
        <p class="text-slate-600">Consulta al agente de IA sobre siniestros y patrones de fraude</p>
      </div>

      <!-- Suggested Questions -->
      <app-card title="Preguntas Sugeridas">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            *ngFor="let question of suggestedQuestions()"
            (click)="onSelectQuestion(question.question)"
            class="text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-sm text-blue-900 font-medium"
          >
            {{ question.question }}
          </button>
        </div>
      </app-card>

      <!-- Chat Area -->
      <app-card class="min-h-96 flex flex-col">
        <!-- Messages -->
        <div class="flex-1 overflow-y-auto mb-4 space-y-4">
          <div *ngIf="messages().length === 0" class="flex items-center justify-center h-64">
            <p class="text-slate-600 text-center">
              Haz una pregunta al agente para comenzar la conversación.
            </p>
          </div>

          <div *ngFor="let message of messages()" [ngClass]="message.role === 'user' ? 'text-right' : 'text-left'">
            <div
              [ngClass]="message.role === 'user'
                ? 'bg-blue-600 text-white rounded-bl-lg rounded-tl-lg'
                : 'bg-slate-100 text-slate-900 rounded-br-lg rounded-tr-lg'"
              class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
            >
              <p class="text-sm">{{ message.content }}</p>
              <p class="text-xs opacity-70 mt-1">
                {{ message.timestamp | date: 'short' }}
              </p>
            </div>
          </div>

          <div *ngIf="loadingResponse()" class="text-left">
            <div class="inline-block bg-slate-100 text-slate-900 rounded-lg px-4 py-2">
              <p class="text-sm">
                <span class="inline-block w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                El agente está pensando...
              </p>
            </div>
          </div>
        </div>

        <!-- Disclaimer -->
        <div
          *ngIf="messages().length > 0"
          class="bg-amber-50 border border-amber-200 rounded p-3 mb-4 text-xs text-amber-900"
        >
          <strong>⚠️ Descargo de responsabilidad:</strong> La respuesta representa una alerta de revisión, no una
          acusación de fraude.
        </div>

        <!-- Input -->
        <div class="border-t border-slate-200 pt-4">
          <div class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="userQuestion"
              (keyup.enter)="onSendMessage()"
              placeholder="Escribe tu pregunta..."
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              [disabled]="loadingResponse()"
            />
            <button
              (click)="onSendMessage()"
              [disabled]="!userQuestion || loadingResponse()"
              class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 text-sm"
            >
              {{ loadingResponse() ? '...' : 'Enviar' }}
            </button>
          </div>
        </div>
      </app-card>
    </div>
  `,
})
export class AgentChatPageComponent implements OnInit {
  messages = signal<ChatMessage[]>([]);
  suggestedQuestions = signal<any[]>([]);
  userQuestion = '';
  loadingResponse = signal(false);

  constructor(
    private agentService: AgentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSuggestedQuestions();
  }

  loadSuggestedQuestions(): void {
    this.agentService.getSuggestedQuestions().subscribe({
      next: (response) => {
        this.suggestedQuestions.set(response.items);
      },
      error: () => {
        this.notificationService.error('Error al cargar preguntas sugeridas');
      },
    });
  }

  onSelectQuestion(question: string): void {
    this.userQuestion = question;
  }

  onSendMessage(): void {
    if (!this.userQuestion.trim()) return;

    const question = this.userQuestion;
    this.userQuestion = '';

    // Add user message
    this.messages.set([
      ...this.messages(),
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
      },
    ]);

    this.loadingResponse.set(true);

    const request: AgentQueryRequest = {
      question,
      context: { limit: 10 },
    };

    this.agentService.query(request).subscribe({
      next: (response) => {
        this.messages.set([
          ...this.messages(),
          {
            role: 'assistant',
            content: response.answer,
            timestamp: new Date(),
          },
        ]);
        this.loadingResponse.set(false);
      },
      error: () => {
        this.loadingResponse.set(false);
        this.notificationService.error('Error al consultar el agente');
      },
    });
  }
}
