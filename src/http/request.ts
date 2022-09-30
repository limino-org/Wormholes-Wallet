import axios, { Method } from 'axios'
import { Toast } from 'vant'
const service = axios.create({
    baseURL: '/',
    headers: {
       "Content-Type": "application/json; charset=UTF-8"
    },
    timeout: 10000, 

})

service.interceptors.request.use(config => {
    return config
})
service.interceptors.response.use(
    response => {
      const { status } = response
      if(status == 200) {
        return response.data
      } else {
        Toast(JSON.stringify(response))
        return Promise.reject(response)
      }
    },
    error => {
      console.log('error-----', error.message)
      Toast(error.message || `Fail code:${error.code}`)
      return Promise.reject(error)
    }
  )
  
/**
 * The core function that handles all the requested data and scales horizontally
 * @param {url} Request the address
 * @param {params} required parameter
 * @param {options} Request configuration, for the current request
 */
 export function request(url: string,params: any,method: Method, headers:Headers,hasToast:Boolean = true){
    let data = {}
        // Get requests use the PARAMS field
        if(method =='get')data = {params}
        // Post requests use the data field
        if(method =='post')data = {data:params}
        const newParams: any = {
            url,
            method,
            ...data,
        }
        headers ? newParams['headers'] = headers : ''
        return service(newParams).then((res: any) => {
          const { code, msg } = res
          if(code == '200' || code == 'true' || code == 'false' || code == true || !code) {
            return Promise.resolve(res)
          }
          hasToast ? Toast(msg || 'Fail'):''
          return Promise.reject(res)
        })
}
// GET
export function httpGet(url:string,params: any = {}, headers: any = null, hasToast = true){
    return request(url,params,'get',headers,hasToast)
}
// POST
export function httpPost(url: string,params: any = {}, headers: any = null, hasToast = true){
    return request(url,params,'post',headers,hasToast)
}
