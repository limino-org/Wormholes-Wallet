
<template>
  <van-dialog
    v-model:show="show"
    show-cancel-button
    teleport="#page-box"
    :showConfirmButton="false"
    :showCancelButton="false"
    closeOnClickOverlay
  >
    <!-- <van-action-sheet v-model:show="show" class="account-action-sheet" teleport="#page-box"> -->
    <div class="sheet-header">
      {{ t("wallet.account") }}
    </div>
    <div class="account-container">
      <div class="account-list" ref="listDom" id="listDom">
        <div
          v-for="(item, index) in options"
          :key="item.value"
          :class="`bt clickActive ${
                  accountInfo.address.toUpperCase() ==
                  item.address.toUpperCase()
                    ? 'select'
                    : ''
                }`"
          @click="handleSelect(item, index)"
          :data-selected="accountInfo.address.toUpperCase() ==
                  item.address.toUpperCase() ? true : false"
        >
          <div class="flex account-card-s">
            <div class="flex center account-icon">
              <i
                :class="`iconfont f-14 ${
                  accountInfo.address.toUpperCase() ==
                  item.address.toUpperCase()
                    ? 'icon-xuanzhong1'
                    : 'icon-danxuanxuanzhong'
                }`"
              ></i>
            </div>
            <div class="account-icon-s flex center">
              <div class="account-icon-box-s">
                <AccountIcon :data="item.icon" size="mini" />
              </div>
            </div>
            <div :class="`account-info flex center-v`">
              <div :class="`account-info-box  ${accountLoading ? 'half' : ''}`">
                <div class="account-name">{{ item.name }}</div>
                <div class="account-value van-ellipsis">
                  {{ showAmount ? decimal(item.amount) : item.address }}
                  {{ showAmount ? currentNetwork.currencySymbol : "" }}
                </div>
              </div>
            </div>
            <div class="account-import-tag flex center"></div>
            <div class="flex right center-v add-choose-icon">
              <span v-show="item.imported" class="imported">{{
                t("sidebar.imported")
              }}</span>
              <van-loading
                class="ml-14"
                size="22px"
                v-show="
                  accountLoading &&
                  clickAccountIdx != null &&
                  clickAccountIdx == index
                "
                color="#1989fa"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasBtn" class="btn-box">
      <div class="create hover">
        <van-button
          block
          plain
          :loading="createLoading"
          @click="createAccount"
        >
          {{ t("account.createaccount") }}</van-button
        >
      </div>
      <div class="import hoverx">
        <van-button plain block @click="toImport">{{
          t("account.importaccount")
        }}</van-button>
      </div>
    </div>
    <!-- </van-action-sheet> -->
  </van-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  nextTick,
  VNode,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToggleAccount } from "@/components/accountModal/hooks/toggleAccount";
import { Icon, Dialog, Button, Loading, ActionSheet } from "vant";
import AccountIcon from "@/components/accountIcon/index.vue";
import { decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
export default defineComponent({
  name: "accountModal",
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Loading.name]: Loading,
    [ActionSheet.name]: ActionSheet,
    AccountIcon,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    hasBtn: {
      type: Boolean,
      default: true,
    },
    showAmount: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context;
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const { dispatch } = store;
    const { t } = useI18n();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const currentNetwork = computed(() => store.state.account.currentNetwork);
    const showModal: Ref<boolean> = ref(false);
    const {
      options,
      toggleAccount,
      handleAccount,
      createAccount,
      accountLoading,
      clickAccountIdx,
      createLoading,
      listDom,
    } = useToggleAccount();
    const show = ref(false);
    const handleSelect = async (item: any, index: number) => {
      await handleAccount(item, index);
      nextTick(() => {
        show.value = false;
      });
    };
    watch(
      () => props.modelValue,
      (n: boolean) => {
        show.value = n;
        if(n){
          let time = setTimeout(() => {
            handleScroll()
            clearTimeout(time)
          },100)
        }
      }
    );
    watch(
      () => show.value,
      (n) => {
        emit("update:modelValue", n);
      }
    );
    const toImport = () => {
      showModal.value = false;
      const name: any = route.name;
      router.push({
        name: "import",
        query: {
          backUrl: name,
        },
      });
    };
    const del = (idx: number) => {
      dispatch("account/deleteAccount", idx);
    };

    const handleScroll = () => {
      const listDoms = listDom.value
      const newList = Array.from(listDoms.children)
      const ele: any = newList.find((item: any) => item.dataset.selected == 'true')
      const hei = ele.offsetTop - ele.offsetHeight

      console.warn('hei', hei)
      dispatch('common/scrollTop', {
        id:'listDom',
        top: hei
      })
    };

    return {
      t,
      options,
      toggleAccount,
      handleAccount,
      handleSelect,
      createAccount,
      listDom,
      createLoading,
      accountLoading,
      clickAccountIdx,
      currentNetwork,
      toImport,
      showModal,
      decimal,
      accountInfo,
      del,
      show,
    };
  },
});
</script>
<style lang="scss" scoped>
.btn-box {
   button {
    height: 58px;
    border:none;
    background: none;
    border-radius: 0;
    &:nth-of-type(1){
      border-bottom: 1px solid #ECEDEF;
    }
   }
}
.icon-danxuanxuanzhong {
  font-size: 16px !important;
}
.account-icon {
  color: #848285;
  margin-right: 10px;
  i {
    font-size: 20px;
  }
  i.icon-xuanzhong1 {
    color: #037dd6;
  }
}
.imported {
  line-height: 20px;
  background: #ebf9ee;
  border-radius: 10px;
  color: #4bb865;
  padding: 0 6px;
}
.account-groups {
  .createBtn {
    color: rgba(3, 125, 214, 1);
    font-size: 12px;
    line-height: 50px;
    border: none !important;
    border-radius: 0;
  }

  .acc-btn {
    color: rgba(3, 125, 214, 1);
    font-size: 12px;
    line-height: 50px;
  }
}
.account-card-s {
  height: 72px;
  padding: 0 15px;
  transition: ease 0.3s;
  &:hover {
    .account-value,.account-name {
      color: #037dd6;
    }
  }
  .account-icon-s {
    padding: 0 10px 0 0;
    .account-icon-box-s {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #ccc;
      overflow: hidden;
    }
  }
  .account-name {
    line-height: 24px;
    font-size: 15px;
    justify-content: flex-start;
    font-weight: bold;
  }
  .account-value {
    color: rgba(131, 131, 131, 1);
    line-height: 16px;
    font-size: 12px;
  }

  .account-info-box {
    min-width: 160px;
    &.half {
      width: 100px;
    }
  }
  .account-import-tag {
    span {
      display: inline-block;
      width: 55px;
      line-height: 20px;
      border: 1px solid rgba(133, 141, 151, 1);
      text-align: center;
      border-radius: 10px;
      font-size: 10px;
      color: rgba(154, 161, 168, 1);
    }
  }
  .add-choose-icon {
    width: 100%;

  }
}
.account-modal-title {
  line-height: 21px;
  font-size: 15px;
  padding: 14px 0;
}
.account-list {
  max-height: 45vh;
  overflow-y: scroll;
  .bt.select {
    color: #037dd6;
    .account-value {
      color: #037dd6;
    }
  }
}
.create {
  text-align: center;
  font-size: 12px;
  color: #037dd6;
}
.import {
  text-align: center;
  font-size: 12px;
  color: #037dd6;
}
.bt {
  border-bottom: 1px solid #ecedef;
}
.sheet-header {
  height: 60px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  background: #f8fcff;
  font-size: 15px;
  font-weight: bold;
  // border-radius: 20px 20px 0px 0px;
  // div {
  //   width: 45px;
  //   height: 5px;
  //   background-color: #c1c5ca;
  //   border-radius: 3.25px;
  // }
}
</style>