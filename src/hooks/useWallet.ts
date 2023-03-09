import router from '@/router'
import { getWallet, AccountInfo, wallet } from '@/store/modules/account'
import eventBus from '@/utils/bus'
import { useStore } from 'vuex'
import { useLogin } from '@/components/navHeader/hooks/login'
import { useRoute } from 'vue-router'
import { getQuery } from '@/utils/utils'
import { useExchanges } from "@/hooks/useExchanges";
import store from '@/store/index'
import { getCookies } from '@/utils/jsCookie'
import localforage from 'localforage';

// init wallet
export const useWallet = () => {
    const query = getQuery()
    const initWallet = async () => {
        console.log('initWallet------------',store)
        const { dispatch } = store
        const { hasAccount } = useLogin()
        const hasAcc = await hasAccount()
        const password = getCookies()
        try {
            let newwallet = await getWallet()
            dispatch('account/updateAllBalance')
            dispatch('account/getEthAccountInfo')
            eventBus.emit('walletReady', newwallet)
        } catch (err) {
            const isDoc = location.href.indexOf('privacyNotice') > -1 || location.href.indexOf('termsOfUse') > -1 ? true : false
            console.error('err', err)
            if(err && err.toString().indexOf('invalid password') > -1 && !isDoc) {
                router.replace({ name: 'withpassword', query })
                return 
            }
            if(hasAcc && !password && !isDoc) {
               router.replace({ name: 'withpassword', query })
               return
            }
            if(!hasAcc && !password  && !isDoc) {
                router.replace({ name: 'guidance' })
            }
        }
    }
    return {
        initWallet
    }
}