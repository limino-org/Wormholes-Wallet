
import { httpGet,httpPost } from '../request'
const aiApi = '/aiApi'


export type ValidParams = {
    index: string
    count: string
}
export const getValidatorInfo = (params: ValidParams) => {
    return httpPost(`${aiApi}/v1/getValidatorInfo`, params)
}

export type GetCoefParams = {
    users: string
}
export const getUsersCoefficient = (params: GetCoefParams) => {
    return httpPost(`${aiApi}/v1/getUsersCoefficient`, params)
  
}

