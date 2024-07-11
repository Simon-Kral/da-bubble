import { User } from './user.class';
import { MessageAnswer } from './messageAnswer.class';
import { Reaction } from './reaction.class';

export class Message {
  messageId: string;
  text: string;
  chatId: string;
  date: string;
  time: string;
  messageSendBy: string;
  reactions: Reaction[];

  constructor(obj?: any) {
    this.messageId = obj ? obj.id : '';
    this.text = obj ? obj.text : '';
    this.chatId = obj ? obj.chatId : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.messageSendBy = obj ? obj.messageSendBy : '';
    this.reactions = obj ? obj.reactions : [];
  }

}
