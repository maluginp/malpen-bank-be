export class SolanaWallet {
    publicKey: string
}

export interface IWallet {
    id: number
    name: string
    address: string
    isDefault: boolean
}

export interface IBalancedWallet extends IWallet {
    balance: number    
}

export interface IUpdateWallet {
    name: string
}