<template>
  <div class="ai-page">
    <van-form @submit="onSubmit">
      <van-cell-group class="formGroup">
        <div class="label mb-6">
          <span class="mr-4">*</span>{{ t("generateNFT.promptWord") }}
          <van-popover v-model:show="showWord" theme="dark" placement="bottom-start">
            <div class="p-10">
              <div>{{ t("generateNFT.promptTip") }}</div>
              <div>{{ t("generateNFT.promptTip1") }}</div>
              <div>{{ t("generateNFT.promptTip2") }}</div>
            </div>
            <template #reference>
              <van-icon name="question hover" @mouseover="showWord = true" @mouseleave="showWord = false" />
            </template>
          </van-popover>
        </div>
        <van-field :class="wordErr ? 'error' : ''" label-align="top" v-model="promptWord" :disabled="query.address ? true : false" autosize :rows="6" clearable type="textarea" label="" :placeholder="t('generateNFT.placeholder')" :rules="[{ validator: validatorWord }]" />

        <div class="label mt-16">
          <span class="mr-4">*</span>{{ t("castingnft.royalty") }} ( 1%-10% )

        </div>
        <van-field v-model="royalty" name="royalty" :disabled="query.address ? true : false" :class="royaltyErr ? 'error' : ''" type="digit" @blur="blurRoyalty" :placeholder="$t('castingnft.royaltyPlaceholder')" :rules="[{ validator: validRoyalty }]" />

        <div class="label mt-16 mb-8">
          {{ t("generateNFT.creativeMode") }}
          <van-popover v-model:show="showSwitch" theme="dark" placement="right">
            <p class="pl-10 pr-10">{{ t("generateNFT.aiDrawTip") }}</p>
            <template #reference>
              <van-icon name="question hover" @mouseover="showSwitch = true" @mouseleave="showSwitch = false" />
            </template>
          </van-popover>
        </div>
        <div class="form-item">
          <van-switch v-model="checked" size="20" :disabled="readonlySwitch" />
        </div>

        <div v-if="checked">
          <div class="label mt-16 mb-8">
            <span class="mr-4">*</span>{{ t("generateNFT.emailAddr") }}
            <van-popover v-model:show="showAddr" theme="dark" placement="right">
              <p class="pl-10 pr-10">{{ t("generateNFT.emailTip") }}</p>
              <template #reference>
                <van-icon name="question hover" @mouseover="showAddr = true" @mouseleave="showAddr = false" />
              </template>
            </van-popover>
          </div>
          <van-field v-if="isModif || checked" :class="emailErr ? 'error' : ''" label-align="top" v-model="emailAddr" label="" clearable :placeholder="t('generateNFT.placeEmail')" :rules="[{ validator: validatorEmail }]" />
          <div class="form-item" v-else>
            <span>{{ emailAddr }}</span>
            <i class="iconfont icon-bianji ml-6 hover" @click="isModif = false"></i>
          </div>
        </div>
      </van-cell-group>
      <div class="btn-box mt-30">
        <div class="container flex center pl-28 pr-28">
          <van-button round block type="primary" native-type="submit">
            {{ t("sendto.next") }}
          </van-button>
        </div>
      </div>
    </van-form>

    <CommonModal v-model="showGenerateModal" :title="t('generateNFT.geneateComfirm')">
      <CreateModal @cancel="showGenerateModal = false" @confirm="handleConfirm" :gasFee="gasFee" :value="sendVal" :sendAddr="sendAddr" :promptWord="promptWord" :email="emailAddr" />
    </CommonModal>
  </div>
