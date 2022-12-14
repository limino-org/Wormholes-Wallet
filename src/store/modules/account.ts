import { Toast, Notify } from "vant";
import { ethers, utils } from "ethers";
import BigNumber from "bignumber.js";
import eventBus from "@/utils/bus";
// @ts-ignore
window.utils = utils;
import {
  createWalletByMnemonic,
  createWalletByJson,
  CreateWalletByJsonParams,
  ImportPrivateKey,
  CreateWalletByMnemonicParams,
  createRandomWallet,
} from "@/utils/ether";
import { getRandomIcon, guid } from "@/utils/index";
import { toRaw } from "vue";
import { TransactionData, TransactionParams } from "./index";
import { ETH, Token } from "@/utils/token";
import { getPath } from "@/utils/ether";
import { checkAuth } from "@/http/modules/common";
import { useStore } from "vuex";
import store from "@/store/index";
import {
  NetWorkData,
  netWorklist,
  TransactionList,
  TransactionRecord,
} from "@/enum/network";
// import { getEtherBalances } from "@mycrypto/eth-scan";
import { useGasPrice } from "@/hooks/useGasPrice";
import { setCookies, getCookies } from "@/utils/jsCookie";
import router from "@/router";
import { is_install, issuccessdeal } from "@/http/modules/common";
import { getQuery } from "@/utils/utils";
import { useI18n } from "vue-i18n";
import i18n from "@/language/index";
const erc20Abi: any = require("@/assets/json/erc20Abi.json");
import { getContractAddress } from "@/http/modules/common";
import localforage from 'localforage';
import { useToast } from "@/plugins/toast";
import Bignumber from 'bignumber.js'
import { web3 } from "@/utils/web3";
import { Console } from "console";
export interface State {
  mnemonic: Mnemonic;
  path: string;
  wallet: any;
  ethNetwork: Object,
  accountList: Array<any>;
  currentNetwork: NetWorkData;
  netWorkList: Array<NetWorkData>;
  keyStore: Object;
  accountInfo: AccountInfo;
  chainAccountInfo: any;
  exchangeStatus: ExchangeStatus;
  networkType: number;
  recentList: Array<any>;
  contractAddress: string
  exchangeGuidance: boolean
  exchangeServer: boolean;
  firstTime: boolean
  netStatus: NetStatus
  tranactionList: Array<any>;
  minerTotalProfit: number;
  exchangeTotalProfit: number
  ethAccountInfo: Object

}

export enum NetStatus {
  pendding = "pendding",
  success = "success",
  fail = "fail"
}
export type ExchangeStatus = {
  status: number;
  exchanger_flag: boolean;
};
export interface AddressBalance {
  address: string;
  balance: string;
}

export interface Mnemonic {
  path: string;
  phrase?: string;
  pathIndex?: string;
}

export interface AccountInfo {
  address: string;
  // Scrip balance
  amount: string;
  currency: string;
  // Convert to a dollar balance
  transformAmount: number;
  name: string;
  accountIcon: string;
  balance: string;
  keyStore: JSON;
  // transaction record
  transactionRecord: Array<TransactionData>;
  token: Array<any>;
}
//  params
export interface SendTransactionParams {
  value: string;
  to: string;
  gasPrice: string;
  gasLimit: number;
  data?: string
  transitionType?: string
  nft_address?: string
  checkTxQueue?: boolean

}

// Tokens trading params

export interface SendTokenParams {
  address: string;
  amount: any;
  gasPrice: string;
  gasLimit: number;
  to: string;
  checkTxQueue?: boolean
}

export interface AddAccountParams {
  keyStore: {
    [key: string]: any;
  };
  mnemonic: Mnemonic;
  address: string,
  imported?: boolean
}

export interface RandomWallet {
  password: string;
  mnemonic: CreateWalletByMnemonicParams;
}
type CurrentAccountParams = {
  address: string;
  amount: string;
};
export type ConnectWalletByPwdAddress = {
  address: string;
  password: string;
};


export enum TransactionSendStatus {
  pendding = "pendding",
  success = 'success',
}


// wallet
export let wallet: any = null;
export const getWallet = () => {
  if (!wallet || !wallet.provider) {
    return createWallet()
  }
  return Promise.resolve(wallet);
};
const createWallet = async () => {
  const wal: any = await store.dispatch('account/getProviderWallet')
    return wal
  // try {
  //   const vuex: any = await localforage.getItem('vuex')
  //   if (vuex) {
  //     const { accountInfo } = vuex.account;
  //     const { keyStore } = accountInfo;
  //     const password: string = getCookies("password") || "";
  //     if (!password) {
  //       const query = getQuery();
  //       router.push({ name: "withpassword", query });
  //       return Promise.reject(i18n.global.t("common.withpassword"));
  //     }
  //     // Load the wallet with the password and keyStore
  //     const wa = await createWalletByJson({ password, json: keyStore });
  //     const { URL } = vuex.account.currentNetwork
  //     const provider = ethers.getDefaultProvider(URL)
  //     // @ts-ignore
  //     const wall = wa.connect(provider)
  //     const network = await wall.provider.getNetwork()
  //     wallet = wall
  //     store.commit('account/UPDATE_NETSTATUS', NetStatus.success)
  //     return Promise.resolve(wall)
  //   }
  // } catch (err) {
  //   console.error('-----------------', err)
  //   // Toast(err?.toString())
  //   store.commit('account/UPDATE_NETSTATUS', NetStatus.fail)
  //   return Promise.reject(null)
  // }


}
// clear wallet
export const clearWallet = () => {
  wallet = null;
};

