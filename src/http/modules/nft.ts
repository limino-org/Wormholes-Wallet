
import { httpGet, httpPost } from '../request'

const isProduct = process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test' ? true : false
const service = '/exchans'

// const exchantest = isProduct ? '/c0x5051580802283c7b053d234d124b199045ead750' : ''
const exchantest = isProduct ? '' : '/c0x5051580802283c7b053d234d124b199045ead750' 


const contractApi = '/contractApi'  

export const queryArraySnft = (params = {}) => {
  return httpPost(`${isProduct ?'': service}${exchantest}/v2/queryArraySnft`,params)
 
}

export const snft_com_page = (params = {}) => {
  return httpGet(`${contractApi}/snft_com/page`,params)
 
}
export const getOwnerSnftList = (params = {}) => {
  return httpGet(`${contractApi}/snft/page`,params)
}

export const getAccount = (address: string) => {
  return httpGet(`${contractApi}/account/${address}`)
}

export const tokenIdByNftaddr = (address: string) => {
  return httpPost(`${isProduct ?'': service}${exchantest}/v2/queryTokenIdByNftaddr`, {nft_addr: address })
}

