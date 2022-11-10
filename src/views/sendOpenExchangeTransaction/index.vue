<template>
  <div class="page-sign">
    <NavHeader :hasRight="false">
      <template v-slot:left>
        <div class="flex center back" @click="clickLeft">
          {{ t("common.back") }}
        </div>
      </template>
    </NavHeader>
    <div class="page-container">
      <div class="sign-bg flex center">
        <div>
          <div class="text-center sign-bg-icon">
            <van-icon name="records" />
          </div>
          <div class="text-center sign-bg-tit">{{t('bourse.sendProxyExchange')}}</div>
          <div class="text-center sign-bg-tit1">
            {{ t("sign.confirmsignaturedata") }}
          </div>
        </div>
      </div>
      <div class="sign-info">
        <div class="title">{{ t("sign.walletaddress") }}</div>
        <div class="value">{{ address }}</div>
        <div class="title">{{ t("sign.signaturedata") }}</div>
        <div class="value">
          {{ txs }}
        </div>
      </div>
      <h2 class="text-center">{{t('bootstrapwindow.balance')}}：{{ nowAccount.amount }}</h2>
      <div class="flex between btn-box">
        <van-button
          type="default"
          @click="router.replace({ name: 'wallet' })"
          plain
          >{{ t("sign.cancel") }}</van-button
        >
        <van-button type="primary" @click="toSend" :loading="sendLoading">{{
          t("sign.confirm")
        }}</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  reactive,
  ref,
  computed,
  Ref,
  onActivated,
  onMounted,
  onBeforeMount,
  nextTick,
} from "vue";
import {
  Icon as VanIcon,
  Toast,
  Button as VanButton,
  Sticky,
  Field,
} from "vant";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import NavHeader from "@/components/navHeader/index.vue";
import { getCookies } from "@/utils/jsCookie";
import { createWalletByJson } from "@/utils/ether";
import {
  ExchangeStatus,
  getWallet,
  handleGetTranactionReceipt,
  TransactionTypes,
  clone,
} from "@/store/modules/account";

import { ethers, utils } from "ethers";
import { web3 } from "@/utils/web3";
import { useI18n } from "vue-i18n";
import { getRandomIcon } from "@/utils/index";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { useExchanges, toHex } from "@/hooks/useExchanges";
import { useDialog } from "@/plugins/dialog";
import { useToast } from "@/plugins/toast";
import { hashMessage } from "@/utils/ether";
import BigNumber from "bignumber.js";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
import { encode, decode } from "js-base64";
import { Actions } from "@/views/connectWallet/index.vue";
import { useSign } from "@/views/sign/hooks/sign";
import { handleConnectBackUrl } from "../connectWallet/index.vue";
import { debug } from "util";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
const { $tradeConfirm } = useTradeConfirm();
const newErbAbi = require("@/assets/json/packagePay.json");

const { abi, address: contractAddress } = newErbAbi;
debugger
const { t } = useI18n();
const { sendTo } = useExchanges();
const { query } = useRoute();
const { $toast } = useToast();
const { state, commit, dispatch } = useStore();
const { toSign } = useSign();
const { backUrl, action, address, txs }: any = query;
const txList = txs ? JSON.parse(txs) : [];
const tx1 = txList.find((item: any) => item.type === 'pledge')
const tx2 = txList.find((item: any) => item.type === 'package')
const accountList = computed(() => state.account.accountList);
const currentNetwork = computed(() => state.account.currentNetwork);
const sendLoading = ref(false);
const nowAccount = computed(() => state.account.accountInfo);
let data1,data2,receipt1:TransactionReceipt,receipt2:TransactionReceipt,rep1, rep2;
const router = useRouter();
function clickLeft() {
  router.replace({ name: "wallet" });
}

onMounted(() => {
  dispatch("account/updateAllBalance");
});
async function getContract(wallet: any) {
  if (!contractAddress) {
    throw new Error("error contractAddress cant't be null");
  }
  let provider = ethers.getDefaultProvider(currentNetwork.value.URL);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(wallet);
  return contractWithSigner;
}
const callBack = () => {
  const data = resData.value;
  const url = handleConnectBackUrl({
    action: Actions.sendOpenExchangeTransaction,
    data: {
      auth: data,
      status1: receipt1 ? receipt1.status: '',
      status2: receipt2 ? receipt2.status : ''
    },
    backUrl,
  });
  location.href = url;
};

const resData: any = ref({});

async function toSend() {
  if (!tx2 && !tx1) {
    $toast.warn(t("error.500"));
    return;
  }
  $tradeConfirm.open({
    approveMessage: t("createExchange.create_approve"),
    successMessage: t("createExchange.create_waiting"),
    wattingMessage: t("createExchange.create_success"),
    failMessage: t("createExchange.create_wrong"),
    callBack,
    failBack: callBack,
  });
  try {
    const network = clone(state.account.currentNetwork);
    // sendLoading.value = true
    const wallet = await getWallet();
    if(tx1){
      const { pledge, fee_rate, name } = tx1;
      data1 = await send1(name, fee_rate, pledge);
      receipt1 = await wallet.provider.waitForTransaction(data1.hash);
      rep1 = handleGetTranactionReceipt(
      TransactionTypes.default,
      receipt1,
      data1,
      network
    );
    commit("account/PUSH_TRANSACTION", rep1);
    const { status: status1 } = receipt1;
    if(!status1) {
      $tradeConfirm.update({ status: "fail" })
      return
    }
    }
    if(tx2){
      const { package_id, amount } = tx2;
      data2 = await send2(package_id, amount);
      receipt2 = await data2.wait();
      rep2 = handleGetTranactionReceipt(
      TransactionTypes.contract,
      receipt2,
      data2,
      network
    );
    commit("account/PUSH_TRANSACTION", rep2);
    const { status: status2 } = receipt2;
    if(!status2) {
      $tradeConfirm.update({ status: "fail" }) 
      return
    }
    }
    $tradeConfirm.update({ status: "approve" });
    let name = ''
    if(!tx1){
      const {ExchangerName} = await wallet.provider.send("eth_getAccountInfo", [address,"latest"]);
      name = decode(ExchangerName)
    } else {
      name = tx1.name
    }
    resData.value = await generateSign(name);
    $tradeConfirm.update({ status: "success" });

  } catch (err) {
    console.error(err);
    $tradeConfirm.update({ status: "fail" });
  }
}

