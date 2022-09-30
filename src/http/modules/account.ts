
import { httpGet } from '../request'

const service = '/accountApi'
const apikey = 'freekey'

export function getTransitions(address: string  ){
    return httpGet(`${service}`, {
        address,
        module: 'account',
        action:'txlist',
        apikey
    })
}