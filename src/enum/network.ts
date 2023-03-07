
import { TransactionData } from '@/store/modules/index'
import { TransactionReceipt } from '@/store/modules/account'
import { Token } from '@/utils/token'
import i18n from "@/language/index";
import { guid } from '@/utils';
import { VUE_APP_NODE_WORM_URL, VUE_APP_SCAN_URL } from './env';
const URL =  VUE_APP_NODE_WORM_URL


export interface NetWorkData {
    value?: string
    // name
    label: string
    select: boolean
    // RPC URL
    URL: string
    // chainId
    chainId: number
    currencySymbol: String
    browser: string
    color: string
    transactionList: TransactionList
    tokens: TokenList
    icon: ChessIcon
    id: string
    isMain?: boolean
}

export type ChessIcon = {
    name: string,
    index: number
}

export type TokenList = {
    [key:string]: Array<Token>
}
export type TransactionList = {
    [key:string]: Array<TransactionReceipt>
}

export interface TransactionRecord {
    address: Array<TransactionData>
}


// chess-bishop.svg
// chess-rook-alt.svg
// chess-pawn.svg
// chess-king.svg
// chess-knight-alt.svg
// chess-queen.svg
export const chessIcons = [
    {
        name:"chess-king",
        index:0,
    },
    {
        name:"chess-queen",
        index:1,
    },
    {
        name:"chess-bishop",
        index:2,

    },
    {
        name:"chess-rook-alt",
        index:3,

    },
    {
        name:"chess-knight-alt",
        index:4,

    },
    {
        name:"chess-pawn",
        index:5,

    }
]


export const netWorklist: Array<NetWorkData> = [
    { value: 'Wormholes',color:'rgb(14, 126, 33)',icon: chessIcons[0], label: "Wormholes", select: true ,URL, chainId: 51888, currencySymbol: 'ERB', browser: VUE_APP_SCAN_URL,transactionList:{},tokens:{} ,id: 'wormholes-network-1', isMain: true },
]