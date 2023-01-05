<template>
  <div class="import import-page">
        <NavHeader :title="t('import.importaccount')">
      <template v-slot:left>
       <span class="back hover" @click="appProvide.backHome">{{t('createAccountpage.back')}}</span>
      </template>
    </NavHeader>
    <div class="import introduce">
      <!-- <van-icon class="import close-icon" name="cross" @click="gohome" /> -->
      <!-- <div class="import close-icon" @click="gohome"></div> -->
      <div class="import icon flex center" name="download">
        <!-- <i class="iconfont icon-bottom"></i> -->
        <img src="@/assets/token/importpri.png" style="width:30px;height:30px;"/>
      </div>
      <div class="import account text-center">{{ t("import.importaccount") }}</div>
      <div>
        <div class="content flex center">{{ t("import.announcement") }}</div>
      </div>
    </div>
    <div class="import operate">
      <div class="copykey">{{ t("import.copy") }}</div>
      <van-form @submit="onSubmit">
        <div
          inset
          :class="`text  ${isError ? 'warning' : ''}`"
        >
          <van-field
            v-model="privatekey"
            autosize
            name="siyao"
            type="textarea"
            @input="handleIpt"
            class="content"
            :placeholder="$t('import.forexample')"
          />
        </div>
        <div style="margin: 8px 0">
                <div
            class="warning-text"
            :style="{
              visibility: isError ? 'visible' : 'hidden',
            }"
          >
            <div v-if="errAddress" @click="toCopy" class="hover">{{errAddress}}</div>
            <div>{{ errorMsg }}</div>
          </div>
          <!--  -->
        <div class="btn-groups">
          <div class="container pl-26 pr-26">
            <van-button round block type="primary" :loading="importAction" native-type="submit" >
            {{ t("import.import") }}
          </van-button>
          </div>
        </div>
        </div>
      </van-form>
      <!-- <div class="scanning"></div> -->
    </div>

    <dialog-warning
      v-model:isWarning="isWarning"
      text="Import Succeeded"
      iconName="checked"
      color="#3AAE55"
    >
    </dialog-warning>
  </div>
</template>
<script lang="ts">
import { encryptPrivateKey, EncryptPrivateKeyParams } from "@/utils/web3";
import { ref, SetupContext, Ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBroadCast } from "@/utils/broadCast";
import NavHeader from "@/components/navHeader/index.vue";
import useClipboard from "vue-clipboard3";

import { Icon, Search, Form, Field, CellGroup, Button, Dialog, Toast } from "vant";
import { ethers } from "ethers";
import { hexValue } from "@ethersproject/bytes";
import { useStore } from "vuex";
import { ImportPrivateKey } from "@/utils/ether";
import { setCookies, getCookies } from "@/utils/jsCookie";
import { useI18n } from "vue-i18n";
import { useDialog } from '@/plugins/dialog';
import { useToast } from '@/plugins/toast';
export default {
  name: "import",
  components: {
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    NavHeader
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
    const privatekey: Ref<string> = ref("");
    const router = useRouter();
    const route = useRoute();
    const { commit, dispatch } = useStore();
    const { handleUpdate } = useBroadCast();
    const {$wdialog} = useDialog()
    const {$wtoast} = useToast()
    const importAction = ref(false);
    const errorMsg = ref("");
    const isWarning = ref(false);
    const isError = ref(false)
    const appProvide = inject('appProvide')
    const errAddress = ref('')
    // back
    const gohome = () => {
      const { backUrl }: any = route.query;
      router.replace({
        name: backUrl || "wallet",
      });
    };

    // Import Account
    const onSubmit = (values: string) => {
      errAddress.value = ''
      isError.value = false
      importAction.value = true
      console.log('submit', values)
      console.log('privatekey.value', privatekey.value, privatekey.value.length)
      // Verify that the private key is valid
      dispatch('account/importPrivateKey', privatekey.value.trim())
        .then(async(wallet) => {
          const { privateKey, mnemonic, address } = wallet
          const password = getCookies('password') || ''
          if (!password) {
            isError.value = true
            router.replace({ name: 'loginAccount-step1' })
            return false
          }
          const params: EncryptPrivateKeyParams = {
            privateKey,
            password
          }
          const keyStore = encryptPrivateKey(params)
          await dispatch('account/addAccount', {
            mnemonic: { path: null, pathIndex: -1 },
            keyStore,
            address,
            imported: true
          })
          commit('account/UPDATE_KEYSTORE', keyStore)
          $wtoast.success(t('importsuccess.success'))
          handleUpdate()
          router.push({name:"wallet"})
        })
        .catch(({ reason, address }) => {
          isError.value = true
          // Login failed status
          importAction.value = false
          privatekey.value = ''
          console.log('$wdialog',$wdialog)
          errorMsg.value = reason || t('importerror.cannotenter')
          errAddress.value = address || ''
          // $wtoast.warn(t(errorMsg.value))
        })
    }
    const handleIpt = (v: any) => {
      isError.value = false
    }
    const { toClipboard } = useClipboard();

    const toCopy = async () => {
      try {
        await toClipboard(`${errAddress.value}`);
        $wtoast.success(t("common.copyAddr"));
      } catch (e) {
        console.error(e);
      }
    };
    return {
      toCopy,
      t,
      errorMsg,
      privatekey,
      gohome,
      importAction,
      onSubmit,
      isWarning,
      appProvide,
      errAddress,
      isError,
      handleIpt
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(){
  .van-field__control {
    line-height: 16px;
  }
  .van-field__body {
    border: none;
    padding: 0;
  }
}
.introduce {
  width: 100%;
  min-height: 150px;
  background-color: #F4FAFF;
  .close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    display: inline-block;
    width: 14px;
    height: 14px;
    font-size: 18px;
    // background-color: #fff;
  }
  .icon {
    height: 55px;
    padding-top: 25px;
    i {
      font-size: 40px;
    }
  }
  .account {
    font-size: 15px;
    font-weight: bold;
    line-height: 18px;
    margin: 15px 0;
  }
  .content {
    margin-bottom: 14px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    word-wrap: break-word;
    color: #808489;
  }
}
.operate {
  height: 335px;
  padding: 0 15px;
  .copykey {
    margin-top: 20px;
    font-size: 12px;
    line-height: 15px;
    color: #000;
    font-weight: bold;
  }
  .text {
    margin: 13px auto 0;
    background: #fff;
    border: 1px solid #B3B3B3;
    padding: 15px;
    border-radius: 5px;

    &.warning {
      border-color: #D73A49;
      background: #FBF2F3;
      .content {
      background: #FBF2F3;

      }
    }
    .content {
      padding:0;
      font-size: 14px;
    }
  }
  .warning-text {
    margin-bottom: 10px;
    color: #f00;
    font-size: 12px;
  }
  .scanning {
    width: 77px;
    height: 17px;
    margin: 0 auto;
    font-size: 12px;
  }
  .button {
    width: 325px;
    height: 45px;
    margin: 20px 25px;
    background: #037cd6;
    border-radius: 24px;
  }
}
.van-dialog {
  top: 415px !important;
  width: 235px;
  height: 125px;
  .van-dialog__header {
    margin-top: -5px;
    margin-bottom: 5px;
    font-size: 15px !important;
    line-height: 15px;
  }
  .van-dialog__message {
    padding: 0 !important;
    font-size: 11px !important;
  }
}
::v-deep {
  .custom-popup {
    width: 200px;
    .van-icon {
      &.van-icon-success {
        color: #3aac57;
      }
      &.van-icon-warning {
        color: #f9be03;
      }
    }
  }
}
</style>
