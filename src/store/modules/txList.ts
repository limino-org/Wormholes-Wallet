
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
    time: any
}
export default {
    state: {
        time: null
    },
    mutations: {
        UPDATE_TIME(state: State, time) {
            state.time = time
        },
        // Update the page to which an address is synchronized
        PUSH_RECORD_PAGE(state: State, page: number) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const asyncRecordKey = `async-${id}-${addr}`
            if (!state.asyncRecordPage[addr]) {
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
        async updateRecordPage({ commit, state }: any, { transactions: list, total, chainId, hasRecord }) {
            const typerec = typeof hasRecord
            console.warn('typeof hasRecord', typeof hasRecord, typeof typerec)
            const wallet = await getWallet()
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const asyncRecordKey = `async-${id}-${chainId}-${addr}`
            let txInfo = await localforage.getItem(asyncRecordKey)
            debugger
            if (list && list.length) {
                if ((txInfo && total >= txInfo.list.length) || !txInfo) {
                    try {
                        for await (const item of list) {
                            const convertAmount = await getConverAmount(wallet, item)
                            item['convertAmount'] = convertAmount
                        }
                    }catch(err: any){
                        console.error('err:', err)
                    }
                }
            }
            console.log('txInfo', txInfo)
            if (txInfo) {
                if (total <= txInfo.list.length) {
                    if (state.time && typeof hasRecord == 'undefined') {
                        clearInterval(state.time)
                        commit('UPDATE_TIME', null)
                    }
                    return
                }
                if (list && list.length >= 10) {
                    txInfo.page = Number(txInfo.page) + 1 + ''
                }
                // 去重debugger
                debugger
                const newList = unRepet(txInfo.list, list).sort((a,b) => b.blockNumber - a.blockNumber)
                console.log('newList', newList)
                txInfo.list = txInfo.list && txInfo.list.length ? newList : [...list].sort((a,b) => b.blockNumber - a.blockNumber)
                txInfo.total = total
            } else {
                txInfo = {
                    page: '1',
                    list: list || [],
                    total
                }
            }
            await localforage.setItem(asyncRecordKey, txInfo)
            let time = setTimeout(() => {
                eventBus.emit('loopTxListUpdata')
                clearTimeout(time)
            })
            if (!list || list.length < 10 && typeof hasRecord == 'undefined') {
                if (state.time) {
                    clearInterval(state.time)
                    commit('UPDATE_TIME', null)
                }
            }

        },
        async asyncAddrRecord({ commit, state, dispatch }: any) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            const wallet = await getWallet()
            const { chainId } = await wallet.provider.getNetwork()
            /**
             * 根据total与当前页码判断是否已经同步完
             * Synchronize block browser transaction records
             * step 1. If it has not been synchronized, synchronize from the first page
             * step 2. If the data has been synchronized before, synchronize the first page (the latest data is in reverse order) and search until there are duplicate data
             * step 3. Get the transaction log data and store it in the cache
             *         The obtained transaction record data is compared with the local cache. If it does not exist, it is appended directly. If it does exist, it is discarded
             *         Store the page numbers in the cache when you're done
             */
            
            if (addr) {
                const asyncRecordKey = `async-${id}-${chainId}-${addr}`
                let txInfo = null
                try {
                    txInfo = await localforage.getItem(asyncRecordKey)
                } catch (err) {
          
                }
                if(txInfo && txInfo.page) {
                    txInfo.page = txInfo.page
                } else {
                    txInfo = {
                        page:'1',
                        list:[]
                    }
                }
                /**
                 * 1.没有同步过，直接同步到最后一页
                 * 2.同步过：
                 *      1>.同步完
                 *          从第一页开始同步，如果没有遇到重复数据，再查page + 1
                 *          如果遇到重复数据则表示同步完成
                 *      2>.未同步完
                 *          继续完成前面的同步
                 */
                const params = {
                    addr,
                    page_size: '10',
                    page: txInfo.page
                }
                const { total, transactions } = await getTransitionsPage(params)
                if(transactions && transactions.length > 10) {
                    txInfo.page = Number(txInfo.page) + 1 + '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          '
                }
                await localforage.setItem(asyncRecordKey, txInfo)
                await dispatch('updateRecordPage', { transactions, total, chainId })
                dispatch('asyncUpdateList', { total })
                return { total, chainId, asyncRecordKey }
            }
            return null
        },
        // Synchronize the latest transaction records
        async asyncUpdateList({ commit, stte, dispatch }: any, { total }) {

            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            let page = '1'
            const wallet = await getWallet()
            const { chainId } = await wallet.provider.getNetwork()
            const asyncRecordKey = `async-${id}-${chainId}-${addr}`
            const txInfo = await localforage.getItem(asyncRecordKey)
            // const totalPage = Math.ceil(total/10)
            // const listTotalPage = Math.ceil(txInfo.list.length/10)
            if(total !== txInfo.list.length) {
                const hasRecord1 = await handleUpdateList()
                if(!hasRecord1){
                    return
                }
                let time = setInterval(async()=>{
                   const hasRecord = await handleUpdateList()
                   if(!hasRecord){
                    clearInterval(time)
                   }

                // 判断当前查询的更新是否有重复的，如果有重复停止轮询，如果没有重复的继续轮询page+1
                }, 4000)
            }

            async function handleUpdateList(){
                const params = {
                    addr,
                    page_size: '10',
                    page
                }
                const hashList = txInfo.list.map(item => item.hash.toUpperCase())
                const { total, transactions } = await getTransitionsPage(params)
                console.warn('asyncUpdateList', transactions)
                const newList = transactions.filter(item => !hashList.includes(item.hash.toUpperCase()))
                console.warn('newList', newList)

                let hasRecord = false
                if(transactions && transactions.length >= 10) {
                    if(newList && newList.length >= 10 ) {
                        hasRecord = true
                        page = Number(page) + 1 + ''
                    } else {
                        hasRecord = false
                    }
                } else {
                    hasRecord = false
                }
                await dispatch('updateRecordPage', { transactions: newList, total, chainId, hasRecord })
                return hasRecord
            }
   
        },
        async loopAsyncTxList({ commit, state, dispatch }: any) {
            const network = store.state.account.currentNetwork
            // When you are currently on a wormholes network, synchronize transaction records from the block browser
            if(network.id === 'wormholes-network-1') {
                const res = await dispatch('asyncAddrRecord')
                const { asyncRecordKey, total } = res
                const txInfo = await localforage.getItem(asyncRecordKey)
                debugger
                if(res && txInfo.list && txInfo.list.length < total) {
                    let t = setInterval(async() => {
                       await dispatch('asyncAddrRecord')
                    }, 4000)
                    commit('UPDATE_TIME', t)
                }
            }
        }
    },
    namespaced: true,
}

