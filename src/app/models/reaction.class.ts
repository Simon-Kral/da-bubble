export class Reaction {
  reactionId: string;
  user: string[];
  message_id: string;
  amount: number;
  nativeEmoji: string;

  constructor(obj?: any) {
    this.reactionId = obj ? obj.id : '';
    this.user = obj ? obj.users : [];
    this.message_id = obj ? obj.post_id : '';
    this.amount = obj ? obj.amount : 0;
    this.nativeEmoji = obj ? obj.emoji : '';
  }
}
