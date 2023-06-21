
import { httpGet, httpPost } from '../request'

const isProduct = process.env.VUE_APP_NODE_ENV == 'production' ? true : false
const service = '/exchans'
const aiService = '/aiService'
const isDev = process.env.VUE_APP_NODE_ENV == 'development'
const isTest = process.env.VUE_APP_NODE_ENV == 'test' || process.env.VUE_APP_NODE_ENV == 'development'
// const exchantest = isProduct ? '/c0x5051580802283c7b053d234d124b199045ead750' : ''
const exchantest = isTest ?  '/c0x5051580802283c7b053d234d124b199045ead750' : '' 


const contractApi = '/contractApi'  

export const queryArraySnft = (params = {}) => {
  return httpPost(`${isDev ?service: ''}${exchantest}/v2/queryArraySnft`,params)
 
}


// Get snft by owner
export function getSnftOwner(params = {}){
  return httpGet(`${contractApi}/snft_meta/page`, params)
}


// Get NFT according to owner
export function getNftOwner(params = {}){
  return httpGet(`${contractApi}/nft_meta/page`, params)
}


export const snft_com_page = (params = {}) => {
  return httpGet(`${contractApi}/snft_com/page`,params)
 
}
export const getOwnerSnftList = (params = {}) => {
  return httpGet(`${contractApi}/snft/page`,params)
}

export const getOwnerNftList = (params = {}) => {
  return httpGet(`${contractApi}/nft/page`,params)
}


export const getAccount = (address: string) => {
  return httpGet(`${contractApi}/account/${address}`)
}

export const tokenIdByNftaddr = (address: string) => {
  return httpPost(`${isDev ?service : ''}${exchantest}/v2/queryTokenIdByNftaddr`, {nft_addr: address })
}


export interface GetDrawInfoParams {
  useraddr: string
  index: string
  count: string
}
export const getDrawInfoByUser = (params: GetDrawInfoParams) => {
  return httpPost(`${isProduct ?'': aiService}/v1/getDrawInfoByUser`, params)

}

export interface EmailParams {
  useraddr: string
}
export const getEmailByUser = (params: EmailParams) => {
  return httpPost(`${isProduct ?'': aiService}/v1/getEmailByUser`, params)

}


export interface DrawListParams {
  nftaddrs: string
}
export const getDrawInfoByNftaddrs = (params: DrawListParams) => {
  return httpPost(`${isProduct ?'': aiService}/v1/getDrawInfoByNftaddrs`, params)

}




export const getPaintFee = () => {
  return httpPost(`${isProduct ?'': aiService}/v1/getPaintFee`, {})
}
export interface DrawImageParams {
  useraddr: string
  nftaddr: string
  email: string
  drawflag: string
}
export const drawImage = (params: DrawImageParams) => {
  return httpPost(`${isProduct ?'': aiService}/v1/drawImage`, params)
}


export const getAiServerAddr = () => {
  return httpPost(`${isProduct ?'': aiService}/v1/getAiServerAddr`, {})
  
}
