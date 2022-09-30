

import { httpGet } from '../request'

const service = 'priceApi'

export function getTokenToUsdPrice(symbol: string = 'eth_usd'){
    return httpGet(`${service}`, {
        symbol
    })
}


export  const erb_price = (params = {}) =>{
    return httpGet(`${service}/erb_price`, params)
}

