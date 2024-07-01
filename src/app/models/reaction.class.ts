import { User } from "./user.class";


export class Reaction {
    id: string;
    user: User;
    message_id: string;
    answer_id: string;
    amount: number;
    emoji: string;





    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.user = obj ? obj.user : '';
        this.message_id = obj ? obj.post_id : "";
        this.answer_id = obj ? obj.answer_id : "";
        this.amount = obj ? obj.amount : 0;
        this.emoji = obj ? obj.emoji : '';
    }


}