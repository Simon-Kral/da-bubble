export class Channels {
  id: string;
  chanName: string;
  description: string;
  users: string[];
  messages: string[];
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.chanName = obj ? obj.chanName : '';
    this.description = obj ? obj.description : '';
    this.users = obj ? obj.users : [];
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.updatedAt = obj ? obj.updatedAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
    this.updatedBy = obj ? obj.updatedBy : '';
  }
}
