import localforage from "localforage"

interface State {
    keyStore: any
}
export default {
    state: {
        keyStore:null
    },
    getters:{
        get_mnemonic(state: any){
            return state.keyStore
        }
    },
    mutations: {
        UPDATE_MNEMONIC(state: State, keyStore: any) {
            state.keyStore = keyStore
            // let time = setTimeout(async() => {
            //    await localforage.removeItem('mnemonic')
            //    clearTimeout(time)
            // })
        }
    },
    actions: {

    },
    namespaced: true,
  }