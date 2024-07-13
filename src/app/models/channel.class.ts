import { Message } from "./message.class";
import { User } from "./user.class";

export class Channel {
  chanId: string;
  name: string;
  description: string;
  members: string[];
  createdAt: number;
  createdBy: string;

  constructor(obj?: any) {
    this.chanId = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.description = obj ? obj.description : '';
    this.members = obj ? obj.users : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
  }
}
