export interface Token {
    symbol: string
    logoUrl: string
    balance: number
    name: string
    precision: number
    tokenType: string
}

export const ETH: Token = {
    symbol:'ETH',
    logoUrl: 'eth.jpg',
    balance: 0,
    name: 'Ether',
    precision: 0,
    tokenType: "erc20"
}