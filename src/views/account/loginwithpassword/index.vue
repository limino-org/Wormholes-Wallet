<template>
  <div>
    <NavHeader :title="t('wallet.wormHoles')" :hasLeft="false" />
    <div class="title">
                
    <WormTransition size="small">
      <template v-slot:icon>
        <img class="iconele" src="@/assets/token/logowallet.png" />
      </template>
    </WormTransition>
      <!-- <img class="iconele flex center" src="@/assets/token/icon_blue.svg" alt /> -->
      <div class="tit-big text-center f-24">
        {{ t("createAccountpage.welcome") }}
      </div>
      <div class="tit-small text-center f-12 mt-14 mb-30 lh-16">
    
        {{t('loginwithpassword.smallTit')}}
      </div>
    </div>
    <div class="create-new-password">
      <van-form @submit="onSubmit" :ref="form">
        <van-cell-group inset>
          <div class="text-bold f-12 mt-10 mb-10 lh-16 flex between">
            <span>{{ t("createAccountpage.password") }}</span>
            <span>
              <i
                @click="toggleMask"
                :class="`iconfont hover ${
                  switchPassType ? 'icon-yanjing' : 'icon-yanjing1'
                }`"
              ></i>
            </span>
          </div>
          <van-field
            v-model="password"
            validate-trigger="onSubmit"
            name="password"
            :class="`text ${pw1Error ? 'error' : ''}`"
            :type="`${switchPassType ? 'text' : 'password'}`"
            @click-right-icon="switchPassType = !switchPassType"
            :placeholder="$t('createAccountpage.passwordPlaceholder')"
            :rules="[{ validator: asynPwd }]"
          />
        </van-cell-group>

        <div class="btn-box">
          <van-button
            :loading="loading"
            :disable="btnDisabled"
            round
            block
            type="primary"
            native-type="submit"
            >{{ t("createAccountpage.loginIn") }}</van-button
          >
        </div>
      </van-form>
      <div class="text-center f-12">
        <i18n-t tag="div" class="reset-box" keypath="createAccountpage.cantLogin">
          <template v-slot:reset>
        <span class="lh-20 tool hover" @click="reset" :disable="reset_flag">
          {{ t("createAccountpage.resentWallet") }}
        </span>
          </template>
        </i18n-t>

      </div>
    </div>
    <Resetpopup
      v-model="resetmodule"
      @handleConfirm="handleComfirm"
      @cancel="cancel"
    />
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  NavBar,
  Form,
  Field,
  CellGroup,
  Button,
  Sticky,
  Icon,
  Toast,
  Switch,
} from "vant";
import { ethers } from "ethers";
import { Ref, ref, computed } from "vue";
import {
  getCurrentInstance,
  onMounted,
  inject,
  watch,
} from "@vue/runtime-core";
import { useStore } from "vuex";
import { encryptPrivateKey, EncryptPrivateKeyParams } from "@/utils/web3";
import NavHeader from "@/components/navHeader/index.vue";
import { setCookies, getCookies } from "@/utils/jsCookie";
import WormTransition from '@/components/wromTransition/index.vue'

import {
  createWalletByMnemonic,
  createWalletByJson,
  CreateWalletByJsonParams,
  ImportPrivateKey,
  CreateWalletByMnemonicParams,
  createRandomWallet,
} from "@/utils/ether";

import { useI18n } from "vue-i18n";
import { getWallet } from "@/store/modules/account";
import Resetpopup from "@/components/resetpopup/index.vue";
import { useToast } from "@/plugins/toast";
export default {
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Switch.name]: Switch,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    NavHeader,
    Resetpopup,
    WormTransition
  },
  setup() {
    const checkeds = ref(false);
    const { t } = useI18n();
    const switchPassType = ref(false);
    const loading = ref(false);
    const form = ref();
    // return
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const { query } = route;
    const { sig, clearCache, backUrl, loginParams, action } = query;
    const { dispatch, commit, state } = store;
    const onClickLeft = () => {
      router.go(-1);
      console.log("return");
    };
    const pw1Error = ref(false);
    const password: Ref<string> = ref("");
    const { $wtoast } = useToast();
    const asynPwd = async (val: string) => {
      pw1Error.value = false;
      if (!val) {
        pw1Error.value = true;
        return t("createAccountpage.pwdRequired");
      }
      try {
        const accountInfo = store.state.account.accountInfo;
        const { keyStore } = accountInfo;
        const data: CreateWalletByJsonParams = {
          password: password.value,
          json: keyStore,
        };
        await createWalletByJson(data);
      } catch (err) {
        pw1Error.value = true;
        return t("loginwithpassword.wrong_password");
      }
      return true;
    };
    const onSubmit = async (value: object) => {
      pw1Error.value = false;
      loading.value = true;
      const accountInfo = store.state.account.accountInfo;
      const { keyStore } = accountInfo;
      // Unlock the keyStore file of the current account with the password
      const { currentNetwork } = store.state.account;
      const data: CreateWalletByJsonParams = {
        password: password.value,
        json: keyStore,
      };
      try {
        await dispatch("account/createWalletByJson", data);
        setCookies("password", password.value);
        dispatch("account/updateAccount", currentNetwork);
        dispatch("account/updateBalance");

        if (sig) {
          // tosign
          router.replace({ name: "sign", query });
        } else {
          if(backUrl){
            if(action){
              router.replace({ name: "connect-wallet", query });
            } else {
              // @ts-ignore
              router.replace({ name: backUrl.toString(), query: loginParams || {} });
            }
          } else {
            router.replace({ name: "wallet" });
          }
        }
      } catch (err) {
        pw1Error.value = true;
        $wtoast.warn(err)
        return err;
      } finally {
        loading.value = false;
      }
    };
    const resetmodule = ref(clearCache ? true : false);
    const reset_flag = ref(true);
    const reset = () => {
      router.push({
        name: "inputpage",
        query: { toName: "withpassword" },
      });
    };
    const toggleMask = () => {
      switchPassType.value
        ? (switchPassType.value = false)
        : (switchPassType.value = true);
    };
    let cookies = inject("$cookies");
    onMounted(() => {
    });
    const cancel = () => {
      resetmodule.value = false;
    };
    const handleComfirm = () => {};
    const checked = ref(false);
    const checked1 = ref(true);
    const btnDisabled = computed(() => {
      if (checked1.value == true) {
        return false;
      }
      return true;
    });
    watch(
      () => resetmodule.value,
      (n) => {
        if (!n) {
          router.replace({ name: "withpassword" });
        }
      }
    );
    return {
      t,
      checkeds,
      pw1Error,
      form,
      asynPwd,
      reset_flag,
      password,
      router,
      onClickLeft,
      onSubmit,
      resetmodule,
      toggleMask,
      switchPassType,
      handleComfirm,
      reset,
      cancel,
      loading,
      btnDisabled,
    };
  },
};
</script>

<style lang="scss" scoped>
.reset-box {
  color: #828184;
}
.btn-box {
  margin: 50px 28px 30px;
}
:deep(.van-cell-group--inset) {
  margin: 0 28px;
}
.error {
  :deep(.van-field__body) {
    border: 1px solid #d73a49 !important;
    background: #fbf2f3;
  }
}
.title {
  .iconele {
    width: 19px;
  }
  .tit-big {
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 5px;
  }
  .tit-small {
    color: #848484;
    margin-bottom: 40px;
    line-height: 15px;
  }
}

.create-new-password {
  .rember_me {
    // background-color:red;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .rember_me_left {
      margin-left: 20px;
      color: #000;
      font-size: 14px;
    }
    .rember_me_right {
      margin-right: 10px;
    }
  }

  .tit-small {
    color: #bbc0c5;
  }
  .right {
    color: #9F54BA;
    text-decoration: underline;
  }

  .icon-yanjing {
    color: #9F54BA;
  }
  :deep(.van-field__label) {
    display: none;
  }
  :deep(.van-field__error-message) {
    line-height: 14px;
  }
  :deep(.van-cell:after) {
    display: none;
  }
  :deep(.van-cell) {
    padding: 0;
  }
  :deep(.van-field__body) {
    margin-bottom: 7px;
    padding: 0 10px;
    font-size: 12px;
    &:hover {
      border: 1px solid #9F54BA;
    }
  }
}
.tool {
  color: #9F54BA;
}
.underline {
  text-decoration: underline;
}
</style>