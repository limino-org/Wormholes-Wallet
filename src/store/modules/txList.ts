
// @ts-nocheck
import { getTransitionsPage } from '@/http/modules/account'
import store from '../index'
import { getWallet } from './account'
import localforage from 'localforage'
import eventBus from '@/utils/bus'
import { utils } from 'ethers'
import { web3 } from '@/utils/web3'
console.warn('web3', web3)
import BigNumber from 'bignumber.js'
interface State {
    time: null | any
}
export default {
    state: {
        time: null
    },
    mutations: {
        UPDATE_TIME(state:State, time) {
            state.time = time
        },
        // Update the page to which an address is synchronized
        PUSH_RECORD_PAGE(state: State, page: number) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const asyncRecordKey = `async-${id}-${addr}`
            if(!state.asyncRecordPage[addr]) {
                state.asyncRecordPage[addr] = {
                    page: page
                }
            } else {
                state.asyncRecordPage[addr]['page'] = page
            }
        },
        async PUSH_RECORD_LIST(state: State, list) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const txListKey = `async-txlist-${id}-${addr}`
            const txlist = await localforage.getItem(txListKey) || []
            // localStorage
            txlist.forEach(item => {
                
            });
        }
    },
    actions: {
        async updateRecordPage({ commit, state }: any, {transactions: list, total}) {
            const wallet = await getWallet()
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const asyncRecordKey = `async-${id}-${addr}`
            let txInfo = await localforage.getItem(asyncRecordKey)
            if(list && list.length) {
                if((txInfo && total >= txInfo.list.length) || !txInfo) {
                    for await (const item of list) {
                        const convertAmount = await getConverAmount(wallet, item)
                        item['convertAmount'] = convertAmount
                     }
                }
            }
            console.log('txInfo',txInfo)
            if(txInfo){
                if(total <= txInfo.list.length){
                    if(state.time) {
                        clearInterval(state.time)
                        commit('UPDATE_TIME', null)
                    }
                    return
                }
                if(list && list.length >= 10) {
                    txInfo.page = Number(txInfo.page) + 1 + ''
                }
                // 去重
                txInfo.list = txInfo.list && txInfo.list.length ?  [...txInfo.list, ...list] : [...list]
                txInfo.total = total
            } else {
                txInfo = {
                    page: '1',
                    list: list || [],
                    total
                }
            }
            await localforage.setItem(asyncRecordKey, txInfo)
            eventBus.emit('loopTxListUpdata')
            if(!list || list.length < 10) {
                if(state.time) {
                    clearInterval(state.time)
                    commit('UPDATE_TIME', null)
                }
            }

        },
        async asyncAddrRecord({ commit, state, dispatch }: any){
            const addr = store.state.account.accountInfo.address
            const { id } = store.state.account.currentNetwork
            /**
             * 同步区块浏览器的交易记录
             * step 1. 如果当前没有同步过，从第一页开始同步
             * step 2. 如果之前同步过，从上一次同步到的页码开始同步
             * step 3. 拿到交易记录数据后存储到缓存
             *         拿到的交易记录数据与本地缓存的比对，如果不存在直接追加，如果存在则丢弃
             *         存储完后把页码存储到缓存
             */
            if(addr){
                const asyncRecordKey = `async-${id}-${addr}`
                let txInfo = null
                try {
                    txInfo = await localforage.getItem(asyncRecordKey)
                }catch(err){

                }
                const { total, transactions } =  await getTransitionsPage({
                    addr,
                    page_size: '10',
                    page: txInfo && txInfo.page ? txInfo.page : '1'
                })
                dispatch('updateRecordPage', {transactions,total})

            }
        },
        loopAsyncTxList({ commit, state, dispatch }: any){
            let t = setInterval(() => {
                dispatch('asyncAddrRecord')
            },4000)
            commit('UPDATE_TIME', t)
        }
    },
    namespaced: true,
  }

  console.warn('0xdfebd9c80000000000000000000000000000000000000000000000000000000000000003', web3.utils.toAscii('0xdfebd9c80000000000000000000000000000000000000000000000000000000000000002'))

  export function getInput(input){
    if(input){
        try {
            const wormStr = web3.utils.toAscii(input)
        const [nullstr, jsonstr] = wormStr.split('wormholes:')
        let jsonData = {}
        if(jsonstr){
            jsonData = JSON.parse(jsonstr)
        }
        return jsonData
        }catch(err){
            console.error('err', err)
            return null
        }
    }
    return null
  }

  async function getConverAmount(wallet, data){
    const {input,blockNumber} = data
    let jsonData = getInput(input)
    const { type, nft_address} = jsonData
    console.log('input data---',jsonData)
    if(type && type == 6 && nft_address) {
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
        const nftAccountInfo = await wallet.provider.send(
          "eth_getAccountInfo",
          [nft_address,  web3.utils.toHex((blockNumber - 1).toString())]
        );
        const {MergeLevel, MergeNumber} = nftAccountInfo
       //  @ts-ignore
        const {t0,t1,t2,t3} = store.state.configuration.setting.conversion

        let convertAmount = 0
        if(MergeLevel === 0) {
          convertAmount = new BigNumber(MergeNumber).multipliedBy(t0).toNumber()
        }else if(MergeLevel === 1) {
          convertAmount = new BigNumber(MergeNumber).multipliedBy(t1).toNumber()
        } else if(MergeLevel === 2) {
          convertAmount = new BigNumber(MergeNumber).multipliedBy(t2).toNumber()
        } else if(MergeLevel === 3) {
          convertAmount = new BigNumber(MergeNumber).multipliedBy(t3).toNumber()
        }
        return convertAmount
      }
      return 0
  }