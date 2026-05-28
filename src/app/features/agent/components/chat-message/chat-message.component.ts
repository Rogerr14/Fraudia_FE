import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ChatMessage } from '../../models/agent.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, DateFormatPipe],
  template: `
    <article class="chat-message" [class.chat-message--user]="message.role === 'user'">
      <div>
        <p>{{ message.content }}</p>
        <span>{{ message.createdAt | dateFormat: 'time' }}</span>
        <div *ngIf="message.relatedData?.length" class="chat-message__sources">
          <small *ngFor="let item of message.relatedData">{{ item }}</small>
        </div>
      </div>
    </article>
  `,
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: ChatMessage;
}
