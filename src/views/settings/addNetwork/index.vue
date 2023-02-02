<template>
  <NavHeader :title="t('setting.networks')">
    <template v-slot:left>
      <span class="back" @click="appProvide.back">{{ t("common.back") }}</span>
    </template>
  </NavHeader>
  <div class="addNetwork">
    <div class="tip-tit pt-20">
      {{ isModif ? t("addNetwork.rpcNet") : t("addNetwork.newnetwork") }}
    </div>
    <div class="w-tips flex between pt-6 pb-10 mb-6">
      <div class="text lh-16 f-12">{{ t("addNetwork.introduce") }}</div>
    </div>

    <div>
      <van-form ref="form">
        <div class="label text-bold">
          <span>*</span>{{ t("addNetwork.networkname") }}
        </div>
        <van-field
          v-model="label"
          maxlength="12"
          :disabled="isMain ? true : false"
          :class="nameError ? 'error' : ''"
          :placeholder="$t('addNetwork.networknameoptional')"
          :rules="[
            {
              // required: true,
              // message: t('addNetwork.inputnetworknameoptional'),
              validator: asyncName,
            },
          ]"
        />
        <div class="label text-bold">
          <span>*</span>{{ t("addNetwork.rpcurl") }}
        </div>
        <van-field
          :class="urlError ? 'error' : ''"
          v-model="URL"
          :placeholder="$t('addNetwork.newRpcPlaceholder')"
          maxlength="200"
          :disabled="isMain ? true : false"
          validate-trigger="onChange"
          @blur="getChainId"
          :rules="[
            // { required: true, message: t('addNetwork.inputrpcurl') },
            { validator: asyncurl },
          ]"
        />
        <div class="label text-bold">
          <span>*</span>{{ t("addNetwork.chain") }}
        </div>
        <van-field
          v-model="chainId"
          type="number"
          maxlength="30"
          validate-trigger="onChange"
          :disabled="isMain ? true : false"
          :class="chainError ? 'error' : ''"
          :placeholder="$t('addNetwork.chain')"
          :rules="[
            // {
            //   required: true,
            //   message: t('addNetwork.Invalidchain'),
            //   //  message: t('addNetwork.inputchain')
            // },
            { validator: asyncid },
          ]"
        />
        <div class="error err-msg" v-if="hasChainId">
          {{ t("addNetwork.existedchain") }}
        </div>
        <div class="label text-bold">{{ t("addNetwork.symbol") }}</div>
        <van-field
          v-model="currencySymbol"
          :disabled="isMain ? true : false"
          :placeholder="$t('addNetwork.symboloptional')"
          maxlength="20"
          :rules="[{ required: false, message: t('addNetwork.inputsymbol') }]"
        />
        <div class="label text-bold">{{ t("addNetwork.blockexplorer") }}</div>
        <van-field
          v-model="browser"
          maxlength="50"
          :disabled="isMain ? true : false"
          :placeholder="$t('addNetwork.blockexploreroptional')"
          :rules="[{ required: false }]"
        />
        <div class="btn-groups isModif" v-if="!isMain">
          <div class="container pl-20 pr-20 flex between">
            <van-button
              v-if="isModif"
              block
              class="mr-10"
              type="danger"
              plain
              @click="handleDelNet"
              >{{ t("addNetwork.delete") }}</van-button
            >
            <van-button
              block
              type="primary"
              :loading="loading"
              @click="onSubmit"
            >
              {{ isModif ? t("addNetwork.submit") : t("addNetwork.add") }}
            </van-button>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { computed, inject, toRaw } from "vue";
import { Icon, Toast, Button, Sticky, Field, Dialog, Form } from "vant";
import { useRoute, useRouter } from "vue-router";
import { defineComponent, Ref, ref, watch, SetupContext } from "vue";
import { useStore } from "vuex";
import { NetWorkData, chessIcons } from "@/enum/network";
import { RegUrl, RegNum1 } from "@/enum/regexp";
import { getRandomColor } from "@/utils/index";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { guid } from "@/utils/index";
import NavHeader from "@/components/navHeader/index.vue";
import { ethers, utils } from "ethers";
import { useBroadCast } from "@/utils/broadCast";
import { useToast } from "@/plugins/toast";
import { getWallet } from "@/store/modules/account";
import { validate } from "@babel/types";

