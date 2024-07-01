import { User } from './user.class';
import { MessageAnswer } from './messageAnswer.class';
import { Reaction } from './reaction.class';

export class Message {
  id: string;
  text: string;
  chatId: string;
  user: User;
  date: string;
  time: string;
  messageSendBy: User;
  messageAnswer: MessageAnswer[];
  reactions: Reaction[];

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.text = obj ? obj.text : '';
    this.chatId = obj ? obj.chatId : '';
    this.user = obj ? obj.user : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.messageSendBy = obj ? obj.messageSendBy : '';
    this.messageAnswer = obj ? obj.messageAnswer : [];
    this.reactions = obj ? obj.reactions : [];
  }

}
