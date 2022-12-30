
// @ts-nocheck
import { getTransitionsPage } from '@/http/modules/account'
import store from '../index'
import { getWallet } from './account'
import localforage from 'localforage'
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
            const addr = store.state.account.accountInfo.address
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
            const addr = store.state.account.accountInfo.address
            const { id } = store.state.account.currentNetwork
            const txListKey = `async-txlist-${id}-${addr}`
            const txlist = await localforage.getItem(txListKey) || []
            // localStorage
            txlist.forEach(item => {
                
            });
        }
    },
    actions: {
        async updateRecordPage({ commit, state }: any, list) {
            debugger
            const addr = store.state.account.accountInfo.address
            const { id } = store.state.account.currentNetwork
            const asyncRecordKey = `async-${id}-${addr}`
            let txInfo = await localforage.getItem(asyncRecordKey)
            console.log('txInfo',txInfo)
            if(txInfo){
                if(list && list.length >= 10) {
                    txInfo.page = Number(txInfo.page) + 1 + ''
                }
                // 去重
                txInfo.list = txInfo.list && txInfo.list.length ?  [...txInfo.list, ...list] : [...list]
            } else {
                txInfo = {
                    page: '1',
                    list: list || []
                }
            }
            localforage.setItem(asyncRecordKey, txInfo)
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
                dispatch('updateRecordPage', transactions)

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