
import { httpGet, httpPost } from '../request'

const isProduct = process.env.NODE_ENV == 'production' ? true : false
const service = '/exchans'

// const exchantest = isProduct ? '/c0x5051580802283c7b053d234d124b199045ead750' : ''
const exchantest = isProduct ? '' : ''

const wormholesscanApi = '/contractApi'

const contractApi = '/contractApi'  
export const getNftOwner = (params = {}) => {
  return httpPost(`${isProduct ?'': service}${exchantest}/v2/queryOwnerSnftChip`,params)
}

export const queryArraySnft = (params = {}) => {
  return httpPost(`${isProduct ?'': service}${exchantest}/v2/queryArraySnft`,params)
 
}

export const snft_com_page = (params = {}) => {
  return httpGet(`${contractApi}/snft_com/page`,params)
 
}
export const getOwnerSnftList = (params = {}) => {
  return httpGet(`${wormholesscanApi}/snft/page`,params)
}

export const getAccount = (address: string) => {
  return httpGet(`${wormholesscanApi}/account/${address}`)
}