</template>
<script lang="ts" setup>
import { collectibleRules, regAa, regEmail, RegUrl } from "@/enum/regexp";
import {
  Form as VanForm,
  CellGroup as VanCellGroup,
  Field as VanField,
  Button as VanButton,
  Icon as VanIcon,
  Popover as VanPopover,
  Switch as VanSwitch,
} from "vant";
import { onMounted, ref, Ref, watch } from "vue";
import BigNumber from "bignumber.js";
import { useI18n } from "vue-i18n";
import {
  getAiServerAddr,
  drawImage,
  getEmailByUser,
  DrawImageParams,
  getPaintFee,
} from "@/http/modules/nft";
import CommonModal from "@/components/commonModal/index.vue";
import CreateModal from "../components/createModal.vue";
import { getWallet } from "@/store/modules/account";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { web3 } from "@/utils/web3";
import { useTradeConfirm } from "@/plugins/tradeConfirmationsModal";
import { TradeStatus } from "@/plugins/tradeConfirmationsModal/tradeConfirm";
import { useToast } from "@/plugins/toast";
import { useRouter, useRoute } from "vue-router";
import { getGasFee } from "@/store/modules/account";
import { decode } from "js-base64";

const { $wtoast } = useToast();
const { $tradeConfirm } = useTradeConfirm();
const router = useRouter();
const { dispatch, state } = useStore();
const { t } = useI18n();
const showWord = ref(false);
const emailErr = ref(false);
const wordErr = ref(false);
const royaltyErr = ref(false);
const showPopover3 = ref(false);
const route = useRoute();

const query: any = route.query;
const drawInfo = query.data ? JSON.parse(decodeURIComponent(query.data)) : null;
const info = drawInfo && drawInfo.info ? JSON.parse(drawInfo.info) : drawInfo

const promptWord = ref(info ? info.prompt : "");
const checked = ref(info.aiModel || drawInfo.modif || false);
debugger
const showAddr = ref(false);
const showSwitch = ref(false);
const readonlySwitch = ref(drawInfo.address ? true : false);
const emailAddr = ref(info.email || "");
const isModif = ref(drawInfo.modif ? true : false);
const royalty: Ref<number | string> = ref(
  drawInfo.royalty ? Number(drawInfo.royalty) : ""
);

const showGenerateModal = ref(false);
const onSubmit = async () => {
  if (checked.value && RegUrl.test(promptWord.value)) {
    $wtoast.warn(t("generateNFT.normalNftTip"));
    return;
  }
  if(readonlySwitch.value && !emailAddr.value){
    return
  }
  try {
    showGenerateModal.value = true;
    const isNormalCreate = !checked.value && RegUrl.test(promptWord.value);
    const myAddr = state.account.accountInfo.address;

    // Not ordinary casting to determine whether pure ai drawing
    if (!isNormalCreate) {
      const gas2 = await getGasFee({
        to: myAddr,
        value: ethers.utils.parseEther("1"),
      });

      // Judge whether it is simple drawing or casting + drawing
      if (readonlySwitch.value) {
        gasFee.value = gas2;
      } else {
        const gas1 = await handleGetGas();
        gasFee.value = new BigNumber(gas1).plus(gas2).toString();
      }
    } else {
      const gas1 = await handleGetGas();
      gasFee.value = gas1;
    }
  } catch (err) {
    $wtoast.fail(err.reason)
  }
};

const handleGetGas = async () => {
  const isNormalCreate = !checked.value && RegUrl.test(promptWord.value);
  const myAddr = state.account.accountInfo.address;
  const randomNumber = Math.round(Math.random() * 2147483647) + "";
  const nft_data: any = {};
  if (isNormalCreate) {
    nft_data.meta_url = promptWord.value;
  } else {
    nft_data.prompt = promptWord.value;
    nft_data.randomNumber = randomNumber;
    nft_data.version = 'v1'
  }
  const par = {
    version: "0.0.1",
    type: 0,
    royalty: Number(royalty.value) * 100,
    exchanger: "",
    meta_url: web3.utils.fromUtf8(JSON.stringify(nft_data)),
  };
  const parstr = `wormholes:${JSON.stringify(par)}`;
  const newdata = web3.utils.fromUtf8(parstr);
  debugger
  const tx = {
    to: myAddr,
    from: myAddr,
    data: newdata,
    value: ethers.utils.parseEther(sendVal.value.toString()),
  };
  const gas1 = await getGasFee(tx);
  return gas1;
};


watch(() => checked.value, n => {
  if (!n) {
    emailAddr.value = ''
  }
})

