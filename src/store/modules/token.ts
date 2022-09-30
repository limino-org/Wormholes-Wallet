
import { getWallet } from './account'
interface State {

}
export default {
    state: {
        
    },
    mutations: {
        // Add a token to the current account
        PUSH_TOKEN(state: State, token: any) {
    
        }
    },
    actions: {
        addToken({ state, commit, dispatch }: any, params: any){
            commit('PUSH_TOKEN', params)
        }
    },
    namespaced: true,
  }