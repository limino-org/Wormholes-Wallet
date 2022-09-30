
import { getWallet } from './account'
interface State {
    eth_usd_price: string
}
export default {
    state: {
        eth_usd_price:'0'
    },
    mutations: {
        UPDATE_ETH_USD_PRICE(state: State, value: string){
            state.eth_usd_price = value
        }
    },
    actions: {
       async getEtherPrice({commit, state, dispatch}: any, symbol: string){
            const wallet = await getWallet()
            return wallet.provider.getEtherPrice('usd').then((res:any) => {
                commit('UPDATE_ETH_USD_PRICE', res)
            })
        }
    },
    namespaced: true,
  }