<template>
  <div>
    <van-sticky>
      <NavHeader :hasRight="false">
        <template v-slot:left>
          <van-icon name="arrow-left" @click="onClickLeft" class="back-icon" />
        </template>
        <template v-slot:title>
          <div class="tit">{{t('createwallet.createwallet')}}</div>
        </template>
      </NavHeader>
    </van-sticky>
    <div class="content">
      <div class="notice">{{t('createwallet.title')}}</div>
      <div class="create-new-password">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="password"
              type="password"
              name="pwd"
              :label="$t('createwallet.password')"
              :placeholder="$t('createwallet.password')"
              :rules="[{ required: true, message: t('createwallet.password') }]"
            />
            <van-field
              v-model="password2"
              type="password"
              name="pwd2"
              :label="$t('createwallet.password2')"
              :placeholder="$t('createwallet.password2')"
              :rules="[{ required: true, message: t('createwallet.password2') }]"
            />
          </van-cell-group>
          <div style="margin: 16px">
            <van-button :loading="loading" round block type="primary" native-type="submit"
              >{{t('createwallet.createwallet')}}</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import {
  NavBar,
  Form,
  Field,
  CellGroup,
  Button,
  Sticky,
  Icon,
  Toast,
} from "vant";
import { ethers } from "ethers";
import { Ref, ref } from "vue";
import { web3 } from "@/utils/web3";
import { useStore } from "vuex";
import { encryptPrivateKey, EncryptPrivateKeyParams } from "@/utils/web3";
import { createRandomWallet } from "@/utils/ether";
import NavHeader from "@/components/navHeader/index.vue";
import { setCookies, getCookies, loginOut } from "@/utils/jsCookie";

import { useI18n } from 'vue-i18n'
import localforage from 'localforage';


export default {
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    NavHeader,
  },
  setup() {
    const{t}=useI18n()
    const router = useRouter();
    const store = useStore();
    const { commit, dispatch } = store;
    const onClickLeft = () => {
      router.go(-1);
    };
    const loading = ref(false)
    const password: Ref<string> = ref("");
    const password2: Ref<string> = ref("");
    const onSubmit = async (value: object) => {
      console.log("submit", value);
      if (password.value == password2.value) {
        loading.value = true
        try {
          const pwd: string = setCookies("password", password.value);
          const wallet = await dispatch("account/createRandomWallet");
          const { mnemonic, privateKey, address } = wallet;
          const { phrase, path } = mnemonic;
          const mnemonicParams: any = {
            phrase,
            pathIndex: "0",
            path,
          };

          const params: EncryptPrivateKeyParams = {
            privateKey,
            password: password.value,
          };
          //Encrypt passwords and private keys into keystore/ JSON files for storage
          const keyStore = encryptPrivateKey(params);
          await dispatch("account/addAccount", {
            keyStore,
            mnemonic: mnemonicParams,
            address
          });
          commit("account/UPDATE_KEYSTORE", keyStore);
          commit("account/UPDATE_MNEMONIC", mnemonicParams);
          const mnemonicData = encryptPrivateKey({
            privateKey: web3.utils.toHex(phrase),
            password: password.value,
          });
          commit('mnemonic/UPDATE_MNEMONIC',mnemonicData)
          // await localforage.setItem("mnemonic", mnemonicData);
          router.replace({
            name: "wallet",
          });
        } catch (err) {
          
          Toast(t('createwallet.failed'));
        }finally{
          loading.value= false
        }
      } else {
          Toast(t('createwallet.notmatch'));
      }
    };

    return {
      t,
      password,
      password2,
      router,
      onClickLeft,
      onSubmit,
      loading
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  padding-top: 50px;
  .eventname {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
  }
  .notice {
    height: 22px;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }
}
.tit {
  font-size: 16px;
}
.back-icon {
  color: rgba(3, 125, 214, 1);
  font-size: 22px;
  margin-left: -6px;
}
</style>