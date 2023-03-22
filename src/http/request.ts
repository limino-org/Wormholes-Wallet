import axios, { Method } from 'axios'
import { Toast } from 'vant'
const service = axios.create({
    // Set the baseur address. If you cross domains through proxy, you can directly fill in the base address
    baseURL: '/',
    // Define unified request headers
    headers: {
       "Content-Type": "application/json; charset=UTF-8"
    },
    // Configure request timeout
    timeout: 60000, 
    // If jsonp is used, this parameter can be configured to bring cookie credentials. If it is proxy or CORS, it does not need to be set
    // withCredentials: true
})
// Request interception
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
      console.error('request: ', JSON.stringify(error))
      // Toast(error.message || `Request Error code:${error.code}`)
      return Promise.reject(error)
    }
  )
  
/**
 * Core function, which can handle all request data and make horizontal expansion
 * @param {url} Request address
 * @param {params} Request parameters
 * @param {options} Request configuration for the current request；
 */
 export function request(url: string,params: any,method: Method, headers:Headers){
    let data = {}
        // Get request uses params field
        if(method =='get')data = {params}
        // Use data field for post request
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
          Toast(msg || 'Interface request failed')
          return Promise.reject(res)
        })
}
// Encapsulate get request
export function httpGet(url:string,params: any = {}, headers: any = null){
    return request(url,params,'get',headers)
}
// Encapsulate post request
export function httpPost(url: string,params: any = {}, headers: any = null){
    return request(url,params,'post',headers)
}
