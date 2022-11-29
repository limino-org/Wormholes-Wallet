

import { httpGet } from '../request'

const service = 'priceApi'


export  const erb_price = (params = {}) =>{
    return httpGet(`${service}/erb_price`, params)
}

