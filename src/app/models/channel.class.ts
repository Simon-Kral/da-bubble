import { Message } from "./message.class";
import { User } from "./user.class";

export class Channel {
  id: string;
  name: string;
  description: string;
  members: User[];
  messages: Message[];
  createdAt: number;
  createdBy: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.description = obj ? obj.description : '';
    this.members = obj ? obj.users : [];
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
  }
}