export function getInput(input) {
    if (input) {
        try {
            const wormStr = web3.utils.toAscii(input)
            const [nullstr, jsonstr] = wormStr.split('wormholes:')
            let jsonData = {}
            if (jsonstr) {
                jsonData = JSON.parse(jsonstr)
            }
            return jsonData
        } catch (err) {
            console.error('err', err)
            return null
        }
    }
    return null
}


function unRepet(list, list2){
    console.warn('list',list)
    console.warn('list2',list2)
    if(list && list.length) {
        if(list2 && list2.length) {
            const newList = [...list]
            const hashList = list.map(item => item.hash.toUpperCase())
            list2.forEach(item => {
                if(!hashList.includes(item.hash.toUpperCase())) {
                    newList.unshift(item)
                }
            })
            return newList
        } else {
            return list
        }
    } 
    if(list2 && list2.length) {
        return list2
    }
  
}

async function getConverAmount(wallet, data) {
    const { input, blockNumber } = data
    debugger
    let jsonData = getInput(input)
    
    const { type, nft_address } = jsonData
    console.log('input data---', jsonData)
    if (type && type == 6 && nft_address) {
        const len = nft_address.length
        switch (len) {
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
            [nft_address, web3.utils.toHex((blockNumber - 1).toString())]
        );
        const { MergeLevel, MergeNumber } = nftAccountInfo
        //  @ts-ignore
        const { t0, t1, t2, t3 } = store.state.configuration.setting.conversion

        let convertAmount = 0
        if (MergeLevel === 0) {
            convertAmount = new BigNumber(MergeNumber).multipliedBy(t0).toNumber()
        } else if (MergeLevel === 1) {
            convertAmount = new BigNumber(MergeNumber).multipliedBy(t1).toNumber()
        } else if (MergeLevel === 2) {
            convertAmount = new BigNumber(MergeNumber).multipliedBy(t2).toNumber()
        } else if (MergeLevel === 3) {
            convertAmount = new BigNumber(MergeNumber).multipliedBy(t3).toNumber()
        }
        return convertAmount
    }
    return 0
}