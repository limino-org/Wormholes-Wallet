<template>
  <div class="ai-page">
    <van-form @submit="onSubmit">
      <van-cell-group class="formGroup">
        <div class="label mb-6">
          <span class="mr-4">*</span>{{ t("generateNFT.promptWord") }}
          <van-popover v-model:show="showWord" theme="dark" placement="right">
            <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
            <template #reference>
              <van-icon
                name="question hover"
                @mouseover="showWord = true"
                @mouseleave="showWord = false"
              />
            </template>
          </van-popover>
        </div>
        <van-field
         :class="wordErr ? 'error' : ''"
          label-align="top"
          v-model="promptWord"
          autosize
          :rows="6"
          clearable
          type="textarea"
          label=""
          :placeholder="t('generateNFT.placeholder')"
          :rules="[
            {validator: validatorWord},
          ]"
        />
        <div class="label mt-16 mb-8">
          {{ t("generateNFT.creativeMode") }}
          <van-popover v-model:show="showSwitch" theme="dark" placement="right">
            <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
            <template #reference>
              <van-icon
                name="question hover"
                @mouseover="showSwitch = true"
                @mouseleave="showSwitch = false"
              />
            </template>
          </van-popover>
        </div>
        <div class="form-item">
          <van-switch v-model="checked" size="20" />
        </div>

        <div v-if="checked">
          <div class="label mt-16 mb-8">
            <span class="mr-4">*</span>{{ t("generateNFT.emailAddr") }}
            <van-popover v-model:show="showAddr" theme="dark" placement="right">
              <p class="pl-10 pr-10">{{ t("sendto.gastit") }}</p>
              <template #reference>
                <van-icon
                  name="question hover"
                  @mouseover="showAddr = true"
                  @mouseleave="showAddr = false"
                />
              </template>
            </van-popover>
          </div>
          <van-field
            v-if="!isModif"
            :class="emailErr ? 'error' : ''"
            label-align="top"
            v-model="emailAddr"
            label=""
            clearable
            :placeholder="t('generateNFT.placeEmail')"
            :rules="[
              {validator: validatorEmail},
            ]"
          />
          <div class="form-item" v-else>
            <span>{{ emailAddr }}</span>
            <i
              class="iconfont icon-bianji ml-6 hover"
              @click="isModif = false"
            ></i>
          </div>
        </div>
      </van-cell-group>
      <div class="btn-box">
        <div class="container flex center pl-28 pr-28">
          <van-button round block type="primary" native-type="submit">
            {{ t("sendto.next") }}
          </van-button>
        </div>
      </div>
    </van-form>

    <CommonModal
      v-model="showGenerateModal"
      :title="t('generateNFT.geneateComfirm')"
    >
      <CreateModal @cancel="showGenerateModal = false" @confirm="handleConfirm" />
    </CommonModal>
  </div>
</template>
<script lang="ts" setup>
import { collectibleRules, regAa, regEmail } from "@/enum/regexp";
import {
  Form as VanForm,
  CellGroup as VanCellGroup,
  Field as VanField,
  Button as VanButton,
  Icon as VanIcon,
  Popover as VanPopover,
  Switch as VanSwitch,
} from "vant";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { encode, decode } from 'js-base64';

import CommonModal from "@/components/commonModal/index.vue";
import CreateModal from "../components/createModal.vue";
import { getWallet } from "@/store/modules/account";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { web3 } from "@/utils/web3";
import { createUUID } from "@/utils/utils";

const { dispatch, state } = useStore()
const { t } = useI18n();
const showWord = ref(false);
const emailErr = ref(false)
const wordErr = ref(false)
const onSubmit = () => {
  showGenerateModal.value = true;
};
const promptWord = ref("");
const checked = ref(false);
const showAddr = ref(false);
const showSwitch = ref(false);
const emailAddr = ref("");

const isModif = ref(emailAddr.value ? true : false);

const showGenerateModal = ref(false);
// 
const handleConfirm = async() => {
  const myAddr = state.account.accountInfo.address
  const randomNumber = createUUID().replaceAll('-','')
  const nft_data =
  {
    prompt:promptWord.value,
    randomNumber
  }
  debugger
  const str = `wormholes:{"version": "0.0.1","type":0,"royalty":200,"exchanger":"","meta_url":"${encode(JSON.stringify(nft_data))}"}`
 const data = web3.utils.fromUtf8(str);
  const tx = {
    to:myAddr,
    from:myAddr,
    data,
    value: '0'
  }
  const txRes = await dispatch('account/transaction', tx)
  debugger
  const receipt = await txRes.wait()
  debugger
  const {logs:[log]} = receipt
  const [logData] = log


}

const validatorEmail = (v: string) => {
  if(!v){
    emailErr.value = true
    return t('generateNFT.emailNotNull')
  }
  if(!regEmail.test(v)){
    emailErr.value = true
    return t('generateNFT.emailError')
  }
  emailErr.value = false
  return true
}
const validatorWord = (v: string) => {
  if(!v){
    wordErr.value = true
    return t('generateNFT.promptWordNotNull')
  }
  if(!regAa.test(v)){
    wordErr.value = true
    return t('generateNFT.promptWordErr')
  }
  wordErr.value = false
  return true
}

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
.btn-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
}
</style>