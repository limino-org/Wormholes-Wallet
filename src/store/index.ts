// @ts-nocheck
import { createStore } from 'vuex'
import common from './modules/common'
import account from './modules/account'
import price from './modules/price'
import system from './modules/system'
import configuration from './modules/configuration'
import mnemonic from './modules/mnemonic'
import { clone } from 'pouchdb-utils';
import transfer  from './modules/transfer'
import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

window.localforage = localforage
const vuexLocal = new VuexPersistence({
  storage: localforage,
  asyncStorage: true,
  reducer: (store) => {
    const {
    account:{
      mnemonic:mnemonicPath,
      path,
      wallet,
      accountList,
      currentNetwork,
      netWorkList,
      keyStore,
      accountInfo,
      networkType,
      recentList,
      exchangeGuidance,
      firstTime,
      tranactionList,
      exchangeStatus,
      exchangeServer

    },
    price,
    system: {
      language,
      version,
      layoutType,
      transferUSDRate,
      transferCNYRate,
      finishedGuide,
      show0,
      show1,
      show2,
      show3,
      show4,
      show5,
      show6,
      show7,
      show8,
      show9,
      show10,
      show11,
      show12,
      show13,
      wallet_token,
      movePwd,
      hasBackUpMnemonic,
      lastDelayTime,
    },
    common,
    transfer,
    mnemonic,
    configuration
    } = store

    return clone(({
      account:{
        mnemonic:mnemonicPath,
        path,
        wallet,
        accountList,
        currentNetwork,
        netWorkList,
        keyStore,
        accountInfo,
        networkType,
        recentList,
        exchangeGuidance,
        firstTime,
        tranactionList,
        exchangeStatus,
        exchangeServer,
      },
      common,
      price,
      transfer,
      mnemonic,
      system: {
        language,
        version,
        layoutType,
        transferUSDRate,
        transferCNYRate,
  
        finishedGuide,
        show0,
        show1,
        show2,
        show3,
        show4,
        show5,
        show6,
        show7,
        show8,
        show9,
        show10,
        show11,
        show12,
        show13,
        wallet_token,
        movePwd,
        hasBackUpMnemonic,
        lastDelayTime,
      },
      configuration
    }))
  },
});

const store = createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    account,
    price,
    system,
    common,
    transfer,
    mnemonic,
    configuration

  },
  plugins: [
    vuexLocal.plugin
  ]
})


window.store = store
export default store
export interface StoreReturns {
  [key: string]: any
}
