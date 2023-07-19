
import { httpGet,httpPost } from '../request'
const isProduct = process.env.VUE_APP_NODE_ENV == 'production' ? true : false
const aiService = '/stakerApi'

const aiServicePath = isProduct? '' :aiService
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

