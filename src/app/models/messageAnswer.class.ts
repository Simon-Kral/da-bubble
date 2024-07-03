import { User } from './user.class';
import { Reaction } from './reaction.class';

export class MessageAnswer {
  messageAnswerId: string;
  text: string;
  messageId: string;
  user: User;
  date: string;
  time: string;
  reactions: Reaction[];

  constructor(obj?: any) {
    this.messageAnswerId = obj ? obj.id : '';
    this.text = obj ? obj.text : '';
    this.messageId = obj ? obj.messageId : '';
    this.user = obj ? obj.user : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.reactions = obj ? obj.reactions : [];
  }
}
