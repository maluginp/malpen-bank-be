export interface IUser {
    id: number
    email: string
    password: string
    status: IUserStatus
    nickname: string
}

export interface IUserCode {
    code: string
}

export interface INewUser {
    email: string
    password: string
    nickname: string
}

export enum IUserStatus {
    ACTIVE = 0,
    BLOCKED = 1,
    WAIT_CONFIRM = 2,
}