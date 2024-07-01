export class PrivateChat{
  id: string;
  chatCreator: string;
  chatReciver: string;
  messages: string[];
  createdAt: number;
  createdBy: string;

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.chatCreator = obj ? obj.chatCreator : '';
    this.chatReciver = obj ? obj.chatReciver : '';
    this.messages = obj ? obj.messages : [];
    this.createdAt = obj ? obj.createdAt : 0;
    this.createdBy = obj ? obj.createdBy : '';
  }
}
