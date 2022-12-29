
import  {getConfiguration} from '@/http/modules/common'
interface State {
    setting: any
}
export default {
    state: {
        setting: {
            conversion: {}
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
          commit('UPDATE_SETTING', res)
        } catch(err){
            console.error(err)
        }
        }
    },
    namespaced: true,
  }