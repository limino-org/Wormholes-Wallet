import { httpGet, httpPost } from '../request'

export const isProduct = process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'test' ? true : false
const api = isProduct ? '' : '/createExchange'
const serviceApi = '/serviceApi'
const wormholesApi = isProduct ? '' : '/wormholesApi'
const exchangeApi = isProduct ?'':'/exchangeApi'
const exchansApi = isProduct ? '' : '/exchans'
// Create an exchange with one click
export const createExchange = (data: any) => {
    return httpGet(`${api}/install/do_conf`, data)
}

// Example Query whether the exchange is generated successfully
export const is_install = (address: string) => {
    return httpGet(`${api}/install/is_install`, { address: address.toLowerCase() },null,false)
}



// Obtaining Account Information
export const getAccountInfo = (address: string) => {
    return httpPost('/nodeApi', { jsonrpc: "2.0", method: "eth_getAccountInfo", params: [address, "latest"], id: 20211209 })
}

// Queries whether hosting fees have been sent
export const issuccessdeal = (address: string) => {
    return httpGet(`${serviceApi}/issuccessdeal`, { address: address.toLowerCase() })

}




// One-click exchange to get the address
export const getSysParams = (address: string, params = {}) => {
    return httpGet(`${exchangeApi}/c${address.toLowerCase()}/v2/querySysParams`, params)
}

/**
 * Query exchange signature data
 * @param address 
 * @param params 
 * @returns boolean
 */
export const getExchangeSig = (address: string, params = {}) => {
    return httpGet(`${exchangeApi}/c${address.toLowerCase()}/v2/getExchangeSig`, params)
}



// Set System information Set one-click exchange data
export const setExchangeSig = (address: string, params = {}) => {
    console.log('params', JSON.stringify(params))
    return httpPost(`${exchangeApi}/c${address.toLowerCase()}/v2/setExchangeSig`, params)
}

// Get the smart contract address
export const getContractAddress = () => {
    return httpGet(`https://www.wormholes.com/upload/ERBPay.json?${new Date().getTime()}`)
}

export const getConfiguration = () => {
    return httpGet(`https://www.wormholes.com/upload/configuration.json?${new Date().getTime()}`)
}

export const getRedemption = () => {
    return httpGet(`https://www.limino.com/wallet_conf/wallet.json?${new Date().getTime()}`)
}

// const contractApi = isProduct ? 'contractApi' : 'contractApi'
const contractApi = isProduct ? 'contractApi' : 'contractApi'

export const checkAuth = (address: string) => {
    return httpGet(`${contractApi}/extra/checkAuth`,{address})
}
// Query the account information of the specified address
export const getAccountAddr = (address: string) => {
    return httpGet(`${contractApi}/account/${address}`,{})
}


// Get user NFT reward information  nftaward/v1/queryuseraward
export const queryuseraward = (user_addr: string) => {
    return httpPost(`${exchansApi}/nftaward/v1/queryuseraward`,{user_addr})
}


/**
 * receive award /v1/receiveuseraward
 * award_type erb/snft/exchange
 * @param {user_addr}
 * @param {award_type}
 * @returns 
 */
export const receiveuseraward = (params: any) => {
    return httpPost(`${exchansApi}/nftaward/v1/receiveuseraward`, params)
}


