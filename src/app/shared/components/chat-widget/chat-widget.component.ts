import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../../features/agent/services/agent.service';
import { AgentQueryRequest, ChatMessage, SuggestedQuestion } from '../../../features/agent/models/agent.model';
import { ChatMessageComponent } from '../../../features/agent/components/chat-message/chat-message.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChatMessageComponent],
  template: `
    <button
      class="chat-fab"
      type="button"
      [attr.aria-label]="isOpen() ? 'Cerrar asistente' : 'Abrir asistente IA'"
      (click)="toggleOpen()"
    >
      <svg *ngIf="!isOpen()" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <svg *ngIf="isOpen()" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <div class="chat-widget" *ngIf="isOpen()">
      <header class="chat-widget__header">
        <div class="chat-widget__header-info">
          <div class="chat-widget__avatar">IA</div>
          <div>
            <strong>Asistente IA — Siniestros</strong>
            <small><span class="chat-status-dot"></span> En línea · responde al instante</small>
          </div>
        </div>
        <button class="chat-widget__close" type="button" aria-label="Cerrar" (click)="toggleOpen()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <div class="chat-widget__body" #chatBody>
        <div *ngIf="messages().length === 0" class="chat-widget__welcome">
          <div class="chat-message">
            <div>
              <p>¡Hola! Soy tu asistente de siniestros 🤖. Puedo ayudarte a reportar un siniestro, consultar el estado de tu póliza o hacer seguimiento a un reclamo existente.</p>
              <p style="margin: 8px 0 0">¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>
          <div class="chat-widget__quick-actions" *ngIf="suggestedQuestions().length">
            <button
              *ngFor="let q of suggestedQuestions().slice(0, 4)"
              class="chat-widget__quick-btn"
              type="button"
              (click)="sendQuestion(q.question)"
            >
              {{ q.question }}
            </button>
          </div>
        </div>

        <app-chat-message *ngFor="let msg of messages()" [message]="msg"></app-chat-message>

        <div *ngIf="loading()" class="chat-widget__typing">
          <span></span><span></span><span></span>
        </div>
      </div>

      <footer class="chat-widget__footer">
        <form [formGroup]="form" (ngSubmit)="submit()">
          <input
            formControlName="question"
            placeholder="Escribe tu consulta..."
            autocomplete="off"
          />
          <button type="submit" [disabled]="form.invalid || loading()" aria-label="Enviar">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  `,
})
export class ChatWidgetComponent implements OnInit {
  @ViewChild('chatBody') chatBody?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  messages = signal<ChatMessage[]>([]);
  suggestedQuestions = signal<SuggestedQuestion[]>([]);
  loading = signal(false);

  form = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.minLength(3)]],
  });

  private sessionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
  ) {}

  ngOnInit(): void {
    this.agentService.getSuggestedQuestions().subscribe((q) => this.suggestedQuestions.set(q));
  }

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  submit(): void {
    if (this.form.invalid) return;
    const question = this.form.getRawValue().question.trim();
    this.form.reset({ question: '' });
    this.sendQuestion(question);
  }

  sendQuestion(question: string): void {
    const userMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      role: 'user',
      content: question,
      createdAt: new Date(),
    };
    this.messages.update((msgs) => [...msgs, userMsg]);
    this.loading.set(true);
    this.scrollToBottom();

    const request: AgentQueryRequest = this.sessionId
      ? { question, sessionId: this.sessionId, useLlm: true }
      : { question, useLlm: true };

    this.agentService.query(request).subscribe({
      next: (response) => {
        this.sessionId = response.sessionId ?? this.sessionId;
        this.messages.update((msgs) => [
          ...msgs,
          {
            id: `${Date.now()}-${Math.random()}`,
            role: 'assistant',
            content: response.answer,
            relatedData: response.relatedData,
            createdAt: new Date(),
          },
        ]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => this.loading.set(false),
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 60);
  }
}
