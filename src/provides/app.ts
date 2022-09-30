import { useRouter } from "vue-router"
import { useStore } from "vuex"

export const provide = () => {
    const router = useRouter()
    const store = useStore()
    return {
        back(){
            router.back()
        },
        wallet(){
            return store.getters['account/wallet']
        },
        backHome(){
            router.replace({name:'wallet'})
        }
    }
}

export type AppProvide = {
    back: Function,
    wallet: Function,
    backHome:Function
}