const successCallback = () => {
  const back = decode(query.backUrl)
  location.href = `${back}?action=createNft&status=${true}`;
}
// 1 normal create nft
const normalCreate = async () => {
  const nft_data = {
    meta_url: promptWord.value,
  };
  const { receipt, nft_address, owner, hash } = await handleSendCreate(
    nft_data,
    () => {
      $tradeConfirm.update({ status: "approve" });
    }
  );

  $tradeConfirm.update({
    status: "success",
    hash,
    callBack: successCallback,
  });

  return { receipt, nft_address, owner };
};
// 2 ai create nft
const aiCreate = async () => {
  const randomNumber = Math.round(Math.random() * 2147483647) + "";
  const nft_data = {
    prompt: promptWord.value,
    randomNumber,
    version: 'v1'
  };
  const { receipt, nft_address, owner } = await handleSendCreate(nft_data);
  const drawParams = {
    useraddr: owner,
    nftaddr: nft_address,
    email: emailAddr.value.toString(),
    drawflag: "1",
  };
  const drawData = await drawImage(drawParams);
  const sendData = {
    nft_address,
    owner,
    version: "v1"
  }
  const txData = await dispatch("account/transaction", {
    value: sendVal.value,
    to: sendAddr.value,
    data: web3.utils.fromUtf8(JSON.stringify(sendData))
  });
  $tradeConfirm.update({ status: "approve" });
  const txReceipt = await txData.wait();

  if (txReceipt.status != 1) {
    $tradeConfirm.update({
      status: "fail",
      hash: txData.hash,
      callBack() {
        location.href = `${decode(query.backUrl)}?action=createNft&status=${false}`;
      },
    });
    return Promise.reject('tx fail');
  }


  return { nft_address, owner, hash: txData.hash };
};

// send create nft tx data
const handleSendCreate = async (nft_data = {}, call = (v: any) => { }) => {
  const myAddr = state.account.accountInfo.address;
  const par = {
    version: "0.0.1",
    type: 0,
    royalty: Number(royalty.value) * 100,
    exchanger: "",
    meta_url: web3.utils.fromUtf8(JSON.stringify(nft_data)),
  };
  const parstr = `wormholes:${JSON.stringify(par)}`;
  const newdata = web3.utils.fromUtf8(parstr);
  const tx = {
    to: myAddr,
    from: myAddr,
    data: newdata,
    value: "0",
  };
  const txRes = await dispatch("account/transaction", tx);
  call(txRes);
  const receipt = await txRes.wait();
  const {
    logs: [log],
    status,
  } = receipt;
  if (!status) {
    return Promise.reject("failure of transaction");
  }
  const { topics } = log;
  const [addr1, fullnftaddr] = topics;
  const nft_address = "0x" + fullnftaddr.substr(fullnftaddr.length - 40);

  return { receipt, nft_address, owner: myAddr, hash: txRes.hash };
};

