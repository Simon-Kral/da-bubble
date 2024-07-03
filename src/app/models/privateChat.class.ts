import { User } from './user.class';
import { Message } from './message.class';

export class PrivateChat {
  privatChatId: string;
  chatCreator: string;
  chatReciver: string;
  messages: Message[];
  createdAt: number;
  createdBy: string;

  constructor(obj?: any) {
    this.privatChatId = obj ? obj.id : '';
    this.chatCreator = obj ? obj.chatCreator : '';
    this.chatReciver = obj ? obj.chatReciver : '';
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
  }
}

