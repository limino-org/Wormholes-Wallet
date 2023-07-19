import {version} from '@/enum/version'
import router from '@/router';
import { decimal } from "@/utils/filters";

import { erb_price } from '@/http/modules/price'
import Cookies from 'js-cookie'
import localforage from 'localforage';
import { getWallet } from './account';
import store from '../index'
type WalletToken = {
  seconds: number
  time: number
  value: string | null
}
interface State {
  language: string;
  version: string;
  chainVersion: string;
// List arrangement
  layoutType: string;
  // Convert the amount to U.S. dollars
  transferUSDRate: number;
// Change RMB
  transferCNYRate: number;
  //Unique to each window, the browser session ID
  conversationId: string;
  finishedGuide: boolean;
  lastDelayTime: null | number;
  hasBackUpMnemonic: boolean;
  show0: boolean;
  show1: boolean;
  show2: boolean;
  show3: boolean;
  show4: boolean;
  show5: boolean;
  show6: boolean;
  show7: boolean;
  show8: boolean;
  show9: boolean;
  show10: boolean;
  show11: boolean;
  show12: boolean;
  show13: boolean;
  wallet_token: WalletToken;
  movePwd: boolean
}
export default {
  state: {
    version,
    chainVersion:'',
    language: "en",
    layoutType: "card",
    layoutList: [
      //   list：，card 
      { value: "list"},
      { value: "card"},
    ],
    // Dollar to dollar ratio
    transferUSDRate: 0.5,
     // RMB exchange rate
    transferCNYRate: 0.6,
    conversationId:'',
    finishedGuide: false,
    show0: true,
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    show7: false,
    show8: false,
    show9: false,
    show10: false,
    show11: false,
    show12: false,
    show13: false,
    wallet_token:{
      seconds: 0,
      time: 0,
      value: null
    },
    movePwd: false,
    lastDelayTime: null,
    hasBackUpMnemonic: false
  },
  mutations: {
    UPDATE_CHAINVERSION(state: State, value: string) {
      state.chainVersion = value
    },
    UPDATE_LANGUAGE(state: State, value: string) {
      state.language = value;
    },
    UPDATE_GUIDEFLAG(state: State, val: boolean){
      state.finishedGuide = val
    },  
    UPDATE_LAYOUTTYPE(state: State, type: string) {
      state.layoutType = type;
    },
    UPDATE_VERSION(state: State, value: string) {
      state.version = value;
    },
    //Convert the amount to dollars
    UPDATE_TRANSFERUSDRATE(state:State, val: number){
      state.transferUSDRate = val
    },
    //exchange RMB
    UPDATE_TRANSFERCNYRATE(state:State, val: number){
      state.transferCNYRate = val
    },
    UPDATA_CONVERSATIONID(state: State, id: string) {
      state.conversationId = id
    },
    UPDATA_HIDE(state: State, idx: number) {
      // @ts-ignore
      state[`show${idx}`] ? (state[`show${idx}`] = false) : "";
    },
    UPDATA_SHOW(state: State, idx: number) {
      // @ts-ignore
      state[`show${idx}`] = true;
    },
    UPDATE_SYSTEM(state:State, system: State) {
      state.version = system.version
      state.language = system.language
      state.layoutType = system.layoutType
      state.finishedGuide = system.finishedGuide
      state.show0 = system.show0
      state.show1 = system.show1
      state.show2 = system.show2
      state.show3 = system.show3
      state.show4 = system.show4
      state.show5 = system.show5
      state.show6 = system.show6
      state.show7 = system.show7
      state.show8 = system.show8
      state.show9 = system.show9
      state.show10 = system.show10
      state.show11 = system.show11
      state.show12 = system.show12
      state.show13 = system.show13
    },
    UPDATE_WALLET_TOKEN(state: State, token: WalletToken) {
      const {seconds,time,value} = token
      state.wallet_token = {
        seconds,
        time,
        value:''
      }
    },
    UPDATE_MOVEPWD(state: State, flag: boolean) {
      state.movePwd = flag
    },
    UPDATE_LASTDELAYTIME(state:State, time: number){
      state.lastDelayTime = time
    },
    UPDATE_HASBACKUPMNEMONIC(state: State, val: boolean){
      state.hasBackUpMnemonic = val
    },
  },
  actions: {
    closeGuide({commit,state}:any){
      commit('UPDATE_GUIDEFLAG', true)
      for(let i = 1;i<=13;i++){
        commit('UPDATA_HIDE', i)
      }
    },
    showDialog({ commit, state }: any, idx: number) {
      commit("UPDATA_HIDE", idx);
      if (idx === 7) {
        commit("UPDATA_SHOW", 13);
      } else {
        commit("UPDATA_SHOW", idx+1);
      }
    },
    
    // Set the language
    setLanguage({ commit, state, dispatch }: any, lang: string) {
      commit("UPDATE_LANGUAGE", lang);
      return Promise.resolve(lang);
    },
    // Set the NFT collection list arrangement
    setListLayout({ commit }: any, type: string) {
      commit("UPDATE_LAYOUTTYPE", type);
      return Promise.resolve(type);
    },
    // renew version
    setVersion({ commit, state }: any, value: string) {
      if (!state.version || value != state.version) {
        localStorage.clear()
        sessionStorage.clear()
        localforage.clear()
        location.reload()
      }
      return Promise.resolve(value);
    },
    async getChainVersion({commit, state}: any, wallet: any){
      const version =  await wallet.provider.send('eth_version')
      const { chainId } =  await wallet.provider.getNetwork()
      const { id } = store.state.account.currentNetwork
      const queryList = [
        `async-${id}-${chainId}`,
        `txQueue-${id}-${chainId}`,
        `txlist-${id}-${chainId}`
      ]
      const oldVersion = state.chainVersion
      if(oldVersion && version != oldVersion) {
        localforage.iterate((value, key, iterationNumber) => {
          console.log('clear cancel', key)
          if (key !== "vuex") {
            const flag = queryList.some(str => key.indexOf(str) > -1)
            console.log('clear cancel', key)
            if(flag){
              localforage.removeItem(key);
            }
          } else {
            [key, value]
          }
        });
      }
      commit('UPDATE_CHAINVERSION', version)
    },
    // Obtain the dollar exchange rate
    getTransferUSDRate({commit, state}: any) {
      return erb_price().then((res:any) => {
        const { CNY,USD } = res
        commit('UPDATE_TRANSFERUSDRATE', USD)
        commit('UPDATE_TRANSFERCNYRATE', CNY)
      })
    },
  },
  getters: {
        // Current account balance
    getAmount(state: State) {
      const amount = store.state.account.accountInfo.amount;
      return decimal(amount);
    },
    // Whether the pop-up window guides the pop-up window
    getGuideModal(state: State){
      const { finishedGuide, show0, show1, show2,show3,show4, show5, show6, show7 } = state
      if(show1 || show2 || show3 || show4 || show5 || show6 || show7) {
        return false
      }
      if(finishedGuide){
        return false
      } else {
        return true
      }
    }
  },
  namespaced: true,
};