/**
 * Generate a signed exchange authorization information
 */
const generateSign = async (name: string) => {
  const wallet = await getWallet();
  const blockNumber = await wallet.provider.getBlockNumber();
  const exchanger_owner: string = wallet.address;
  const to: string = "0x7fBC8ad616177c6519228FCa4a7D9EC7d1804900";
  const exchange_name: string = name;

  const newstr = hashMessage(`${exchanger_owner}${to}${blockNumber}`);
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
        resolve(params);
      },
    });
  });
};

async function send1(
  name: string = "",
  fee_rate: string = "",
  amount: string = ""
) {
  if (!name || !fee_rate || !amount) {
    $tradeConfirm.update({ status: "fail", failBack: () => {} });
    throw new Error(
      "Parameter is invalid name or fee_rate or amount is undefined"
    );
  }
  const wallet = await getWallet();
  const { address } = wallet;
  const baseName = encode(name);
  const str = `wormholes:{"version": "0","type": 11,"fee_rate": ${fee_rate},"name":"${baseName}","url":""}`;
  // const str = `wormholes:{"type":"9", "proxy_address":"0x591813F0D13CE48f0E29081200a96565f466B212", "version":"0.0.1"}`
  const data3 = toHex(str);
  const tx1 = {
    from: address,
    to: address,
    value: ethers.utils.parseEther(amount + ""),
    data: `0x${data3}`,
  };
  try {
    const network = clone(state.account.currentNetwork);
    const data = await wallet.sendTransaction(tx1);
    const { from, gasLimit, gasPrice, hash, nonce, to, type, value } = data;
    commit("account/PUSH_TXQUEUE", {
      hash,
      from,
      gasLimit,
      gasPrice,
      nonce,
      to,
      type,
      value,
      txType: TransactionTypes.default,
      transitionType: "11",
      network,
    });
    return Promise.resolve(data);
  } catch (err) {
    $tradeConfirm.update({ status: "fail" });
    return Promise.reject(err);
  }
}

async function send2(package_id: string = "", amount: string = "0") {
  if (!package_id || !Number(amount)) {
    $tradeConfirm.update({ status: "fail", failBack: () => {} });

    throw new Error("Parameter is invalid package_id is undefined");
  }
  try {
    const network = clone(state.account.currentNetwork);
    const wallet = await getWallet();
    const contractWithSigner = await getContract(wallet);
    const value = ethers.utils.parseEther(amount + '')
    const data = await contractWithSigner.functions.payForPackage(package_id +'',{
      value
    });

    const {
      from: from2,
      gasLimit: gasLimit2,
      gasPrice: gasPrice2,
      hash: hash2,
      nonce: nonce2,
      to: to2,
      type: type2,
      value: value2,
    } = data;
    commit("account/PUSH_TXQUEUE", {
      hash: hash2,
      from: from2,
      gasLimit: gasLimit2,
      gasPrice: gasPrice2,
      nonce: nonce2,
      to: to2,
      type: type2,
      value: value2,
      transitionType: null,
      txType: TransactionTypes.contract,
      network,
    });
    localStorage.setItem("contact 1", JSON.stringify(data));
    return Promise.resolve(data);
  } catch (err) {
    $tradeConfirm.update({ status: "fail" });
    return Promise.reject();
  }
}
</script>
<style lang="scss" scoped>
.back {
  color: #037cd6;
  font-size: 12px;
}

.page-sign {
  .btn-box {
    margin-top: 20px;
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 25px;

    .van-button {
      width: 160px;
    }
  }

  .sign-bg {
    background: #f4faff;
    height: 135px;

    &-icon {
      font-size: 40px;
      color: #037cd6;
    }

    &-tit {
      line-height: 20px;
      font-size: 15px;
      font-weight: bold;
      margin-top: 5px;
    }

    &-tit1 {
      font-size: 12px;
      line-height: 16px;
      margin-top: 7.5px;
    }
  }

  .sign-info {
    margin: 25px 27px;
    padding: 15px;
    max-height: 327px;
    border-radius: 4px;
    overflow-y: scroll;
    border: 1px solid #e4e7e8;

    div {
      word-break: break-all;
      font-size: 14px;
    }

    .title {
      line-height: 30px;
    }

    .value {
      line-height: 14px;

      // &.select {
      //   background: #1989fa;
      //   color:#fff;
      // }
      &:nth-of-type(1) {
        margin-bottom: 20px;
      }
    }

    .value.focus {
      background: #3897f7;
      color: #fff;
      outline: none;
      display: inline;
      animation: select 200ms step-end forwards;
    }
  }

  @keyframes select {
    to {
      -webkit-user-select: text;
      user-select: text;
    }
  }
}
</style>