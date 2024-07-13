import { User } from './user.class';
import { Message } from './message.class';

export class PrivateChat {
  privatChatId: string;
  chatCreator: string;
  chatReciver: string;
  privateNoteCreator: string;
  createdAt: string;
  createdBy: string;

  constructor(obj?: any) {
    this.privatChatId = obj ? obj.id : '';
    this.chatCreator = obj ? obj.chatCreator : '';
    this.chatReciver = obj ? obj.chatReciver : '';
    this.privateNoteCreator = obj ? obj.privateNote : '';
    this.createdAt = obj ? obj.createdAt : '';
    this.createdBy = obj ? obj.createdBy : '';
  }
}

