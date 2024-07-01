import { Message } from "./message.class";
export class Channel {
  id: string;
  chanName: string;
  description: string;
  members: string[];
  messages: Message[];
  createdAt: number;
  createdBy: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.chanName = obj ? obj.chanName : '';
    this.description = obj ? obj.description : '';
    this.members = obj ? obj.users : [];
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
  }
}
