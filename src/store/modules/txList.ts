
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
import { guid } from '@/utils'

const page_size = '10'
const page_size_int = Number(page_size)
let timeOut = 6000
interface State {
    time: any
}
let time = null
let time2 = null
export default {
    mutations: {
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
            if (list && list.length) {
                const realList = txInfo && txInfo.list.length ?  txInfo.list.filter(item => !item.sendType) : []
                if ((txInfo && total >= realList.length) || !txInfo) {
                    try {
                        for await (const item of list) {
                            const convertAmount = await getConverAmount(wallet, item)
                            item['convertAmount'] = convertAmount
                        }
                    } catch (err: any) {
                        console.error('err:', err)
                    }
                }
            }
            console.log('txInfo', txInfo)
            if (txInfo) {
                const realList = txInfo && txInfo.list.length ?  txInfo.list.filter(item => !item.sendType) : []
                if (total <= realList.length) {
                    if (time && typeof hasRecord == 'undefined') {
                        clearInterval(time)
                    }
                    return
                }
                if (list && list.length >= page_size_int) {
                    txInfo.page = Number(txInfo.page) + 1 + ''
                }
                const newList = unRepet(txInfo.list, list).sort((a, b) => b.blockNumber - a.blockNumber)
                console.log('newList', newList)
                txInfo.list = txInfo.list && txInfo.list.length ? newList : [...list].sort((a, b) => b.blockNumber - a.blockNumber)
                txInfo.total = total
            } else {
                txInfo = {
                    page: '1',
                    list: list || [],
                    total
                }
            }
            await localforage.setItem(asyncRecordKey, txInfo)
            eventBus.emit('loopTxListUpdata', txInfo.list)
            const realList = txInfo && txInfo.list.length ?  txInfo.list.filter(item => !item.sendType) : []
            if (!list || realList.length < page_size_int && typeof hasRecord == 'undefined') {
                if (time) {
                    clearInterval(time)
                }
            }


        },
        async asyncAddrRecord({ commit, state, dispatch }: any) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id, chainId } = store.state.account.currentNetwork
            /**
             * Check whether synchronization is complete based on total and the current page number
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
                if (txInfo && txInfo.page) {
                    txInfo.page = txInfo.page
                } else {
                    txInfo = {
                        page: '1',
                        list: []
                    }
                }
                /**
                 * 1.It's not synchronized. It's straight to the last page
                 * 2.Out of sync:
                 *      1>.complete synchronously
                 *          Start synchronization from the first page. If no duplicate data is encountered, check page + 1
                 *          If duplicate data is encountered, synchronization is complete
                 *      2>.Out of sync
                 *          Continue to complete the previous synchronization
                 */
                const params = {
                    addr,
                    page_size,
                    page: txInfo.page
                }
                const { total, transactions } = await getTransitionsPage(params)
                if(transactions && transactions.length) {
                    transactions.forEach((item) => {
                        item.txId = guid()
                        if(item.input == '0x') {
                            item.txType = 'normal'
                        } else {
                            const json = getInput(item.input)
                            if(json) {
                                item.txType = 'wormholes'
                                item.jsonData = json
                            } else {
                                item.txType = 'contract'
                            }
                        }
                    })
                }
                    
                if (transactions && transactions.length > page_size_int) {
                    txInfo.page = page_size_int + 1 + '                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          '
                }
                await localforage.setItem(asyncRecordKey, txInfo)
                await dispatch('updateRecordPage', { transactions, total, chainId })
                dispatch('asyncUpdateList', { total })
                return { total, chainId, asyncRecordKey, transactions,...params }
            }
            return null
        },
        // Synchronize the latest transaction records
        async asyncUpdateList({ commit, stte, dispatch }: any, { total }) {
            const addr = store.state.account.accountInfo.address.toUpperCase()
            const { id } = store.state.account.currentNetwork
            let page = '1'
            // const wallet = await getWallet()
            // const { chainId } = await wallet.provider.getNetwork()
            const chainId = store.state.account.currentNetwork.chainId
            const asyncRecordKey = `async-${id}-${chainId}-${addr}`
            const txInfo = await localforage.getItem(asyncRecordKey)
            // const totalPage = Math.ceil(total/10)
            // const listTotalPage = Math.ceil(txInfo.list.length/10)
            const realList = txInfo && txInfo.list.length ?  txInfo.list.filter(item => !item.sendType) : []
            if (total !== realList.length) {
                const hasRecord1 = await handleUpdateList()
                if (!hasRecord1) {
                    return
                }
                time2 = setInterval(async () => {
                    const hasRecord = await handleUpdateList()
                    if (!hasRecord) {
                        clearInterval(time2)
                    }
                }, timeOut)
            }

            async function handleUpdateList() {
                const params = {
                    addr,
                    page_size,
                    page
                }
                const txInfo = await localforage.getItem(asyncRecordKey)
                const hashList = txInfo.list.map(item => item.hash.toUpperCase())
                const { total, transactions } = await getTransitionsPage(params)
                console.warn('asyncUpdateList', transactions)
                if(transactions && transactions.length) {
                    transactions.forEach((item) => {
                        item.txId = guid()
                        if(item.input == '0x') {
                            item.txType = 'normal'
                        } else {
                            const json = getInput(item.input)
                            if(json) {
                                item.txType = 'wormholes'
                                item.jsonData = json
                            } else {
                                item.txType = 'contract'
                            }
                        }
                        
                    })
                }
                const newList = transactions.filter(item => !hashList.includes(item.hash.toUpperCase()))
                console.warn('newList', newList)

                let hasRecord = false
                if (transactions && transactions.length >= page_size_int) {
                    if (newList && newList.length >= page_size_int) {
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
            const wallet = await getWallet()
            // When you are currently on a wormholes network, synchronize transaction records from the block browser
            if (network.id === 'wormholes-network-1') {
                const res = await dispatch('asyncAddrRecord')
                if(res){
                    const { asyncRecordKey, total } = res
                    const txInfo = await localforage.getItem(asyncRecordKey)
                    const realList = txInfo && txInfo.list.length ?  txInfo.list.filter(item => !item.sendType) : []
                    if (res && realList.length < total) {
                        time = setInterval(async () => {
                            await dispatch('asyncAddrRecord')
                        }, timeOut)
                    }
                    return { total, asyncRecordKey }
                } else {
                    clearInterval(time)
                }
  
            }
            return {total:0, asyncRecordKey:''}
        },
    },
    namespaced: true,
}


export function getInput(input) {
    if (input) {
        try {
            const wormStr = web3.utils.toAscii(input)
            const [nullstr, jsonstr] = wormStr.split('wormholes:')
            let jsonData = null
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


function unRepet(list, list2) {
    if (list && list.length) {
        if (list2 && list2.length) {
            const newList = [...list]
            const hashList = list.map(item => item.hash.toUpperCase())
            list2.forEach(item => {
                if (!hashList.includes(item.hash.toUpperCase())) {
                    newList.unshift(item)
                }
            })
            return newList
        } else {
            return list
        }
    }
    if (list2 && list2.length) {
        return list2
    }

}

export async function getConverAmount(wallet, data) {
    const { input, blockNumber } = data
    if (input && blockNumber) {
        let jsonData = getInput(input)
        if(jsonData) {
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
        return 0
    }
    return 0
}


function clone(params = {}) {
    return JSON.parse(JSON.stringify(params))
  }
  
export const stopLoop = () => {
    clearInterval(time)
    clearInterval(time2)
}