// calc gasFee
export const getGasFee = async (tx: any) => {
  try {
    const wall = await getWallet()
    const gasPrice = await wall.provider.getGasPrice()
    const gasLimit = await wall.estimateGas(tx)
    const limitStr = ethers.utils.formatEther(gasLimit)
    const priceStr = ethers.utils.formatUnits(gasPrice,'wei')
    const gasFee = new Bignumber(limitStr).multipliedBy(priceStr).toFixed(9)
    return gasFee.toString()
  } catch (err) {
    console.error(err)
    return Promise.reject(err)
  }
}

export default {
  state: {
    mnemonic: {
      path: "",
      phrase: "",
    },
    // On link account data
    chainAccountInfo: {},
    // Account list
    accountList: [],
    // List of network
    netWorkList: netWorklist.map((item) => item),
    // Netlist Indicates the instance of the currently selected network
    currentNetwork: { ...netWorklist[0] },
    // KeyStore for the current wallet instance
    keyStore: {},
    // Current account data
    accountInfo: {
      address: "",
      // Scrip balance
      amount: 0,
      currency: "USD",
      // Convert to a dollar balance
      transformAmount: 0,
      name: "",
      transactionRecord: [],
      token: [],
    },
    //Open exchange status 2 Second successful exchanger_Flag true First successful
    exchangeStatus: {
      status: 0,
      exchanger_flag: false,
    },
    ethAccountInfo:{},
    ethNetwork:{},
    recentList: [],
    // network switcher
    networkType: 1,
    // Smart Contract Address
    contractAddress: "",
    exchangeGuidance: false,
    exchangeServer: false,
    firstTime: true,
    netStatus: NetStatus.pendding,
    tranactionList: [],
    // miner total profit
    minerTotalProfit: 4856544,
    // exchange total profit
    exchangeTotalProfit: 2522880
  },
  getters: {
    // The token of the current account
    accountTokens(state: State) {
      const account = state.accountInfo;
      const address = account.address.toUpperCase();
      return state.currentNetwork.tokens[address] || [];
    },
  },
  mutations: {
    UPDATE_ETHNETWORK(state: State, val: any) {
      state.ethNetwork = val
    },
    UPDATE_EXCHANGEGUIDANCE(state: State, value: boolean) {
      state.exchangeGuidance = value
    },
    UPDATE_EXCHANGESERVER(state: State, value: boolean) {
      state.exchangeServer = value
    },
    // Update Network Switchover
    UPDATE_NEXTWORKTYPE(state: State, value: number) {
      state.networkType = value
    },
    // Updating the Network Status
    UPDATE_NETSTATUS(state: State, status: NetStatus) {
      state.netStatus = status
    },
    // Update the mnemonic
    UPDATE_MNEMONIC(state: State, value: Mnemonic) {
      const { path, pathIndex } = value;
      const data = { path, pathIndex };
      state.mnemonic = data;
    },
    // Update the purse
    UPDATE_WALLET(state: State, value: any) {
      console.log('value', value)
      wallet = value;
    },
    // The new account
    ADD_ACCOUNT(state: State, value: Array<Object>) {
      state.accountList = value;
    },
    // New account updated the URL of the Wormholes network
    UPDATE_WORMHOLES_URL(state: State, { URL, browser,chainId }: any) {
      let flag = false
      if (state.currentNetwork.isMain) {
        if(state.currentNetwork.URL != URL || state.currentNetwork.browser != browser) {
          flag = true
        }
        state.currentNetwork.URL = URL;
        state.currentNetwork.browser = browser;
      }
      state.netWorkList.forEach(item => {
        if(item.isMain){
          if(item.URL != URL || item.browser != browser) {
            flag = true
          }
          item.URL = URL;
          item.browser = browser;
        }
      })
      if(flag){
        Toast.loading({
          message: i18n.global.t('common.asyncData'),
          duration: 0
        })
        setTimeout(() => {
          if(flag) {
            location.reload()
          }
        },1000)
      }


    },
    // Example Update the ID of the primary network chain
    UPDATE_WORMHOLES_CHAINID(state:State, chainId: number) {
      if (state.currentNetwork.isMain) {
        state.currentNetwork.chainId = chainId
      }
      state.netWorkList.forEach(item => {
        if(item.isMain){
          item.chainId = chainId
        }
      })
    },
    // Update network links
    UPDATE_NETWORK(state: State, value: NetWorkData) {
      state.currentNetwork = value;
      for (let i = 0; i < state.netWorkList.length; i++) {
        if (state.netWorkList[i].id == value.id) {
          state.netWorkList[i] = value;
        }
      }
    },
    // Update the selected status of the network
    UPDATE_NETWORKSTATUS(state: State, value: NetWorkData) {
      state.netWorkList = state.netWorkList.filter((item) => {
        if (item.id === value.id) {
          item.select = true;
        } else {
          item.select = false;
        }
        return item;
      });
    },
    // Delete network by ID
    DETETE_NETWORK(state: State, id: string) {
      const list = state.netWorkList.filter((item) => item.id != id);
      state.netWorkList = list;
    },
    // Modify network data according to ID
    MODIF_NETWORK(state: State, network: NetWorkData) {
      const { id } = network;
      for (let i = 0; i < state.netWorkList.length; i++) {
        if (state.netWorkList[i].id == id) {
          state.netWorkList[i] = network;
        }
      }
    },
    // Update the current wallet keyStore
    UPDATE_KEYSTORE(state: State, value: Object) {
      state.keyStore = value;
    },
    // Update Account Information
    UPDATE_ACCOUNTINFO(state: State, value: AccountInfo) {
      state.accountInfo = value;
    },
    // A list of transactions pushed to the current account
    // Transaction list pushed to current account
    async PUSH_TRANSACTION(state: State, value: any) {
      console.warn('push', value)
      const { to, from, tokenAddress, network } = value;
      const txNetwork: NetWorkData = {...network};
      const { id, currencySymbol } = txNetwork
      const formAdd = from.toUpperCase();
      const txListKey = `txlist-${id}-${formAdd}`
      let txList: any = await localforage.getItem(txListKey)
      console.log('txList', txList)
      const receipt = {...value, symbol: currencySymbol}
      if(txList && txList.length) {
        txList.unshift(clone(receipt))
      } else {
        txList = [clone(receipt)]
      }
      // store.commit('account/DEL_TXQUEUE', value)
      console.log('set txList', txList)
      // save txlist
      localforage.setItem(txListKey, clone(txList))
      let time = setTimeout(() => {
        eventBus.emit('txPush', clone(receipt))
        clearTimeout(time)
      },0)
    },
    async UPDATE_TRANSACTION(state: State, da: any) {
      console.warn('da----', da)
      const { receipt, sendData, txType, network, transitionType, type, data , value, gasPrice, gasLimit, txId, tokenAddress, amount, isCancel} = da
      const {hash, nonce, from, to } = sendData
      const { id, currencySymbol } = network
      const date = new Date()
      const newReceipt = clone({
        date,
        hash,
        from,
        gasLimit,
        gasPrice,
        nonce,
        to,
        type,
        value,
        transitionType: transitionType || null,
        txType,
        network: clone(network),
        data,
        sendStatus: receipt ? TransactionSendStatus.success : TransactionSendStatus.pendding,
        sendData: clone(sendData),
        receipt: clone(receipt),
        tokenAddress,
        amount,
        isCancel: isCancel || null,
        txId
      })
      const formAdd = from.toUpperCase();
      const txListKey = `txlist-${id}-${formAdd}`
      let txList: any = await localforage.getItem(txListKey)
      if(txList && txList.length) {
        if(txList && txList.length) {
          for(let i=0;i< txList.length;i++){
            const item = txList[i]
            if(item.txId === txId){
              txList[i] = newReceipt
            }
          }
        }
      }
      await localforage.setItem(txListKey, txList)
      store.commit('account/DEL_TXQUEUE', da)
      let time = setTimeout(() => {
        eventBus.emit('txUpdate', newReceipt)
        clearTimeout(time)
      },0)
    },
    // Update transaction queue data
    UPDATE_TRANACTIONLIST(state: State, data: TransactionReceipt) {
      const { hash } = data;
      const list = state.tranactionList || [];
      const len = list.length;
      for (let i = 0; i < len; i++) {
        if (list[i].hash == hash) {
          // Update queue data
          list[i] = { ...data, code: "receive" };
        }
      }
      state.tranactionList = list
    },
    // Remove a transaction from the transaction queue according to the hash
    DELETE_TRANACTIONLIST(state: State, hash: string) {
      const list = state.tranactionList;
      let idx = list.find((item) => item.hash == hash);
      list.splice(idx, 1);
    },
    // Update the balance
    UPDATE_BALANCE(state: State, balance: string) {
      const address = wallet.address.toUpperCase();
      const accountList = toRaw(state.accountList);
      const accountInfo: any = state.accountInfo;
      if (accountInfo.address.toUpperCase() == address) {
        accountInfo.amount = balance;
        accountInfo.token.forEach((item: any) => {
          item.balance = balance;
        });
      }
      accountList.forEach((item: AccountInfo) => {
        if (item.address.toUpperCase() == address) {
          item.amount = balance;
          item.token.forEach((item: any) => {
            item.balance = balance;
          });
        }
      });
      state.accountList = accountList;
      state.accountInfo = accountInfo;
    },
    // Update the balance of all accounts
    UPDATE_ALLACCOUNT(state: State, allBalance: any) {
      const accountList = state.accountList;
      const accountInfo: AccountInfo = state.accountInfo;
      Object.keys(allBalance).forEach((key: string) => {
        accountList.forEach((item: any) => {
          const amount = ethers.utils.formatEther(allBalance[key]);
          if (item.address.toUpperCase() == key.toUpperCase()) {
            item.amount = amount;
            item.token.forEach((item: any) => {
              item.balance = amount;
            });
          }
          if (accountInfo.address.toUpperCase() == key.toUpperCase()) {
            accountInfo.amount = amount;
            accountInfo.token.forEach((child: any) => {
              child.balance = amount;
            });
          }
        });
      });
      state.accountList = accountList;
      state.accountInfo = accountInfo;
    },
    // Reset accountList
    UPDATA_ACCOUNTLIST(state: State, list = []) {
      state.accountList = list;
    },
    // Add a network to the list
    PUSH_NETWORK(state: State, network: NetWorkData) {
      state.netWorkList.push(network);
    },
    // Update the connection data
    UPDATE_CHAINACCOUNTINFO(state: State, val: any) {
      state.chainAccountInfo = val;
    },
    // Update the status of whether to open an exchange
    UPDATE_EXCHANGERSTATUS(state: State, val: ExchangeStatus) {
      state.exchangeStatus = val;
    },
    // Adds a token for the current account address
    ADD_ADDRESS(state: State, VAL: Token) { },
    // A maximum of 10 contacts can be retained
    PUSH_RECENTLIST(state: State, address: string) {
      if (!address) {
        return;
      }
      // Find your own accounts and contacts
      const myAccount = state.accountList.find(
        (item) => item.address.toUpperCase() == address.toUpperCase()
      );


      if (myAccount) {
        const theAccount = myAccount
        const idx = state.recentList.findIndex(
          (item) => item.address.toUpperCase() == address.toUpperCase()
        );
        if (idx > -1) {
          state.recentList.splice(idx, 1);
        }
        state.recentList.unshift(theAccount);
      } else {
        const idx = state.recentList.findIndex(
          (item) => item.address.toUpperCase() == address.toUpperCase()
        );
        if (idx > -1) {
          state.recentList.splice(idx, 1);
        }
        state.recentList.unshift({
          icon: getRandomIcon(),
          name: "-",
          address,
        });
      }
      const len = state.recentList.length;
      if (len > 10) {
        state.recentList.splice(len - 1, 1);
      }
    },
    // Update contractAddress
    UPDATE_CONTRACTADDRESS(state: State, ERBPay: string) {
      state.contractAddress = ERBPay
    },
    
    UPDATE_FIRSTTIME(state: State, bool: boolean) {
      state.firstTime = bool
    },
    // New trades are pushed to the trade queue
    async PUSH_TXQUEUE(state: State, tx: any) {
      const { network: { id }, from } = tx
      const date = new Date()
      const queuekey = `txQueue-${id}-${from.toUpperCase()}`
      const list: any = await localforage.getItem(queuekey)
      const txQueue = list && list.length ? list : []
      tx.txId = guid()
      tx.date = new Date()
      txQueue.push(tx)
      store.commit("account/PUSH_TRANSACTION", clone(tx));
      await localforage.setItem(queuekey, txQueue)
    },
    async UPDATE_TXQUEUE(state: State, tx: any) {
      const { txId } = tx
      const { network: { id } } = tx
      const queuekey = `txQueue-${id}`
      const list: any = await localforage.getItem(queuekey)
      const txQueue = list && list.length ? list : []
    },
    // Delete data from a queue
    async DEL_TXQUEUE(state: State, tx: any) {
      const {network:{id}, txId, from} = tx
      const queueKey = `txQueue-${id}-${from.toUpperCase()}`
      const list: any = await localforage.getItem(queueKey)
      const txQueue = list && list.length ? list : []
      const newList = txQueue.filter((item: any) => item.txId.toUpperCase() != txId.toUpperCase())
      await localforage.setItem(queueKey, newList)
    },
    UPDATE_ACCOUNT(state: State, account: State) {
      state.accountInfo = account.accountInfo
      state.accountList = account.accountList
      state.currentNetwork = account.currentNetwork
      state.exchangeStatus = account.exchangeStatus
      state.mnemonic = account.mnemonic
      state.netWorkList = account.netWorkList
      state.recentList = account.recentList
      state.tranactionList = account.tranactionList
      state.networkType = account.networkType
      state.chainAccountInfo = account.chainAccountInfo
      state.keyStore = account.keyStore
      state.firstTime = account.firstTime
      state.exchangeGuidance = account.exchangeGuidance
    },
    // Update EthAccountInfo
    UPDATE_ETHACCOUNTINFO(state: State, info: any) {
      state.ethAccountInfo = info
    }
  },
  actions: {
    // Determine if there is an account with an address in the wallet
    hasAccountByAddress({ commit, dispatch, state }: any, address: string) {
      const accountList = toRaw(state.accountList);
      const newAdd = address.toUpperCase();
      const acc = accountList.find(
        (item: any) => item.address.toUpperCase() == newAdd
      );
      return acc ? true : false;
    },
    // Create a Random Wallet
    createRandomWallet({ commit, dispatch }: any, params: RandomWallet) {
      const wallet = createRandomWallet();
      commit("UPDATE_WALLET", wallet);
      return Promise.resolve(wallet);
    },
    //Create a wallet from the keystore mnemonic
    async createWallet(
      { commit, dispatch }: any,
      params: CreateWalletByMnemonicParams
    ) {
      try {
        wallet = await dispatch("createWalletByMnemonic", params);
        commit("UPDATE_MNEMONIC", params);
        return Promise.resolve(wallet);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    // create an account
    async addAccount(
      { commit, state, dispatch }: any,
      { keyStore, mnemonic, address, imported }: AddAccountParams
    ) {
      let list = state.accountList;
      const len = list.length;
      const icon = getRandomIcon();
      const balance = await dispatch("getBalance");
      const { path, pathIndex }: any = mnemonic;
      const account = {
        name: `Account ${len + 1}`,
        keyStore,
        address,
        icon,
        transactionRecord: [],
        token: [{ ...ETH, balance }],
        mnemonic: { path, pathIndex },
        amount: balance,
        imported: imported ? true : false
      };
      if (len) {
        list.push(account);
      } else {
        list = [account];
      }
      dispatch("getProviderWallet");
      commit("UPDATE_ACCOUNTINFO", account);
      dispatch("updateAccount");
      commit("ADD_ACCOUNT", list);
      return Promise.resolve()
    },
    // Create wallets through mnemonics
    async createWalletByMnemonic(
      { commit }: any,
      params: CreateWalletByMnemonicParams
    ) {
      try {
        const { phrase, pathIndex } = params;
        wallet = await createWalletByMnemonic({ phrase, pathIndex });
        return wallet;
      } catch ({ reason }) {
        // Toast(`i18n.global.t("import.empty")}${reason}`);
        Toast(i18n.global.t("common.failedtoload"));
        console.error(reason)
      }
    },
    // Gets the balance of the current wallet
    async getBalance({ commit, state, dispatch }: any) {
      try {
        const newwallet = wallet && wallet.provider ? wallet : await dispatch("getProviderWallet");
        const balance = await newwallet.getBalance();
        const amount = ethers.utils.formatEther(balance);
        return amount;
      } catch (err) {
        console.error(err)
      }
    },
    //Delete the account according to the subscript
    deleteAccount({ commit, state }: any, idx: number) {
      state.accountList = state.accountList.filter((item: any, i: number) => i != idx)
    },
    //Switch account
    async updateAccount({ commit, state, dispatch }: any) {
      const newwallet = wallet && wallet.provider ? wallet : await dispatch("getProviderWallet");
      const balance = await newwallet.getBalance();
      const amount = ethers.utils.formatEther(balance);
      const address = newwallet.address;
      const accountList = toRaw(state.accountList);
      const {
        name,
        icon,
        transactionRecord,
        token,
        mnemonic: { path, pathIndex },
        keyStore,
      } = accountList.find(
        (item: any) => item.address.toUpperCase() == address.toUpperCase()
      );
      commit("UPDATE_ACCOUNTINFO", {
        amount,
        address,
        currency: "USD",
        transformAmount: 10200,
        name,
        icon,
        transactionRecord,
        token,
        mnemonic: { path, pathIndex },
        keyStore,
      });
      return newwallet;
    },
    // Create a wallet instance with the password keyStore
    async createWalletByJson(
      { commit, dispatch, state }: any,
      params: CreateWalletByJsonParams
    ) {
      try {
        wallet = await createWalletByJson(params);
        // And connect to the network
        const { currentNetwork } = state;
        dispatch("setNetWork", currentNetwork);
        return wallet;
      } catch (err) {
        return console.error(err);
      }
    },
    // Import the account using the private key
    async importPrivateKey({ commit, state }: any, privatekey: string) {
      try {
        const wa = await ImportPrivateKey({ privatekey });
        const { URL } = state.currentNetwork;
        // debugger
        let provider = ethers.getDefaultProvider(URL);
        const newWallet = wa.connect(provider)
        // During the import, check whether the address exists in the current account list. If the address exists, an exception is thrown and the import will not continue
        const { address } = newWallet;
        const { accountList } = state;
        const a = accountList.find(
          (item: any) => item.address.toUpperCase() == address.toUpperCase()
        );
        if (a) {
          return Promise.reject({ reason: i18n.global.t("common.existed"), address: a.address });
        } else {
          commit("UPDATE_WALLET", newWallet);
          return newWallet;
        }
      } catch (err) {
        return Promise.reject(err);
      }
    },
    // Set up the network
    async setNetWork({ commit, state, dispatch }: any, net: NetWorkData) {
      commit("UPDATE_NETWORK", net);
      const wallet = await dispatch("getProviderWallet");
      // The wallet links to the currently selected network
      return wallet;
    },
    // Update balance for all accounts
    async updateAllBalance({ commit, state, dispatch }: any) {
      try {
        const accountList = state.accountList;
        const list: Array<string> = accountList.map(
          (item: AccountInfo) => item.address
        );
        const asyncList = list.map((address) => {
          return dispatch("getBalanceByAddress", address);
        });
        const data = await Promise.all(asyncList);
        const banList: any = {};
        list.forEach((address, index) => {
          banList[address] = data[index];
        });
        commit('UPDATE_NETSTATUS', NetStatus.success)
        commit("UPDATE_ALLACCOUNT", banList);
        dispatch("updateTokensBalances");
        return Promise.resolve(banList);
      } catch (err) {
        commit('UPDATE_NETSTATUS', NetStatus.fail)
      }
      // return Promise.resolve([])
    },
    // Returns the balance of the current address account
    async getBalanceByAddress({ commit, state }: any, address: string) {
      if (!address || !wallet) {
        return Promise.reject(i18n.global.t("common.cannotbeempty"));
      }
      return wallet.provider.getBalance(address);
    },
    // Update the balance in the current account currency
    async updateBalance({ commit, state, dispatch }: any) {
      const newwallet = wallet && wallet.provider ? wallet : await dispatch("getProviderWallet");
      try {
        if (newwallet) {
          const balance = await newwallet.getBalance();
          const amount = ethers.utils.formatEther(balance);
          commit("UPDATE_WALLET", newwallet);
          commit("UPDATE_BALANCE", amount);
          commit('UPDATE_NETSTATUS', NetStatus.success)
          return Promise.resolve(amount);
        }
      } catch (err) {
        commit('UPDATE_NETSTATUS', NetStatus.fail)
      }

    },
    // Link to the current network provider wallet instance
    async getProviderWallet({ commit, state, dispatch }: any) {
      let provider = null
      const { URL } = state.currentNetwork;

      if(!wallet || !wallet.provider || (wallet.provider.connection.url != URL)) {
        provider = ethers.getDefaultProvider(URL)
      }
      try {
        if(!wallet) {
          const { accountInfo } = state;
          const { keyStore } = accountInfo;
          const password: string = getCookies("password") || "";
          const wall =  await dispatch("createWalletByJson", { password, json: keyStore });
          wallet = wall.connect(provider)
          const res = await wallet.provider.getNetwork()
          commit('UPDATE_ETHNETWORK',res)
          commit('UPDATE_NETSTATUS', NetStatus.success)
          commit("UPDATE_WALLET", wallet);
          return wallet
        }
        if(wallet && wallet.provider) {
          const {connection:{url}} = wallet.provider
          if(URL != url) {
            wallet = wallet.connect(provider);
            const res = await wallet.provider.getNetwork()
            commit('UPDATE_NETSTATUS', NetStatus.success)
            commit("UPDATE_WALLET", wallet);
            commit('UPDATE_ETHNETWORK',res)
            return wallet
          } else {
            commit('UPDATE_NETSTATUS', NetStatus.success)
            commit("UPDATE_WALLET", wallet);

            return wallet
          }

        }
        if(wallet && !wallet.provider) {
          wallet = wallet.connect(provider);
          const res = await wallet.provider.getNetwork()
          commit('UPDATE_NETSTATUS', NetStatus.success)
          commit('UPDATE_ETHNETWORK',res)
          commit("UPDATE_WALLET", wallet);
          return wallet
        }
      } catch (err: any) {
        commit('UPDATE_NETSTATUS', NetStatus.fail)
        return Promise.reject(err);
      }
    },
    // Whether there is card trading on the current exchange
    async hasPendingTransactions({state, commit}: any) {
      const { id } = state.currentNetwork
      const from = state.accountInfo.address
      const txListKey = `txQueue-${id}-${from.toUpperCase()}`
      let txList: any = await localforage.getItem(txListKey)
      console.warn('txList', txList)
      return txList && txList.length ? true : false
    },
    async transaction(
      { state, commit, dispatch }: any,
      params: SendTransactionParams
    ) {
      const { to, value, gasPrice, gasLimit, data, transitionType, nft_address, checkTxQueue } = {checkTxQueue: true, ...params};
      // Determine whether there are transactions in the current trading pool that have not returned transaction receipts, and if so, do not allow them to be sent
      if(checkTxQueue && await dispatch('hasPendingTransactions')){
        return Promise.reject({reason:i18n.global.t('common.sendTipPendding'), code: 500})
      }
      console.warn('params', params)
      try {
      const newData = data || ''
      const {currentNetwork} = state
      let tx: any = {
        to,
        value: utils.parseEther(value && Number(value) ? value.toString() : '0')
      };
      if(Number(gasPrice)){
        const bigPrice = new BigNumber(gasPrice)
        console.warn('bigPrice', bigPrice.toNumber())
        const gasp = Number(gasPrice) ? bigPrice.dividedBy(1000000000).toFixed(12) : '0.0000000012';
        tx.gasPrice = ethers.utils.parseEther(gasp)
      }
      if(gasLimit) {
        tx.gasLimit = gasLimit
      }
      if(newData) {
        tx.data = newData
      }
      sessionStorage.setItem('tx------', JSON.stringify(tx))
      // Update recent contacts
      commit("PUSH_RECENTLIST", to);
      const newwallet = await getWallet();
      let sendData = await newwallet.sendTransaction(tx);
      
      const { from, gasLimit: newLimit, gasPrice: newPrice, hash, nonce, to: toAddr, type, value: newVal } = sendData;
      commit("PUSH_TXQUEUE", {
        hash,
        from,
        gasLimit,
        gasPrice,
        nonce,
        to: toAddr,
        type,
        value: newVal,
        transitionType: transitionType || null,
        txType: TransactionTypes.default,
        network: clone(currentNetwork),
        data: newData,
        sendStatus: TransactionSendStatus.pendding,
        sendData: clone(sendData),
        nft_address: nft_address || ''
      });
      console.log("i18n", i18n);
      sendData.wallet = newwallet
      return sendData
      }catch(err){
        console.error(err)
        return Promise.reject(err)
      }
    },
    // Initiate token transaction
    async tokenTransaction(
      { state, commit, dispatch }: any,
      params: SendTokenParams
    ) {
      const { address: tokenAddress, amount, to, gasPrice, gasLimit, checkTxQueue } = params;
      // Determine whether there are transactions in the current trading pool that have not returned transaction receipts, and if so, do not allow them to be sent
      if(checkTxQueue && await dispatch('hasPendingTransactions')){
        return Promise.reject({reason:i18n.global.t('common.sendTipPendding'), code: 500})
      }
     try {
      const {currentNetwork} = state
      // Update recent contacts
      commit("PUSH_RECENTLIST", to);
       // Get contract token instance object
       const { contractWithSigner, contract } = await dispatch(
        "connectConstract",
        tokenAddress
      );
      const amountWei = web3.utils.toWei((amount || 0) + '','ether')
      console.log(" contract.estimate", contract, contractWithSigner);
      const gasp = Number(gasPrice) ? new BigNumber(gasPrice).dividedBy(1000000000).toFixed(12) : '0.0000000012';
      const transferParams = {
        gasLimit: gasLimit,
        gasPrice: ethers.utils.parseEther(gasp),
      };
      console.log("transferParams", transferParams);
      const data = await contractWithSigner.transfer(to, amountWei, transferParams)
      const { from, gasLimit: newLimit, gasPrice: newPrice, hash, nonce, type, value: newVal, to: toAddr } = data;
      store.commit("account/PUSH_TXQUEUE", {
        hash,
        from,
        gasLimit,
        gasPrice,
        nonce,
        to: toAddr,
        type,
        value: newVal,
        transitionType: null,
        txType: TransactionTypes.default,
        network: clone(currentNetwork),
        data: '',
        sendStatus: TransactionSendStatus.pendding,
        sendData: clone(data),
        tokenAddress,
        amount,
        toAddress: to
    });
     data.wallet = wallet
     return data
     }catch(err){
      return Promise.reject(err)
     }
    },
// send data
async sendTransaction({ commit, dispatch, state }: any, tx: any) {
  const { to, from, data, callBack, value: sendVal } = tx
  commit("PUSH_RECENTLIST", to);
  sessionStorage.setItem('tx-----2', JSON.stringify(tx))
  try {
  // @ts-ignore
  const network = clone(store.state.account.currentNetwork)
    const wallet = await getWallet();
    const res: any = await wallet.sendTransaction({
      to,
      data,
      value: sendVal
    })
    const { from, gasLimit: newLimit, gasPrice: newPrice, hash, nonce, to: toAddr, type, value: newVal } = res;
    commit("PUSH_TXQUEUE", {
      hash,
      from,
      gasLimit: null,
      gasPrice: null,
      nonce,
      to: toAddr,
      type,
      value: newVal,
      transitionType:  null,
      txType: TransactionTypes.other,
      network: clone(network),
      data: data,
      sendStatus: TransactionSendStatus.pendding,
      sendData: clone(res),
      nft_address:''
    });
    console.log("i18n", i18n);
    res.wallet = wallet
    return res
  } catch (err) {
    return Promise.reject(err)
  }
},
  //Load the wallet by address and password
    async connectWalletByPwdAddress(
      { state, commit, dispatch }: any,
      params: ConnectWalletByPwdAddress
    ) {
      const { address, password } = params;
      const accountList = state.accountList;
      let accountInfo = null;
      accountList.forEach((item: AccountInfo) => {
        if (item.address.toUpperCase() == address.toUpperCase()) {
          accountInfo = { ...item };
        }
      });
      if (!accountInfo) {
        return Promise.reject(i18n.global.t("common.addressnotfound"));
      }
      const { keyStore } = accountInfo;
      try {
        const newWallet = await createWalletByJson({ password, json: keyStore });
        // debugger
        const { URL } = state.currentNetwork;
        // debugger
        let provider = ethers.getDefaultProvider(URL);
        console.log(provider);
        // @ts-ignore
        const newwallet2 = newWallet.connect(provider);
        return newWallet;
      } catch (err) {
        return Promise.reject(err);
      }
    },
    // Add tokens,
    async addToken({ state, commit, dispatch }: any, val: any) {
      const wallet = await getWallet();
      const network = state.currentNetwork;
      // Add a token. Check the current network and check whether the current address has a token. If no token exists, add the token
      const { tokenContractAddress, address } = val;
      const key = address.toUpperCase();
      const hasAddress = network.tokens[key] ? network.tokens[key].length : 0;
      if (hasAddress) {
        // Addresses whether the token list of the current account already exists
        const newv = network.tokens[key].find(
          (item: any) =>
            item.tokenContractAddress.toUpperCase() ==
            tokenContractAddress.toUpperCase()
        );
        if (newv) {
          // Toast(i18n.global.t("common.addressalreadyexists"));
          return Promise.reject(i18n.global.t("common.addressalreadyexists"));
        }
      }
      let contactObj: any = {}
      let name = ''
      let decimal = ''
      let symbol = ''
      try {
        contactObj = await dispatch(
          "connectConstract",
          tokenContractAddress
        );
        name = await contactObj.contractWithSigner.name();
        decimal = await contactObj.contractWithSigner.decimals();
        symbol = await contactObj.contractWithSigner.symbol();
      } catch (err) {
        return Promise.reject(i18n.global.t('addCurrency.errTip'))
      }
      const logoUrl = "eth.jpg";
      let balance = "0";
      try {
        balance = utils.formatEther(await contactObj.contractWithSigner.balanceOf(wallet.address));
      } catch (err: any) {
        // Toast(i18n.global.t("account.importerror"));
        return Promise.reject(i18n.global.t("common.importerror"));
      }
      console.log("connectConstract", contactObj.contractWithSigner, contactObj.contract);
      // Link to the contract
      if (hasAddress) {
        console.log("balance.toString()", balance.toString(), balance);
        // If it does not exist, add it
        const token = {
          symbol,
          name,
          logoUrl,
          precision: decimal,
          tokenContractAddress,
          balance: balance.toString(),
        }
        network.tokens[key].push(token);
        commit("UPDATE_NETWORK", network);
        return token;
      } else {
        // Current Network The current address has no token
        network.tokens[key] = [];
        const token = {
          symbol,
          name,
          logoUrl,
          precision: decimal,
          tokenContractAddress,
          balance: balance.toString(),
        }
        network.tokens[key].push(token);
        commit("UPDATE_NETWORK", network);
        return token;
      }
    },
    // Link token contract
    async connectConstract(
      { state, commit, dispatch }: any,
      tokenContractAddress: string
    ) {
      try {
        const wallet = await getWallet();
        const { URL } = state.currentNetwork;
        // let provider = ethers.getDefaultProvider(URL);
        const contract = new ethers.Contract(
          tokenContractAddress,
          erc20Abi,
          wallet.provider
        );
        const contractWithSigner = contract.connect(wallet);
        return {contractWithSigner,contract}
      } catch (err) {
        console.error(err);
        return Promise.reject(err);
      }
    },
    // Gets whether the exchange status is open
    async getExchangeStatus({ commit, state }: any, call: Function = () => { }) {
      const wallet = await getWallet();
      const { address } = wallet;
      return checkAuth(address).then((res: any) => {
        commit("UPDATE_EXCHANGERSTATUS", res.data);
        call(res.data);
        return res.data;
      });
    },
    // Update current network, current address, current token list balance
    async updateTokensBalances({ commit, state, dispatch }: any) {
      const wallet = await getWallet();
      const address = state.accountInfo.address.toUpperCase();
      const currentNetwork = state.currentNetwork;
      const tokens = currentNetwork.tokens[address];
      if (tokens && tokens.length) {
        const plist = tokens.map((item: any) =>
          dispatch("updateTokenBalance", item.tokenContractAddress)
        );
        Promise.all(plist).then((result) => {
          for (let i = 0; i < tokens.length; i++) {
            // @ts-ignore
            tokens[i].balance = result[i].toString();
          }
        });
      }
    },
    // Gets the balance of a token
    async updateTokenBalance(
      { commit, state, dispatch }: any,
      tokenAddress: string
    ) {
      // Check the address
      if (!tokenAddress || !wallet || !wallet.provider) {
        return Promise.reject("Address cannot be empty!");
      }
      try {
        const wallet = await getWallet();
        const contract = new ethers.Contract(
          tokenAddress,
          erc20Abi,
          wallet.provider
        );
        const contractWithSigner = contract.connect(wallet);
        const amount = await contractWithSigner.balanceOf(wallet.address)
        return Promise.resolve(
          utils.formatEther(amount)
        );
      } catch (err) {
        return Promise.reject(err);
      }
    },
    // Get the smart contract address
    async getContractAddress({ commit, state }: any) {
      try {
        const { ERBPay } = await getContractAddress()
        commit('UPDATE_CONTRACTADDRESS', ERBPay)
        return Promise.resolve(ERBPay)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    // Address cannot be empty! Access to on-chain account data
    async getChainAccountInfo({ commit, state }: any) {
      const wallet = await getWallet()
      try {
        const accountInfo = await wallet.provider.send("eth_getAccountInfo", [
          state.accountInfo.address,
          "latest",
        ]);
        commit('UPDATE_CHAINACCOUNTINFO', accountInfo)
      } catch (err) {
        commit('UPDATE_CHAINACCOUNTINFO', {})
      }
    },
    // The result of polling the transaction queue
    async waitTxQueueResponse({ commit, state }: any, opt?: Object) {
      console.warn('waitTxQueueResponse---')
      const _opt = {
        time: 60000,
        callback:(e: any) =>{},
        ...opt
      }
      const {id} = state.currentNetwork
      const from = state.accountInfo.address
      const queuekey = `txQueue-${id}-${from.toUpperCase()}`
      let t: any = null;
      const rep = new Promise((resolve, reject) => {
        t = setTimeout(async() => {
         const list: any = await localforage.getItem(queuekey)
         const txQueue = list && list.length ? list : []
         const newWallet = await getWallet()
         if (!txQueue.length) {
           resolve(true)
         }
         try {
           for await (const iterator of txQueue) {
             let {hash, transitionType, nft_address, blockNumber, network, txType, txId, amount, isCancel} = iterator
             let data1 = null
             if(_opt.time != null) {
              data1 = await newWallet.provider.waitForTransaction(hash, null, _opt.time);
             } else {
               data1 = await newWallet.provider.waitForTransaction(hash);
             }
             let convertAmount: any = ''
             if(transitionType && transitionType == '6') {
               const len = nft_address.length
               switch(len) {
                 case 42:
                   break;
                 case 41:
                   nft_address += '0'
                   break;
                 case 40:
                   nft_address += '00'
                   break;
                 case 39:
                   nft_address += '000'
                   break;
               }
               const nftAccountInfo = await newWallet.provider.send(
                 "eth_getAccountInfo",
                 [nft_address,  web3.utils.toHex((data1.blockNumber - 1).toString())]
               );
               const {MergeLevel, MergeNumber} = nftAccountInfo
               if(MergeLevel === 0) {
                 convertAmount = new BigNumber(MergeNumber).multipliedBy(0.095).toNumber()
               }else if(MergeLevel === 1) {
                 convertAmount = new BigNumber(MergeNumber).multipliedBy(0.143).toNumber()
               } else if(MergeLevel === 2) {
                 convertAmount = new BigNumber(MergeNumber).multipliedBy(0.271).toNumber()
               } else if(MergeLevel === 3) {
                 convertAmount = new BigNumber(MergeNumber).multipliedBy(0.65).toNumber()
               }
             }
             const rep: TransactionReceipt = handleGetTranactionReceipt(
               txType || TransactionTypes.other,
               data1,
               {...iterator,convertAmount,transitionType},
               network
             );
             commit("DEL_TXQUEUE", { ...iterator,txId,txType });
             commit("UPDATE_TRANSACTION", { ...rep,txId, txType, isCancel: isCancel || null, amount});
           }
           resolve(true)
         } catch (err) {
           console.error(err)
           reject(err)
         }finally{
           clearTimeout(t)
         }
       }, 1000)
       _opt.callback(t)
     })
      return rep
    },
    // get ethAccountInfo
    async getEthAccountInfo({commit, state}: any) {
      const wallet = await getWallet()
      return wallet.provider.send(
        "eth_getAccountInfo",
        [state.accountInfo.address, "latest"]
      ).then((res:any) => {
        commit('UPDATE_ETHACCOUNTINFO',res)
        return res
      });
    }
  },
  namespaced: true,
};

// Transactions
export type TransactionReceipt = {
  network: NetWorkData,
  // Transaction type is used for list / detail display
  txType: string;
  // Transaction type
  type: number;
  blockNumber: any,
  // state
  status: number;
  // date
  date: Date;
  // sender
  from: string;
  // recipient
  to: string;
  // nonce
  nonce: number;
  // Transaction amount
  value: string;
  // gas 
  gasUsed: BigNumber;
  // hash
  hash: string;
  // gas price
  effectiveGasPrice: BigNumber;
  tokenAddress?: string,
  // transition type
  transitionType? : string
  // nft_address
  nft_address?: string
  //  convert amount
  convertAmount? : string
  receipt: any
  sendData: any
  amount: string
};

// Transaction type
export enum TransactionTypes {
  // Ordinary transaction
  default = "send",
  // Contract transaction
  contract = "contract",
  // swap
  swap = "swap",
  // Other transactions
  other = "other",
  // receive
  receive = "receive",
  // convert
  convert = "convert",

}


/**
 * Encapsulate transactions
 * @param txType Transaction type
 * @param receipt Data confirmed on the chain
 * @param tx Transaction return data
 * @returns
 */
export function handleGetTranactionReceipt(
  txType: string,
  receipt: any,
  tx: any,
  network: NetWorkData
) {
  const { from, to, value, nonce, hash, transitionType, nft_address, convertAmount, blockNumber, tokenAddress, amount } = tx;
  const { gasUsed, status, effectiveGasPrice, type } = receipt;
  const date = new Date();
  sessionStorage.setItem("receipt", JSON.stringify(receipt));
  sessionStorage.setItem("tx", JSON.stringify(tx));
  let newType = txType;
  // If it is a contract transaction and to is 0xFFFFFF, rewrite to swap type
  if (
    txType == TransactionTypes.contract && to &&
    to.toUpperCase() ==
    "0xffffffffffffffffffffffffffffffffffffffff".toUpperCase()
  ) {
    newType = TransactionTypes.swap;
  }
  const rec: TransactionReceipt = {
    txType: newType,
    type: type || null,
    status: status || null,
    from,
    to,
    value,
    date,
    nonce,
    gasUsed: gasUsed || null,
    hash,
    effectiveGasPrice: effectiveGasPrice || null,
    blockNumber,
    transitionType: transitionType || '',
    nft_address: nft_address || '',
    convertAmount: convertAmount || '',
    network,
    receipt,
    sendData: tx,
    tokenAddress,
    amount
  };
  return rec;
}



export const clone = (params = {}) => {
  return JSON.parse(JSON.stringify(params))
}