export default {
  name: "addNetwork",
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [Icon.name]: Icon,
    NavHeader,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const form = ref();
    const { query } = useRoute();
    const appProvide = inject("appProvide");
    const data = typeof query.data == "string" ? JSON.parse(query.data) : {};
    const {
      URL: qurl,
      label: qlabel,
      chainId: qid,
      browser: qbrowser,
      currencySymbol: qsymbol,
      id,
      icon: qicon,
    }: any = data;
    const { state, commit, dispatch } = store;
    const label: Ref<string> = ref(qlabel);
    const URL: Ref<string> = ref(qurl || query.URL || "");
    const chainId: Ref<number> = ref(qid);
    const ID: Ref<string> = ref("");
    const currencySymbol: Ref<string> = ref(qsymbol);
    const browser: Ref<string> = ref(qbrowser);
    // Listen to the broadcast of the same source window
    const { handleUpdate } = useBroadCast();

    // Edit operation
    const isModif = computed(() => {
      return qid ? true : false;
    });
    const urlError = ref(false);
    const asyncurl = async (val: string) => {
      urlError.value = false;
      const workList = toRaw(state.account.netWorkList);
      const data = workList.find((item: any) => item.URL == val);
      if (RegUrl.test(val)) {
        if (!data) {
          try {
            let provider = ethers.getDefaultProvider(URL.value);
            const { chainId } = await provider.getNetwork();
            console.log(chainId);
            ID.value = chainId;
            return true;
          } catch (err) {
            console.error(err);
            urlError.value = true;
            return t("addNetwork.Invalidrpcurl");
          }
        } else {
          // If the duplicate Chain ID is not verified during editing
          if (isModif.value) {
            return true;
          }
          urlError.value = true;
          // return `The RPC URL already exists in ${data.label};
          return t(`addNetwork.existedrpcurl`, { label: data.label });
        }
      } else {
        urlError.value = true;
        return t("addNetwork.Invalidrpcurl");
      }
    };
    const chainError = ref(false);
    const asyncid = async (val: number) => {
      chainError.value = false;
      try {
        const workList = toRaw(state.account.netWorkList);
        const data = workList.find((item: any) => item.chainId == val);
        let provider = ethers.getDefaultProvider(URL.value);
        const { chainId: newchainId } = await provider.getNetwork();
        if (RegNum1.test(String(val))) {
          if (newchainId != chainId.value) {
            chainError.value = true;
            return t("addNetwork.chainIdDiff", { chainId: newchainId });
          }
          if (!data) {
            return true;
          } else {
            // If the duplicate Chain ID is not verified during editing
            if (isModif.value) {
              return true;
            }
            return true;
          }
        } else {
          chainError.value = true;
          return t("addNetwork.Invalidchain");
        }
      } catch (err) {
        chainError.value = true;
        return t("addNetwork.Invalidchain");
      }
    };

    const hasChainId = computed(() => {
      // t("addNetwork.existedchain")
      const workList = toRaw(state.account.netWorkList);
      const data = workList.find((item: any) => item.chainId == chainId.value);

      if (!isModif.value) {
        if (data) {
          return true;
        }
      }
      return false;
    });
    const netWorkList = computed(() => state.account.netWorkList);
    const { $wtoast } = useToast();
    const loading: Ref<boolean> = ref(false);

    const onSubmit = async () => {
      loading.value = true;
      try {
        await form.value.validate();
        let time = setTimeout(() => {
          saveData();
          clearTimeout(time);
        }, 300);
      } catch (err) {
        loading.value = false;
      }
    };
    const nameError = ref(false);
    const asyncName = (v: string) => {
      nameError.value = false;
      if (!v) {
        nameError.value = true;
        return t("addNetwork.inputnetworknameoptional");
      }
    };
    const saveData = () => {
      // Verify whether the URL Chain ID is duplicate
      const len = netWorkList.value.length;
      const icon = len >= 6 ? chessIcons[5] : chessIcons[len];

      const netWork: NetWorkData = {
        label: label.value,
        select: false,
        color: getRandomColor(),
        URL: URL.value,
        browser: browser.value,
        currencySymbol: currencySymbol.value,
        transactionList: {},
        chainId: Number(chainId.value),
        tokens: {},
        id: id || guid(),
        icon: qicon && qicon != undefined ? qicon : icon,
      };
      console.log("netWork", netWork, qicon);
      !isModif.value ? (netWork.isMain = false) : "";
      store.commit(
        isModif.value ? "account/MODIF_NETWORK" : "account/PUSH_NETWORK",
        netWork
      );
      dispatch("account/getProviderWallet");
      handleUpdate();
      loading.value = false;
      $wtoast.success(
        isModif.value
          ? t("addNetwork.modifythenetworksuccessfully")
          : t("addNetwork.addednetworksuccessfully")
      );
      router.back();
    };

    // Delete network
    const handleDelNet = () => {
      Dialog.confirm({
        title: t("addNetwork.hint"),
        message: t("addNetwork.confirmdeletion", { qlabel: qlabel }),
      }).then(() => {
        // on confirm
        store.commit("account/DETETE_NETWORK", id);
        dispatch("account/getProviderWallet");
        $wtoast.success(
          t("addNetwork.deletingnetworksucceeded", { qlabel: qlabel })
        );
        router.back();
        return true;
      });
    };

    const getChainId = async () => {
      try {
        const url = URL.value;
        const provider = ethers.getDefaultProvider(url);
        const network = await provider.getNetwork();
        debugger;
        urlError.value = false;
        chainId.value = network.chainId;
      } catch (err: any) {
        urlError.value = true;
        console.warn(err.toString());
      }
    };

    const isMain = computed(() => (data ? data.isMain : false));
    watch(
      () => isMain.value,
      async () => {
        const provider = ethers.getDefaultProvider(URL.value);
        const net = await provider.getNetwork();
        chainId.value = net.chainId;
        store.commit("account/UPDATE_WORMHOLES_CHAINID", net.chainId);
      },
      {
        immediate: true,
      }
    );
    return {
      t,
      onSubmit,
      label,
      form,
      URL,
      chainId,
      ID,
      currencySymbol,
      browser,
      loading,
      RegUrl,
      asyncurl,
      urlError,
      chainError,
      asyncName,
      nameError,
      asyncid,
      isModif,
      handleDelNet,
      getChainId,
      appProvide,
      hasChainId,
      isMain,
    };
  },
};
</script>
<style lang="scss" scoped>
.addNetwork {
  padding: 0 13px 25px;
  .error {
    :deep(.van-field__body) {
      border-color: #d73a49;
      background: #fbf2f3;
    }
  }
  .tip-tit {
    font-size: 15px;
    font-weight: bold;
  }

  .w-tips {
    margin-bottom: 14px;
  }
  .err-msg {
    color: #adb8c5;
    transform: translateY(-10px);
    font-size: 12px;
  }
  .w-tips {
    // background: #f4faff;
    border-radius: 7px;
    // margin: 15px 0;
    .icon {
      width: 28px;
      color: #037cd6;
      font-size: 18px;
    }
    .text {
      line-height: 16px;
      color: #848484;
    }
  }

  .label {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 6px;
    span {
      color: #e0707d;
    }
  }

  .btn-groups {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 25px;
    &.isModif {
    }
  }
  :deep(.van-field__label) {
    display: none;
  }
  :deep(.van-field__error-message) {
    margin-bottom: 12px;
    line-height: 12px;
    margin-top: -10px;
  }
  :deep(.van-cell:after) {
    display: none;
  }
  :deep(.van-cell) {
    padding: 0;
  }
  :deep(.van-field__body) {
    margin-bottom: 20px;
    &:hover {
      border: 1px solid #1989fa;
    }
  }
}
</style>