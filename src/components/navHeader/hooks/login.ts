import { useRouter } from "vue-router"
import { clearWallet } from '@/store/modules/account'
import { useStore } from "vuex"
import { setCookies, getCookies, loginOut, hasLogin } from '@/utils/jsCookie'
import { getQuery } from "@/utils/utils"
import Vrouter from "@/router";
import localforage from 'localforage'
export const useLogin = () => {
    const route = Vrouter.currentRoute.value;
    const router = Vrouter;
    const logout = () => {
        clearWallet()
        loginOut()
        const query = getQuery()
        console.log('tologin', '0', query)
        router.replace({ name: 'withpassword',query: query || {} })
    }
    const authentication = () => {
        return hasLogin()
    }

    const hasAccount = async () => {
        const vuex = await localforage.getItem('vuex') || null
        try {
            // @ts-ignore
            if (vuex && vuex.account.accountList.length) {
                return true
            } else {
                return false
            }
        } catch (err) {
            return false
        }
    }
    return {
        logout,
        authentication,
        hasAccount
    }
}
