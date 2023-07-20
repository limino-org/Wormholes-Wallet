
import { httpGet,httpPost } from '../request'
import { nftaimint } from './nft'
const isProduct = process.env.VUE_APP_NODE_ENV == 'production' ? true : false


const aiServicePath = isProduct? '' :nftaimint
export type ValidParams = {
    index: string
    count: string
}
export const getValidatorInfo = (params: ValidParams) => {
    return httpPost(`${aiServicePath}/v1/getValidatorInfo`, params)
}

export type GetCoefParams = {
    users: string
}
export const getUsersCoefficient = (params: GetCoefParams) => {
    return httpPost(`${aiServicePath}/v1/getUsersCoefficient`, params)
  
}

