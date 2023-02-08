
import  { getConfiguration, getRedemption } from '@/http/modules/common'
interface State {
    setting: any
}
export default {
    state: {
        setting: {
            conversion: {},
            redemption: {
              validator_redemption_number: 72,
              nftminer_redemption_number: 72
            }
                
        }
    },
    mutations: {
        UPDATE_SETTING(state: State, value: string){
            state.setting = value
        }
    },
    actions: {
       async getConfiguration({commit, state, dispatch}: any){
        try {
          const res = await getConfiguration()
          const redemption = await getRedemption()
          commit('UPDATE_SETTING', {...res, redemption})
        } catch(err){
            console.error(err)
        }
        }
    },
    namespaced: true,
  }