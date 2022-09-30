import { TransactionRecord } from "@/enum/network";

export interface TransactionData {
    hash: string
    blockHash: string
    blockNumber: number
    transactionIndex: number
    from: string
    gasPrice: any
    gasLimit: any
    to: string
    value: any
    nonce: number
    data: string
    creates: any
    chainId: number
}

export interface TransactionParams {
    to: string
    form: string
    data: TransactionRecord
}