import { AccountInfo } from "@/store/modules/account"
import moment from 'moment'
import { utils} from 'ethers'
import { web3 } from "@/utils/web3";
import BigNumber from "bignumber.js";
import { useI18n } from 'vue-i18n'
import { useStore } from "vuex";
import { computed } from "vue";
import i18n from '@/language/index'
import { getInput } from "@/store/modules/txList";
import store from '@/store/index'
const txTypes = [14,15,16,17,18,19,20,27]

// Mask the address
export const addressMask = (v: string) => {
    if (!v) {
        return ''
    }
    const f = v.substring(0, 6)
    const e = v.substring(v.length - 4, v.length)
    return `${f}****${e}`
}




/**
 * Send/receive
 * @param myAddress 
 * @param item 
 */
export const transactionTarget = (accountInfo: AccountInfo, item: any) => {
    const {t}=useI18n()
    if (!accountInfo) {
        return ''
    }
    const { address } = accountInfo
    if (!address) {
        return ''
    }
    try {
        const { to, from } = item
        if (address.toUpperCase() == from.toUpperCase()) {
            return (t('wallet.send'))
        }
        if (address.toUpperCase() == to.toUpperCase()) {
            return (t('wallet.takeover'))
        }
    } catch (err) {
        return ''
    }
}

/**
 * Converts the timestamp to a date
 */
export const formatDate = (time: number, format = 'MMMM-DD') => {
    return moment(time).format(format)
}



export const formatTxDate = (data: any) => {
  const {timestamp,sendStatus,date} = data
  if(sendStatus === 'pendding') {
    return formatDate(date, "MM/DD")+' ' + i18n.global.t("transactionDetails.at") +' ' + formatDate(date, "HH:mm ")
  }

  return formatDate(timestamp * 1000, "MM/DD")+' ' + i18n.global.t("transactionDetails.at")+' ' + formatDate(timestamp * 1000, "HH:mm ")
}


// Convert BigNumber amount to ETH
export const formatEther = (v: any) => {
    if (v) {
        return utils.formatEther(v)
    }
    return ''
}
export const scientificToNumber = (num:any) => {
    if(/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    let zero = '0';
    let parts = String(num).toLowerCase().split('e');
    let e = parts[1];
    let zeroLen = Math.abs(Number(e));
    let sign = Number(e) / zeroLen;
    let beforeArr = parts[0].split('.');
    if(sign < 0) {
      num = zero + '.' + new Array(zeroLen).join(zero) + beforeArr.join('');
    } else {
    let dec = beforeArr[1];
    if(dec) {
      zeroLen = zeroLen - dec.length;
      num = beforeArr.join('') + new Array(zeroLen + 1).join(zero);
    }
    }
    }
    return num;
  }
// Convert bigNumber amount to toWei
export const parseEther = (v: any) => {
    if (v) {
        return  utils.parseEther(utils.formatEther(v))
    }
    return ''
}

// The amount is converted into US dollars
export const toUsd = (v: string | number, keepDotLength = 18) => {
    if (!v) {
      return 0;
    }
    return new BigNumber(v)
    .multipliedBy(0.5)
    .toFixed(keepDotLength, 1)
    .toString();
  };

// Calculate ETH transfer transaction fees
export const ethTractionPrice = (gas: string, gasPrice: string) => {
    if (!gas || !gasPrice) return ''
    const p1 = utils.parseEther(gas)
    const p2 = utils.parseEther(gasPrice)
    return utils.formatEther(p1.mul(p2))
}

// Calculate the maximum ETH transfer threshold
export const ethMaxPrice = (maxGas: string, gasPrice: string) => {
    if (!maxGas || !gasPrice) return ''
    const p1 = utils.parseEther(maxGas)
    const p2 = utils.parseEther(gasPrice)
    return utils.formatEther(p1.mul(p2))
}
type EstimateGasParams = {
    to: string
    data: string
}
//Method to estimate the GAS usage of a transaction by performing a message call.
export const getestimateGas = (params: EstimateGasParams) => {
    return web3.eth.estimateGas(params)
}
// Calculate total expenses
export const gasTotal = (price: string = '0', deposit:string = '0' ) => {
    if (!deposit || !price) return ''
    const p = new BigNumber(price).plus(deposit).toNumber()
    return decimal(p.toString())
}

// I'm going to keep n decimal places
export function decimal(v: string, length: number = 6) {
    if (!v) return "";
    return new BigNumber(v).toFixed(length, 1).toString()
  }
  
export function decimalCopy (v: string, length: number = 6) {
    if (!v) return "";
    return new BigNumber(v).toFixed(length, 1)
}
//Keeping N decimal places returns the total amount of transactions through the transaction record
export function calcTransaitionTotal(data: any = null) {
    if(!data)return ''
    const { receipt } = data
    if(!receipt)return ''
    const { gasUsed } = receipt
}



