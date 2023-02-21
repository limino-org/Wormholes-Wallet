// @ts-nocheck
import { SetupContext, Ref, ref, reactive, defineComponent, computed, toRaw, nextTick } from "vue";
import { CreateWalletByJsonParams, CreateWalletByMnemonicParams } from '@/utils/ether'
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import { parseMnemonic } from '@/utils/web3'
import { setCookies, getCookies, hasLogin } from '@/utils/jsCookie'
import { encryptPrivateKey, EncryptPrivateKeyParams } from '@/utils/web3'
import eventBus from "@/utils/bus";
import { useBroadCast } from '@/utils/broadCast'
import i18n from "@/language/index";
import store from '@/store/index'
import { Toast } from "vant";
import router from "@/router";
import { Mnemonic } from "ethers/lib/utils";
import { useExchanges } from "@/hooks/useExchanges";
import localforage from "localforage";
export const useToggleAccount = () => {
  const { commit, dispatch, state } = store
  const { handleUpdate } = useBroadCast()
  const createLoading: Ref<boolean> = ref(false)
  const listDom = ref()
  const showAccount: Ref<boolean> = ref(false);
  const toggleAccount = () => {
    showAccount.value = true;
  };
  // const { initExchangeData } = useExchanges()
  const options = computed(() => store.state.account.accountList)
  const accountLoading: Ref<boolean> = ref(false)
  const clickAccountIdx: Ref<number | null> = ref(null)
  const handleAccount = async (account: any, idx: number) => {
    if (createLoading.value) {
      return
    }
    eventBus.emit('beforeChangeAccount')
    accountLoading.value = true
    clickAccountIdx.value = idx
    const { currentNetwork } = store.state.account
    const password: string = getCookies('password') || ''
    const keyStore = toRaw(account.keyStore)
    const data: CreateWalletByJsonParams = {
      password,
      json: keyStore
    }
    try {
      const wall = await dispatch('account/createWalletByJson', data)
      eventBus.emit('changeAccount', wall.address)
      commit('account/UPDATE_ACCOUNTINFO', account)
      dispatch('account/updateTokensBalances')
      dispatch("account/getProviderWallet");
      dispatch("account/getExchangeStatus").then(res => {
        // if (res.status == 2 && res.exchanger_flag) {
        //   initExchangeData()
        // }
      })

      handleUpdate()
      return wall
    } catch (err) {
      const errstr = String(err)
      if (errstr.indexOf('password') > -1) {
        router.replace({ name: 'withpassword' })
      }
    } finally {
      accountLoading.value = false
      clickAccountIdx.value = null
    }
    showAccount.value = false
  };

  const keyStore = computed(() => store.state.mnemonic.keyStore)
  const createWalletByPath = async (callBack: Function = () => { }) => {
    const { pathIndex, path }: any = { ...store.state.account.mnemonic }
    const password: string = getCookies('password') || ''
    // const mnemonicJson = await localforage.getItem('mnemonic')
    let phrase: string = await parseMnemonic(password, keyStore.value)
    let mnemonic: CreateWalletByMnemonicParams = { pathIndex, phrase, path }
    let wallet = await dispatch("account/createWallet", mnemonic);
    let { privateKey, address } = wallet
    const hasAccount = await dispatch('account/hasAccountByAddress', address)
    if (hasAccount) {
      const pidx = Number(pathIndex) + 1 + ''
      commit('account/UPDATE_MNEMONIC', {
        pathIndex: pidx,
        path
      })
      // let time = setTimeout(() => {
      //   createWalletByPath(callBack)
      //   clearTimeout(time)
      // })
      createWalletByPath(callBack)
    } else {
      // let time = setTimeout(() => {
      //   callBack(wallet, mnemonic)
      //   clearTimeout(time)
      // })
      callBack(wallet, mnemonic)
    }
  }

  const createAccount = () => {
    createLoading.value = true
    let time = setTimeout(() => {
      const password: string = getCookies('password') || ''
      if (!password) {
        router.replace({ name: 'withpassword' })
      }
      createWalletByPath((wallet: any, mnemonic: Mnemonic) => {
        
        eventBus.emit('beforeChangeAccount')
        const { privateKey, address } = wallet
        const params: EncryptPrivateKeyParams = {
          privateKey,
          password
        }
        const keyStore = encryptPrivateKey(params)
        dispatch('account/addAccount', { keyStore, mnemonic, address }).then(() => {
          eventBus.emit('changeAccount', address)
          clearTimeout(time)
          handleUpdate()
          dispatch("account/getExchangeStatus")
          nextTick(() => {
            listDom.value.scrollTop = listDom.value.scrollHeight
          })
        }).finally(() => {
          createLoading.value = false
        })
      })
    })



  }
  return {
    showAccount,
    toggleAccount,
    options,
    handleAccount,
    createLoading,
    createAccount,
    accountLoading,
    clickAccountIdx,
    listDom
  }
}
