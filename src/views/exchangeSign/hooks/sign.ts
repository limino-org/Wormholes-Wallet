import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { Toast } from 'vant';
import { onMounted, ref, Ref } from 'vue';
import { ethers } from 'ethers';
import { ConnectWalletByPwdAddress } from '@/store/modules/account'
import { getCookies } from '@/utils/jsCookie';
import i18n from '@/language/index'
import { decode } from 'js-base64';
import { debug } from 'console';

export const useSign = () => {
    const { global: { t } } = i18n
    const route = useRoute()
    const router = useRouter()
    const { query } = route
    const { dispatch, state } = useStore()
    const sign: Ref<string> = ref('')
    /**
     * address string
     * sig  Hex str
     * backUrl  
     */
    let { address, sig, backUrl: back } = query
    let isAdmin:Boolean = true
    const loading:Ref<boolean> = ref(false)
    const password = getCookies('password')
    const backUrl: Ref<string> = ref('')
    const toSign = (opt: SignParams) => {
        let call: Function = () => {}
        if(opt){
            address =  opt.address
            sig = opt.sig
            call = opt.call ? opt.call : () =>{}
            isAdmin = typeof opt.isAdmin == 'boolean' ? opt.isAdmin : true
        }
        if(!sig){
            Toast(i18n.global.t('sign.signature'))
            return
        }
        if(!password){
            Toast(i18n.global.t('sign.password'))
            router.replace({ name: "withpassword" });
            return 
        }
        loading.value = true
        const params: ConnectWalletByPwdAddress = {
            password,
            address: address?.toString() || ''
        }
        
        
        return dispatch('account/connectWalletByPwdAddress', params).then(async (wallet) => {
            console.log('wallet', wallet)
            try {
                const sstr = sig
                
                if(sstr?.toString().startsWith('[') && sstr?.toString().endsWith(']')) {
                    const arr = sstr?.toString().replace('[','').replace(']','').split(',')
                    if(isAdmin){
                        const sigArr: any = []
                        arr.forEach(key => {
                            const sigmsg = ethers.utils.joinSignature(new ethers.utils.SigningKey(wallet.privateKey).signDigest(key))
                            sigArr.push(sigmsg)
                        })
                        sign.value = sigArr
                        const backstr = decode(back?.toString() || '')
                        const newBack =`${backstr}${backstr.indexOf('?') > -1 ? '&' : '?'}` 
                        backUrl.value = `${newBack}sig=${JSON.stringify(sign.value)}`
                    } else {
                        const sigArr: any = []
                        for await (const key of arr) {
                            sigArr.push(await wallet.signMessage(key))
                        }
                        sign.value = sigArr
                    }
                    
                } else {
                    if(isAdmin){
                        //@ts-ignore  
                        sign.value = ethers.utils.joinSignature(new ethers.utils.SigningKey(wallet.privateKey).signDigest(sstr))
                        const backstr = decode(back?.toString() || '')
                        const newBack =`${backstr}${backstr.indexOf('?') > -1 ? '&' : '?'}` 
                        backUrl.value = `${newBack}sig=${sign.value}`
                    } else {
                       sign.value = await wallet.signMessage(sstr)
                    }
                }

                call(sign.value)
                return sign.value
            } catch(err: any){
                console.error(err || t('sign.unknownmistake'))
                Toast(err || t('sign.unknownmistake'))
            }
        }).catch(err => Toast(err)).finally(() => loading.value = false)
        
    }
    return {
        toSign,
        loading,
        password,
        sign,
        address,
        backUrl
    }
}


interface SignParams {
    address: string
    sig: string
    call?: Function
    isAdmin?: Boolean
}