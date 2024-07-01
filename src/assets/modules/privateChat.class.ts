export class PrivateChat{
  id: string;
  chatCreator: string;
  chatReciver: string;
  messages: string[];
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.chatCreator = obj ? obj.chatCreator : '';
    this.chatReciver = obj ? obj.chatReciver : '';
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.updatedAt = obj ? obj.updatedAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
    this.updatedBy = obj ? obj.updatedBy : '';
  }
}
