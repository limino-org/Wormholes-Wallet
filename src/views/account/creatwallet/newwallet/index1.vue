<template>
    <NavHeader :hasRight="false">
      <template v-slot:left>
       <span class="back hover" @click="back">{{t('createAccountpage.back')}}</span>
      </template>
      <template v-slot:title>
        <div class="flex center title">{{t('wallet.wormHoles')}}</div>
      </template>
    </NavHeader>
  <div>
    <div class="title">
      <!-- <img class="iconele flex center" src="@/assets/token/logowallet.png" /> -->
      <WormholesTransition size="small" >
        <template v-slot:icon>
          <img class="iconele flex center" src="@/assets/token/logowallet.png" />
        </template>
      </WormholesTransition>
      <div class="tit-big text-center f-24 mt-10">
        {{ t("createAccountpage.createAccount") }}
      </div>
      <div class="tit-small text-center f-12 mt-6  lh-16">
        {{ t("createAccountpage.setup") }}
      </div>
    </div>
    <div class="create-new-password">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <div class="text-bold f-12 mt-10 mb-10 lh-16 flex between">
            <span>{{ t("createAccountpage.password") }}</span>
            <span>
              <i
                @click="toggleMask"
                :class="`iconfont hover ${
                  choice ? 'icon-yanjing' : 'icon-yanjing1'
                }`"
              ></i>
            </span>
          </div>
          <van-field
            validate-trigger="onSubmit"
            :class="`text ${pw1Error ? 'error' : ''}`"
            v-model="password"
            name="password"
            :type="`${choice ? 'text' : 'password'}`"
            :placeholder="$t('createAccountpage.passwordPlaceholder')"
            :rules="[
              // { required: true, message:t('createAccountpage.pwdMessage') },
              { validator: asynPwd },
            ]"
          />
          <!-- <div class="tit-small f-12" v-if="password.length<6||password.length>20">{{$t('createAccountpage.pwdMessage')}}</div> -->
          <div class="text-bold f-12 mt-20 mb-10 lh-16 flex between">
            <span>{{ t("createAccountpage.confirmPassword") }}</span>
          </div>
          <van-field
            validate-trigger="onSubmit"
            v-model="password2"
            :class="`text ${pw2Error ? 'error' : ''}`"
            :type="`${choice ? 'text' : 'password'}`"
            name="password2"
            :placeholder="t('createAccountpage.confirmPassword')"
            :rules="[
              //  { required: true, message:t('createAccountpage.pwdMessage') },
              { validator: asynPwd2 },
              {
                validator: asynPwd3,
                message: t('createAccountpage.inconsistentPwd'),
              },
            ]"
          />
          <!-- Privacy agreement  -->
          <div class="yinsi flex con"></div>
        </van-cell-group>
        <div class="btn-box">
          <div class="flex center container pl-28 pr-28">
          <van-button
            :loading="loading"
            round
            block
            :disabled="btnDisabled"
            type="primary"
            native-type="submit"
            >{{ t("createAccountpage.createAccount") }}</van-button
          >
          </div>

        </div>
      </van-form>
      <div class="pwd-tip">
        <i18n-t keypath="createAccountpage.pwdTip" tag="div" class="text-center mt-20 lh-16">
          <template v-slot:br><br></template>
          <template v-slot:link1><span class="hover" @click="routerTo('termsOfUse')">{{t('createAccountpage.link1')}}</span></template>
          <template v-slot:link2><span class="hover" @click="routerTo('privacyNotice')">{{t('createAccountpage.link2')}}</span></template>
        </i18n-t>
      </div>
    </div>
  </div>
    <!-- Terms of service -->
  <!-- <TermsService  v-model:show="modal1" :hasSelect="false" /> -->
  <!-- Privacy policy -->
  <!-- <PrivacyPolicy  v-model:show="modal2" :hasSelect="false" /> -->


</template>
<script lang="ts">
import Vue from "vue";
import { useStore } from "vuex";
import NavHeader from '@/components/navHeader/index.vue'

import {
  Icon,
  Toast,
  Button,
  Sticky,
  Field,
  Form,
  CellGroup,
  Switch,
  Checkbox,
  CheckboxGroup,
} from "vant";
import { encryptPrivateKey, EncryptPrivateKeyParams } from "@/utils/web3";
import { ref, Ref, computed, toRaw, SetupContext, onMounted } from "vue";
import { setCookies, getCookies, loginOut } from "@/utils/jsCookie";
import { web3 } from "@/utils/web3";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { regPassword1 } from "@/enum/regexp";
import TermsService from '@/components/termsservice/index.vue'
import PrivacyPolicy from '@/components/privacypolicy/index.vue'
import WormholesTransition from '@/components/wromTransition/index.vue'
import localforage from 'localforage';

export default {
  name: "newwallet",
  components: {
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Switch.name]: Switch,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    PrivacyPolicy,
    TermsService,
    WormholesTransition,
    NavHeader
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { commit, dispatch } = store;
    const password: Ref<string> = ref("");
    const password2: Ref<string> = ref("");
    const loading = ref(false);
    const choice: Ref<boolean> = ref(false);
    const checked: Ref<boolean> = ref(false);
    const checked1: Ref<boolean> = ref(true);
    const onSubmit = async (value: object) => {
      console.log("submit", value);
      // Verify that passwords are consistent
      if (password.value == password2.value) {
        loading.value = true;
        // Store password
        try {
          const pwd: string = setCookies(
            "password",
            password.value,
          );
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
          debugger;
          // Encrypt the password and private key into a keystore/ JSON file for storage
          const keyStore = encryptPrivateKey(params);
          debugger;
          await dispatch("account/addAccount", {
            keyStore,
            mnemonic: mnemonicParams,
            address,
          });
          commit("account/UPDATE_KEYSTORE", keyStore);
          commit("account/UPDATE_MNEMONIC", mnemonicParams);
          const mnemonicData = encryptPrivateKey({
            privateKey: web3.utils.toHex(phrase),
            password: password.value,
          });
          // await localforage.setItem("mnemonic", mnemonicData);
          commit('mnemonic/UPDATE_MNEMONIC',mnemonicData)
          router.replace({
            name: "create-step",
          });
        } catch (err) {
          console.error(err);
          loading.value = false;
          Toast(t("createwallet.failed"));
        }
      } else {
        // The entered passwords are inconsistent
        Toast(t("createwallet.notmatch"));
      }
    };
    const pw1Error = ref(false);
    const pw2Error = ref(false);
    const asynPwd = (val: string) => {
      pw1Error.value = false;
      if (!val) {
        pw1Error.value = true;

        return t("createAccountpage.pwdMessage");
      }
      if (regPassword1.test(password.value)) {
        return true;
      }
      pw1Error.value = true;
      return t("createAccountpage.pwdWorng");
    };
    const asynPwd2 = (val: string) => {
      pw2Error.value = false;
      if (!val) {
        pw2Error.value = true;

        return t("createAccountpage.pwdMessage");
      }
      if (regPassword1.test(password.value)) {
        return true;
      }
      pw2Error.value = true;
      return t("createAccountpage.pwdWorng");
    };
    const asynPwd3 = (val: string) => {
      pw2Error.value = false;
      if (!val) {
        pw2Error.value = true;
        return t("createAccountpage.pwdMessage");
      }
      if (password2.value == password.value) {
        return true;
      }
      pw2Error.value = true;
      return false;
    };
    const toggleMask = () => {
      choice.value ? (choice.value = false) : (choice.value = true);
    };
    const routerTo = (name: any) => {
      router.push({name})
    }
    const back = () => {
      router.back()
    }
    return {
      back,
      t,
      routerTo,
      pw1Error,
      pw2Error,
      password2,
      password,
      onSubmit,
      choice,
      checked,
      checked1,
      router,
      asynPwd3,
      asynPwd2,
      asynPwd,
      toggleMask,
      loading,

    };
  },
};
</script>
<style lang="scss" scoped>
.back {
  color: #037CD6;
  font-size: 12px;
}
.title {
  font-size: 16px;
    color: #000;
  font-weight: bold;
}
.pwd-tip {
  span {
    color: #037CD6;
  }
}
.btn-box {
  margin-top: 30px;
}
.error {
  :deep(.van-field__body) {
    border: 1px solid #d73a49 !important;
    background: #fbf2f3;
  }
}
.title {
  .iconele {
    width: 16px;
    // height: 60px;
    // margin: 0 auto 10px;
    // padding-top: 50px;
  }
  .tit-big {
    line-height: 30px;
    font-weight: 600;
  }
  .tit-small {
    color: #848484;
    margin-bottom: 49px;
  }
}
.create-new-password {
  .tit-small {
    color: #848484;
  }
  .right {
    color: #037cd6;
    text-decoration: underline;
  }
  .icon-yanjing {
    color: #037dd6;
  }
  :deep(.van-field__label) {
    display: none;
  }
  :deep(.van-field__error-message) {
    margin-bottom: 12px;
  }
  :deep(.van-cell:after) {
    display: none;
  }
  :deep(.van-cell) {
    padding: 0;
  }
  :deep(.van-field__body) {
    margin-bottom: 10px;
    padding: 0 10px;
    transition: ease 0.3s;
    font-size: 12px;
    &:hover {
      border: 1px solid #1989fa;
    }
  }
  .tool {
    color: #037cd6;
  }
  .pointer {
    cursor: pointer;
  }
  .check-box {
    margin-top: 30px;
  }
}
:deep(.icon-box) {
  margin-top: 35px;
}
</style>