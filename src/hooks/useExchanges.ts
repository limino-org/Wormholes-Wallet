import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
import { computed, onMounted, ref, Ref, watch } from "vue";
import { ethers } from "ethers";
import { ExchangeStatus, getWallet, TransactionReceipt, handleGetTranactionReceipt, TransactionTypes, clone, TransactionSendStatus } from "@/store/modules/account";
import { hashMessage } from "@/utils/ether";
import { useSign } from "@/views/sign/hooks/sign";
import { web3 } from "@/utils/web3";

import {
  createExchange,
  getSysParams,
  getExchangeSig,
  checkAuth,
  setExchangeSig,
  is_install
} from "@/http/modules/common";
const erbAbi = require("@/assets/json/erbAbi.json");
const newErbAbi = require("@/assets/json/newErbAbi");

import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { utils } from "ethers";
import i18n from "@/language/index";
import store from "@/store";
import BigNumber from "bignumber.js";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";


export const useExchanges = () => {
  const { $tradeConfirm } = useTradeConfirm()
  const showCreateExchange: Ref<boolean> = ref(false);
  const showExchange: Ref<boolean> = ref(false);
  const showExchange1: Ref<boolean> = ref(false);

  const exchangeUrl: Ref<string> = ref("");
  const adminUrl: Ref<string> = ref("");
  const ready: Ref<boolean> = ref(false);

  const { dispatch, state, commit, getters } = useStore();
  const { toSign, sign } = useSign();

  const sendTx2 = async (amount: any, exchange_name: string, callBack?: Function) => {
    try {
      const wallet = await getWallet()
      const { address } = wallet
      const contractWithSigner = await getContract();
      const params = await generateSign(exchange_name);
      const authData = await authExchange()
      const hex1 =web3.utils.fromUtf8(JSON.stringify(params))
      const hex2 = web3.utils.fromUtf8(JSON.stringify(authData))
      const parHexStr = state.account.exchangeStatus.status != 2 ? `${hex1},${hex2}` : ''
      
      const data = await contractWithSigner.functions.pay(parHexStr,{
        value: ethers.utils.parseEther(amount + ''),
      });

      callBack ? callBack() : "";
      localStorage.setItem('tx2', JSON.stringify(data))
      // debugger
      $tradeConfirm.update({ status: "approve" })
      const receipt = await wallet.provider.waitForTransaction(data.hash, null, 60000)
      localStorage.setItem('receipt2', JSON.stringify(receipt))
      const { status } = receipt;
      if (status == 0) {
        $tradeConfirm.update({ status: "fail", hash: data.hash })
        resetData();
        Toast(i18n.global.t("userexchange.transactionfailed"));
        return Promise.reject()
      } else {
        let time = setTimeout(() => {
          $tradeConfirm.update({ status: "success", hash:data.hash  })
          clearTimeout(time)
        }, 30000)
      }
      dispatch("account/updateAllBalance");
      // commit("account/PUSH_TRANSACTION", rep);
      store.dispatch('account/waitTxQueueResponse')
      return Promise.resolve(receipt)
    } catch (err: any) {
      if (err.toString().indexOf("timeout") > -1) {
        $tradeConfirm.update({
          status: "warn",
          failMessage: i18n.global.t("error.timeout"),
        });
      } else {
        $tradeConfirm.update({
          status: "fail",
          failMessage: err.reason,
        });
      }
      console.log(err)
      console.log("==========err2=============")
      Toast(err.toString());
      resetData();
      return Promise.reject()
    }
  }

  const send2 = async (amount: number = 200, exchange_name: string, callBack = () => { }, isDialog = true) => {
    if (isDialog) {
      $tradeConfirm.open({
        approveMessage: i18n.global.t('createExchange.create_approve'),
        successMessage: i18n.global.t('createExchange.create_waiting'),
        wattingMessage: i18n.global.t('createExchange.create_success'),
        wattingTitle: i18n.global.t('createExchange.wattingTitle'),
        failMessage: i18n.global.t('createExchange.create_wrong'),
        callBack: () => { router.replace({ name: "exchange-management" }) },
        failBack: () => { router.replace({ name: "exchange-management" }) }
      })
    }

    try {
      const receipt = await sendTx2(amount, exchange_name)
      const { status,transactionHash } = receipt;
      if (status == 0) {
        $tradeConfirm.update({ status: "fail" })
        resetData();
        Toast(i18n.global.t("userexchange.transactionfailed"));
        return;
      }
      // const params = await generateSign(exchange_name);
      // const sendData = {
      //   address,
      //   params: `'${JSON.stringify(params)}'`,
      // };
      // console.log(sendData)
      // const val: any = await createExchange(sendData);
      // if (val.code == "true") {
      //   let time = setTimeout(async () => {
      //     try {
      //       const data = await authExchange();
      //       ready.value = true;
      //       $tradeConfirm.update({ status: "success" })
      //       callBack ? callBack() : "";
      //     } catch (err: any) {
      //       $tradeConfirm.update({ status: "fail" })
      //       resetData();
      //     }
      //     clearTimeout(time);
      //   }, 8000);
      // } else {
      //   resetData();
      //   $tradeConfirm.update({ status: "fail" })

      //   return;
      // }

    } catch (err) {
      $tradeConfirm.update({ status: "fail" })
      resetData();
    }
  }

  /**
   * Generate a signed exchange authorization information
   */
  const generateSign = async (name: string) => {
    const wallet = await getWallet();
    const blockNumber = await wallet.provider.getBlockNumber();
    const exchanger_owner: string = wallet.address;
    const contractWithSigner = await getContract()
    const to = await contractWithSigner.functions.getUserBackgroundAccount(wallet.address)
    const exchange_name: string = name
    // const block_number: number = blockNumber + 86400;
    // const sign_exchange_owner = await wallet.signMessage(exchange_owner);
    // const sign_to = await wallet.signMessage(to);
    // const sign_block_number = await wallet.signMessage(block_number);
    const newstr = hashMessage(`${exchanger_owner}${to}${blockNumber}`)
    return new Promise((resolve, reject) => {
      toSign({
        sig: newstr,
        address: wallet.address,
        call: async (sigstr: string) => {
          const params = {
            type: "exchange_auth",
            exchange_name,
            // Authorized version (fixed)
            version: 1,
            // One Click Exchange founder's address (wallet address)
            exchanger_owner,
            // Licensee's address (fixed address, provided by Li Gong)
            to,
            // The block height of the chain at the time of authorization, which is used to determine the validity of the authorization (obtained from the block browser, if not, write first).
            block_number: blockNumber,
            sig: sigstr,
          };
          resolve(params)
        },
      });
    })


  };





  const resetData = () => {
    showExchange1.value = false;
    showCreateExchange.value = false;
    showExchange.value = false;
    ready.value = false;

  };

  // Send one click to open exchange trading
  const sendTo = async (name: string, amount: number, isServer: boolean, fee_rate?: number) => {
    const wallet = await getWallet();
    const exchangeStatus: ExchangeStatus = state.account.exchangeStatus
    const {
      status: newStatus,
      exchanger_flag
    } = exchangeStatus
    const { address } = wallet;
    // const baseName = encode(name);
    try {
      const rate_str: number = fee_rate ? new BigNumber(fee_rate).multipliedBy(10).toNumber() : 100
      const str = `wormholes:{"version": "0","type": 11,"fee_rate": ${rate_str},"name":"${name}","url":""}`;
      // const str = `wormholes:{"type":"9", "proxy_address":"0x591813F0D13CE48f0E29081200a96565f466B212", "version":"0.0.1"}`
      const data3 = web3.utils.fromUtf8(str);
      const tx1 = {
        from: address,
        to: address,
        value: amount,
        data: data3,
      };
      const data = await store.dispatch('account/transaction', tx1)
      localStorage.setItem('tx1', JSON.stringify(data))
      if (!isServer) {
        $tradeConfirm.update({ status: "approve" })
      }
      const receipt2 = await data.wallet.provider.waitForTransaction(data.hash, null, 60000)
      const { status, transactionHash } = receipt2
      localStorage.setItem('receipt1', JSON.stringify(receipt2))
      if (!isServer) {
        if (status == 0) {
          $tradeConfirm.update({ status: "fail" })
        } else {
          $tradeConfirm.update({ status: "success", callBack() { router.replace({ name: "exchange-management" }) } })
        }
        store.dispatch('account/waitTxQueueResponse')
      }
      // Send the second stroke
      if (isServer) {
        if (!exchanger_flag && newStatus == 2) {
          $tradeConfirm.update({ status: "success", callBack() { router.replace({ name: "exchange-management" }) } })
          return
        }
        send2(200, name)
      }
    } catch (err: any) {
      if (!isServer) {
        if (err.toString().indexOf("timeout") > -1) {
          $tradeConfirm.update({
            status: "warn",
            failMessage: i18n.global.t("error.timeout"),
          });
        } else {
          $tradeConfirm.update({
            status: "fail",
            failMessage: err.reason,
          });
        }
      }
    }
  };

  // Miners pledge
  const sendToPledge = async (amount: number, proxy_address?: string) => {
    // const wallet = await getWallet();
    const wallet = await getWallet()
    const { address } = wallet;
    // const gasPrice = await wallet.provider.getGasPrice()
    $tradeConfirm.open({
      approveMessage: i18n.global.t('minerspledge.create_approve'),
      successMessage: i18n.global.t('minerspledge.create_waiting'),
      wattingMessage: i18n.global.t('minerspledge.create_success'),
      failMessage: i18n.global.t('minerspledge.create_wrong')
    })

    try {
      if (proxy_address) {
        const sigstr = `${proxy_address}${address}`
        // Agent pledge
        await toSign({
          address: proxy_address,
          sig: sigstr,
          isAdmin: false,
          call: (sign: string) => {
            debugger
            sendPledge(amount, proxy_address, sign)
          }
        })

        return
      }
      // Ordinary pledge
      sendPledge(amount, '', '')
    } catch (err: any) {
      console.error(err)
      $tradeConfirm.update({ status: "fail" })
    }
  };


  const sendPledge = async (amount: number, proxy_address: string, proxy_sign: string) => {
    try {
      const wallet = await getWallet()
      const { address } = wallet
      const str = `wormholes:{"type":9,"proxy_address":"${proxy_address}","proxy_sign":"${proxy_sign}","version":"v0.0.1"}`
      console.warn('str', str)
      const data3 = toHex(str);
      const tx1 = {
        to: address,
        value: amount,
        data: `0x${data3}`,
        transitionType: '9'
      };
      console.warn('tx1', tx1)
      console.warn('amount', amount)

      const receipt = await store.dispatch('account/transaction', tx1)
      $tradeConfirm.update({ status: "approve" })
      const receipt2 = await wallet.provider.waitForTransaction(receipt.hash, null, 60000)
      store.dispatch('account/waitTxQueueResponse')
      const { status, transactionHash } = receipt2
      localStorage.setItem('receipt1', JSON.stringify(receipt2))
      if (status == 0) {
        $tradeConfirm.update({ status: "fail", hash: transactionHash  })
        Toast(i18n.global.t('userexchange.transferfailed'))
        return false
      } else {
        localStorage.setItem('receipt', JSON.stringify(receipt2))
        $tradeConfirm.update({
          status: "success", callBack() {
            router.replace({ name: "wallet" })
          },
          hash: transactionHash
        })
      }
    } catch (err: any) {
      if (err.toString().indexOf("timeout") > -1) {
        $tradeConfirm.update({
          status: "warn",
          failMessage: i18n.global.t("error.timeout"),
        });
      } else {
        $tradeConfirm.update({
          status: "fail",
          failMessage: err.reason,
        });
      }
      console.error(err)
    }
  }

  /**
   * Authorized one-click exchange
   * @returns
   */
  const authExchange = async () => {
    const wallet = await getWallet();
    const number = await wallet.provider.getBlockNumber();
    const block_number = utils.hexlify((number) + 6307200);
    const { address } = wallet;
    // watting 30 s
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 30000)
    })
    // const d: any = await getSysParams(address);
    // const { exchangeraddr } = d.data;
    const exchangeraddr = '0x7fbc8ad616177c6519228fca4a7d9ec7d1804900'
    const newParams = {
      exchanger_owner: address,
      to: exchangeraddr,
      block_number,
    };
    const str = `${address}${exchangeraddr}${block_number}`;
    const newstr = hashMessage(str);
    return new Promise((resolve, reject) => {
      //@ts-ignore
      toSign({
        sig: newstr,
        address: wallet.address,
        call: async (sigstr: string) => {
          const params = { ...newParams, sig: sigstr }
          sessionStorage.setItem('params', JSON.stringify(params))
          resolve(params)
          // setExchangeSig(wallet.address, params)
          //   .then((res) => {
          //     resolve(res);
          //   })
          //   .catch((err) => {
          //     reject(err);
          //   });
        },
      });
    });
  };

  // Querying Exchange Status
  /**
   *
   * @returns 
   *
   */
  const exchangeStatus = async () => {
    try {
      let wallet = await getWallet();
      const status = await checkAuth(wallet.address);
      return Promise.resolve(status.data);
    } catch (err) {
      console.error(err);
    }
  };

  // One click to open the exchange
  const createExchanges = async (name: string, amount: number, fee_rate?: number) => {
    const exchangeStatus: ExchangeStatus = state.account.exchangeStatus
    const {
      status,
      exchanger_flag
    } = exchangeStatus
    console.log(status)
    console.log(exchanger_flag)
    if ((status != 2 && exchanger_flag == false) || (!exchanger_flag && status == 2)) {
      $tradeConfirm.open({
        approveMessage: i18n.global.t('createExchange.create_approve'),
        successMessage: i18n.global.t('createExchange.create_waiting'),
        wattingMessage: i18n.global.t('createExchange.create_success'),
        failMessage: i18n.global.t('createExchange.create_wrong')
      })
      sendTo(name, amount, true, fee_rate);
      return
    }
    // The first payment was made, the second was missed
    if (exchanger_flag == true && status != 2) {
      $tradeConfirm.open({
        approveMessage: i18n.global.t('createExchange.create_approve'),
        successMessage: i18n.global.t('createExchange.create_waiting'),
        wattingMessage: i18n.global.t('createExchange.create_success'),
        failMessage: i18n.global.t('createExchange.create_wrong')
      })
      send2(200, name)
    }
    if (!exchanger_flag && status == 2) {
      sendTo(name, amount, false, fee_rate);
    }
  };

  const closeExchanges = async () => {
    $tradeConfirm.open({
      approveMessage: i18n.global.t('minerspledge.close_approve'),
      successMessage: i18n.global.t('minerspledge.close_waiting'),
      wattingMessage: i18n.global.t('minerspledge.close_success'),
      failMessage: i18n.global.t('minerspledge.close_wrong')
    })
    const wallet = await getWallet();
    const { address } = wallet;
    const str = `wormholes:{"version":"0.0.1","type":12}`;
    const data3 = toHex(str);
    const tx1 = {
      from: address,
      to: address,
      value: '0',
      data: `0x${data3}`,
    };
    const sendData = await store.dispatch('account/transaction', tx1)
    $tradeConfirm.update({ status: "approve" })
    localStorage.setItem("close-exchange-tx", JSON.stringify(sendData));
    const receipt = await wallet.provider.waitForTransaction(sendData.hash, null, 60000)
    await dispatch("account/getExchangeStatus");
    store.dispatch('account/waitTxQueueResponse')
    const { status,transactionHash } = receipt
    if (status == 0) {
      $tradeConfirm.update({ status: "fail", hash: transactionHash})
    } else {
      $tradeConfirm.update({ status: "success", callBack() { router.replace({ name: "wallet" }) },hash: transactionHash })
    }
    return receipt


  };

  // Sending Authorization Information
  const sendAuthData = async (address: string) => {
    try {
      const d: any = await getSysParams(address);
      const data = await authExchange();
    } catch (err) {

    }
  };

  // When both trades are successful, check whether the exchange was successfully generated, if not continue to follow the later process
  const initExchangeData = async () => {
    const wallet = await getWallet()
    const { address } = wallet
    console.warn('wallet', wallet)
    const res = await wallet.provider.send('eth_getAccountInfo', [address, "latest"])
    const { ExchangerName, BlockNumber } = res
    let exchange_name = ExchangerName;
    try {
      // If the exchange is not successfully deployed, redeploy it
      const installData = await is_install(address)
      // Check whether setExchangeSig is successfully sent. If no setExchangeSig is sent, send it again

      const data = await getExchangeSig(address)
      if (installData.code == 'true' && !data.data) {
        sendAuthData(address)
      }
    } catch (err) {
      // The exchange failed to deploy successfully, redeploy, and sign to the backend
      const params = await generateSign(exchange_name);
      // Send data to open an exchange
      const sendData = {
        address,
        params: `'${JSON.stringify(params)}'`,
      };
      // Send to the one-click exchange interface
      const val: any = await createExchange(sendData);
      if (val.code == "true") {
        let time = setTimeout(async () => {
          sendAuthData(address)
          clearTimeout(time);
        }, 30000);
      }
    }

  }

  // Modify the escrow service fee/pledge amount
  const modifExchangeBalance = async (
    name: string,
    callBack = () => { }
  ) => {
    // Send the second hosting fee
    try {
      await send2(200, name);
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.resolve();
  };




  // Add the pledge amount  
  const addExchangeBalance = async (
    amount: number,
  ) => {
    const wallet = await getWallet();
    const { address } = wallet;
    // Add the pledge amount
    const str = `wormholes:{"version": "0.0.1","type": 21}`;
    const data3 = toHex(str);
    const tx1 = {
      from: address,
      to: address,
      value: amount,
      data: `0x${data3}`,
    };
    $tradeConfirm.open({
      callBack: () => {
        router.replace({ name: 'wallet' })
      },
      failBack: () => {
        router.replace({ name: 'wallet' })
      }
    })
    // Send the first pledge amount
    try {
      const data1 = await store.dispatch('account/transaction', tx1)
      $tradeConfirm.update({ status: TradeStatus.approve })
      localStorage.setItem("data1", JSON.stringify(data1));
      const receipt1 = await wallet.provider.waitForTransaction(data1.hash, null, 60000);
      const {transactionHash} = receipt1
      dispatch("account/updateAllBalance");
      store.dispatch('account/waitTxQueueResponse')
      if(receipt1.status) {
        $tradeConfirm.update({ status: TradeStatus.success,hash: transactionHash })
      } else {
        $tradeConfirm.update({ status: TradeStatus.fail,hash: transactionHash })
      }
      
    } catch (err: any) {
      if (err.toString().indexOf("timeout") > -1) {
        $tradeConfirm.update({
          status: TradeStatus.warn,
          failMessage:i18n.global.t("error.timeout"),
        });
      } else {
        $tradeConfirm.update({
          status: TradeStatus.fail,
          failMessage: err.reason,
        });
      }
      return Promise.reject(err);
    }
    return Promise.resolve();
  };

  // Reduce the amount pledged
  const miunsExchangeBalance = async (amount: number) => {
    const wallet = await getWallet();
    const { address } = wallet;
    const str = `wormholes:{"type":22,"version":"v0.0.1"}`;
    const data3 = toHex(str);
    const tx1 = {
      from: address,
      to: address,
      value: amount,
      data: `0x${data3}`,
    };
    $tradeConfirm.open({
      callBack: () => {
        router.replace({ name: 'wallet' })
      },
      failBack: () => {
        router.replace({ name: 'wallet' })
      }
    })
    try {
      const data1 = await store.dispatch('account/transaction', tx1)
      $tradeConfirm.update({ status: TradeStatus.approve })
      localStorage.setItem("data1", JSON.stringify(data1));
      const receipt1 = await wallet.provider.waitForTransaction(data1.hash, null, 60000);
      const {transactionHash} = receipt1
      if(receipt1.status) {
        $tradeConfirm.update({ status: TradeStatus.success,hash: transactionHash })
      } else {
        $tradeConfirm.update({ status: TradeStatus.fail,hash: transactionHash })
      }
      $tradeConfirm.update({ status: TradeStatus.success })
      dispatch("account/updateAllBalance");
      store.dispatch('account/waitTxQueueResponse')
      localStorage.setItem("tx1", JSON.stringify(receipt1));
    } catch (err: any) {
      if (err.toString().indexOf("timeout") > -1) {
        $tradeConfirm.update({
          status: TradeStatus.warn,
          failMessage:i18n.global.t("error.timeout"),
        });
      } else {
        $tradeConfirm.update({
          status: TradeStatus.fail,
          failMessage: err.reason,
        });
      }
      return Promise.reject(err);
    }
  }

  // get the fee paid for exchange service
  const getServiceConst = async () => {
    const contract = await getContract()
    console.warn('contract', contract)
    const cost = await contract.functions.exchangeFee()
    return cost
  }

  return {
    getServiceConst,
    createExchanges,
    showCreateExchange,
    showExchange,
    showExchange1,
    exchangeUrl,
    adminUrl,
    ready,
    generateSign,
    exchangeStatus,
    close,
    closeExchanges,
    sendTo,
    sendToPledge,
    initExchangeData,
    modifExchangeBalance,
    addExchangeBalance,
    miunsExchangeBalance,
    send2,
    sendTx2,
    getContract,
    authExchange
  };
};

export function toHex(str: string) {
  if (str === "") return "";
  var hexCharCode = [];
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16));
  }
  return hexCharCode.join("");
}

  // Even contract, issue trade
 export const getContract = async () => {
    const wallet = await getWallet();
    const { URL } = store.state.account.currentNetwork;
    let provider = ethers.getDefaultProvider(URL);
    // const { abi } = erbAbi;
    // const contractAddress = state.account.contractAddress
    const { abi, address: contractAddress } = newErbAbi
    if (!contractAddress) {
      throw new Error("error contractAddress cant't be null")
    }
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const contractWithSigner = contract.connect(wallet);
    return contractWithSigner
  };