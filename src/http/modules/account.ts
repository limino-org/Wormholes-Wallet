
import { httpGet } from '../request'
export const isProduct = process.env.VUE_APP_NODE_ENV == 'production' || process.env.VUE_APP_NODE_ENV == 'test' ? true : false
const contractApi = isProduct ? 'contractApi' : 'contractApi'
interface GetTransitionsParams {
    page: string
    page_size: string
    number: string
    addr: string
}
/**
 * 
 * @param params page
 * @param params page_size
 * @param params number
 * @param params addr
 * @returns 
 */
export function getTransitionsPage(params: GetTransitionsParams){
    return httpGet(`${contractApi}/transaction/page`, params)
}