//On the main net Wormholes when return exchange USD before + ≈$23, otherwise do not return
export const toUsdSymbol = (v: string | number, keepDotLength = 6) => {
    const store = useStore();
    const showstr = toUsd(v,keepDotLength)
    const currentNetwork = computed(() => store.state.account.currentNetwork)
    const { chainId } = currentNetwork.value
    return chainId == 51888 ? `≈ $${showstr}`:''
  }

  // Return to transaction status
export function transactionStatus(txData: any){
  const {status,sendStatus, sendType} = txData
  if(sendType && sendType === 'cancel') return i18n.global.t('transationHistory.canceled')
  if(sendType && sendType === 'speed') return i18n.global.t('transationHistory.accelerated')
  if(sendStatus && sendStatus === 'pendding') return i18n.global.t('transationHistory.pendding')
  return status ? i18n.global.t('transationHistory.successly') : i18n.global.t('transationHistory.failed')
  }
  // Return to form of transaction
  export function transactiontxType(status: string){
    if(status == 'send' || status == 'other'){
      return i18n.global.t('transationHistory.send')
    }
    if(status=='contract'){
      return i18n.global.t('transationHistory.contract')
    }
  }

  export const handleSendStatus = (data: any) => {
    const {status,sendStatus} = data
    if(sendStatus && sendStatus === 'pendding') return sendStatus
    return status ? 'success' : 'fail'
  }

  export const txTypeToIcon = (data: any) => {
    const myAddr = store.state.account.accountInfo.address.toUpperCase()
    const { to, from, txType, input, jsonData} = data
    if(txType === 'wormholes') {
      if(jsonData){
        if(jsonData.type == 6) {
          return 'icon-bottom'
        }
       if(txTypes.includes(jsonData.type)) {
         return 'icon-jiantou_youshang'
       }
      }
   }
    if(txType == 'contract') return 'icon-icon-'
    const bigTo = to.toUpperCase()
    const bigFrom = from.toUpperCase()
    if((myAddr === bigTo && bigFrom !== myAddr)) return 'icon-bottom'
    if(bigTo !== bigFrom || bigTo === bigFrom) return 'icon-jiantou_youshang'
  }
  export const handleTxType = (item: any) => {
  const { to, from, contractAddress, sendStatus , txType, input} = item
  const myAddr = store.state.account.accountInfo.address.toUpperCase()
  if(txType === 'wormholes') {
     const data = getInput(input)
     if(data){
      if(data.type == 6) {
        return i18n.global.t('common.conver')
      }
      if(txTypes.includes(data.type)) {
        return i18n.global.t('transationHistory.send')
      }
     }
  }
  if(sendStatus && sendStatus === 'pendding') {
    if(txType === 'contract') {
      return i18n.global.t('transationHistory.contract')
    }
    return i18n.global.t('transationHistory.send')
  }

  if(txType === 'contract') return i18n.global.t('transationHistory.contract')
  const bigTo = to.toUpperCase()
  const bigFrom = from.toUpperCase()
  if(bigTo === bigFrom)return i18n.global.t('transationHistory.send')
  if(bigTo === bigFrom || myAddr === bigTo) return i18n.global.t('transactiondetails.recive')
  if(bigTo !== bigFrom) return i18n.global.t('transationHistory.send')
  }

  export const transactionStatusClass = (data: any) => {
    const {status,sendStatus} = data
    if(sendStatus && sendStatus === 'pendding') return 'waitting'
    return status ? 'success' : 'failed'
  }

  export const transferAmountText = (data: any) => {
    const { to, from, contractAddress, value, input, convertAmount, sendStatus, status, tokenAddress, amount, txType, jsonData } = data
    const myAddr = store.state.account.accountInfo.address.toUpperCase()
    if(sendStatus && sendStatus === 'pendding'){
      if(tokenAddress) {
        return amount
      } else {
        const val = utils.formatEther(value)
        return val
      }
    }
    const val = new BigNumber(value).div(1000000000000000000).toString()
    if(txType === 'wormholes') {
      if(jsonData){
        if(jsonData.type == 6) {
          return '+' + convertAmount
        }
        if(jsonData.type == 26 || jsonData.type == 12) {
          return '+' + val
        }
       if(txTypes.includes(jsonData.type)) {
         return '-' + val
       }
      }
   }

    if(jsonData) {
    // @ts-ignore
    let { type, nft_address } = jsonData
    if(type && Number(type) === 6 && nft_address) return '+' + convertAmount
    }
    if(!status)return val
    if(contractAddress) return val
    const bigTo = to.toUpperCase()
    const bigFrom = from.toUpperCase()
    if(bigTo === bigFrom) return '-' + val
    if((myAddr == bigTo && myAddr !== bigFrom)) return '+' + val
    if(bigTo !== bigFrom) return '-' + val

  }