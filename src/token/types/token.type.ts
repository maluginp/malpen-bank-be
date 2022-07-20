export interface JwtToken {
    userId: number
    email: string
}
export interface Token {
    userId: UserID
    email: string
}

export class UserID {
    constructor(
        private _id: number
    ) { }

    public unwrap(): number {
        return this._id
    }   
}