// const grnerateLoading = ref(false)
const gasFee = ref("");
const handleConfirm = async () => {
  const isNormalCreate = !checked.value && RegUrl.test(promptWord.value);
  // grnerateLoading.value = true
  showGenerateModal.value = false;
  $tradeConfirm.open({
    disabled: [TradeStatus.pendding, TradeStatus.approve],
    callback() {
      location.href = `${decode(query.backUrl)}?action=createNft&status=${true}`;
    },

  });
  try {
    const myAddr = state.account.accountInfo.address;
    debugger;
    if (!readonlySwitch.value) {
      if (isNormalCreate) {
        await normalCreate();
      } else {
        if (checked.value) {
          const { nft_address, owner, hash }: any = await aiCreate();

          $tradeConfirm.update({
            status: "success",
            hash: hash,
            callBack: successCallback,
          });
        } else {
          const randomNumber = Math.round(Math.random() * 2147483647) + "";
          const nft_data = {
            prompt: promptWord.value,
            randomNumber,
            version: 'v1'
          };
          const { receipt, nft_address, owner } = await handleSendCreate(
            nft_data
          );
          $tradeConfirm.update({
            status: "success",
            hash: receipt.transitionHash,
            callBack: successCallback,
          });
        }
      }
    } else {
      debugger;
      const nft_address = drawInfo.address ? drawInfo.address.toString() : ""
      const sendData = {
        owner: myAddr,
        nft_address,
        version: "v1"
      }
      const drawParams = {
        useraddr: myAddr.toString(),
        nftaddr: nft_address,
        email: emailAddr.value.toString(),
        drawflag: "1",
      };
      await drawImage(drawParams);
      // Step 3 draw
      const txData = await dispatch("account/transaction", {
        value: sendVal.value,
        to: sendAddr.value,
        data: web3.utils.fromUtf8(JSON.stringify(sendData))
      });
      $tradeConfirm.update({ status: "approve" });
      const txReceipt = await txData.wait();


      if (txReceipt.status != 1) {
        $tradeConfirm.update({
          status: "fail",
          hash: txData.hash,
          callBack() {
            location.href = `${decode(query.backUrl)}?action=createNft&status=${false}`;

          },
        });
        return;
      }
      $tradeConfirm.update({
        status: "success",
        hash: txData.hash,
        callBack: successCallback,
      });
    }
  } catch (err: any) {
    console.error(err);
    $wtoast.warn(err.reason);
  } finally {
    dispatch('account/waitTxQueueResponse')
    showGenerateModal.value = false;
  }
};

const validatorEmail = (v: string) => {
  if (!v) {
    emailErr.value = true;
    return t("generateNFT.emailNotNull");
  }
  if (!regEmail.test(v)) {
    emailErr.value = true;
    return t("generateNFT.emailError");
  }
  emailErr.value = false;
  return true;
};
const validatorWord = (v: string) => {
  if (!v) {
    wordErr.value = true;
    return t("generateNFT.promptWordNotNull");
  }
  if (
    (regAa.test(v) && !RegUrl.test(v)) ||
    (!regAa.test(v) && RegUrl.test(v))
  ) {
    wordErr.value = false;
    return true;
  }

  if (!regAa.test(v) && !RegUrl.test(v)) {
    wordErr.value = true;
    return t("generateNFT.promptWordErr");
  }
  wordErr.value = false;
  return true;
};

const validRoyalty = (v: string) => {
  if (!v) {
    royaltyErr.value = true;
    return t("castingnft.numbersof");
  }
  royaltyErr.value = false;
  return true;
};

const blurRoyalty = () => {
  const bigInt = new BigNumber(royalty.value || "0");
  if (bigInt.gt(10)) {
    royalty.value = 10;
    return;
  }
  if (bigInt.lt(1)) {
    royalty.value = 1;
    return;
  }
  // Keep one decimal place
  royalty.value = parseInt(bigInt.toFormat(1).toString());
};

const sendAddr = ref("");
const sendVal = ref(0)
onMounted(async () => {
  const res = await getAiServerAddr();
  sendAddr.value = res.data;
  const res2 = await getPaintFee()
  sendVal.value = Number(ethers.utils.formatUnits(res2.data, 'ether'))
  onSubmit()
  if (readonlySwitch.value) {
    const myAddr = state.account.accountInfo.address;
    const resEmail = await getEmailByUser({ useraddr: myAddr });
    emailAddr.value = resEmail.data;
    onSubmit()
  }
});
</script>
<style lang="scss" scoped>
.ai-page {
  padding: 20px 0 0;
}

:deep() {
  .van-cell .van-field__body {
    min-height: 44px;
    height: auto;
  }

  .van-field--label-top {
    padding: 0 15px;
  }

  .formGroup {
    &::after {
      display: none;
    }
  }

  .van-cell::after {
    display: none;
  }

  .van-field__error-message {
    margin-top: 7px;
  }
}

.label {
  padding: 0 15px;
  line-height: 17px;
  font-size: 12px;
  font-weight: bold;

  span {
    color: red;
    font-weight: normal;
  }
}

.form-item {
  padding: 0 15px;
  font-size: 12px;

  i {
    color: grey;
    font-size: 12px;
  }
}
</style>