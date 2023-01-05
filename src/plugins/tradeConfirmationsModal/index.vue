<template>
  <transition name="fade">
    <div class="trade-dialog-mask flex center" v-if="isShow">
      <div class="wormholes-dialog">
        <div class="text-center tit van-hairline--bottom">
          {{i18n.global.t('transactiondetails.tradeTit')}}
        </div>
        <div>
          <div class="info-box">
            <div class="icon">
              <div class="flex">
                <Loading
                  color="#1989fa"
                  v-show="defaultData.status == 'pendding'"
                />
                <i
                  v-show="defaultData.status != 'pendding'"
                  class="iconfont icon-duihao2 success"
                ></i>
                <span class="lh-30 ml-10 approve">{{
                  i18n.global.t("bootstrapwindow.approve")
                }}</span>
              </div>
            </div>
            <div class="approve-msg pl-30 ml-8 mb-10">
              {{ defaultData.approveMessage }}
            </div>
          </div>
          <div :class="`info-box ${defaultData.status == 'fail' ? 'fail' : ''}`">
            <div class="icon">
              <div class="flex">
                <div class="flex center">
                  <Loading
                    color="#1989fa"
                    v-show="defaultData.status == 'approve'"
                  />
                  <i
                    v-show="defaultData.status == 'pendding'"
                    class="iconfont icon-duihao2"
                  ></i>
                  <i
                    v-show="defaultData.status == 'success'"
                    class="iconfont icon-duihao2 success"
                  ></i>
                  <Icon v-show="defaultData.status == 'fail' " name="clear" :class="defaultData.status" />
                  <Icon name="warning" v-show="defaultData.status == 'warn' " :class="defaultData.status"/>
                </div>
                <span
                  class="lh-30 ml-10 approve"
                  v-show="
                    defaultData.status == 'pendding' ||
                    defaultData.status == 'approve' || defaultData.status == 'warn'
                  "
                  >{{ defaultData.wattingTitle }}</span
                >
                <span
                  class="lh-30 ml-10 approve"
                  v-show="
                    defaultData.status == 'success' ||
                    defaultData.status == 'fail'
                  "
                >
                  {{
                    defaultData.status == "success"
                      ? i18n.global.t("transactiondetails.success")
                      : i18n.global.t("transactiondetails.fail")
                  }}
                </span>
              </div>
            </div>
            <div
              class="approve-msg pl-30 ml-8 mb-10"
              v-show="
                defaultData.status == 'pendding' ||
                defaultData.status == 'approve' 
              "
            >
            <span v-if="defaultData.wattingMessageType === 'string'">{{ defaultData.wattingMessage }}</span>
            <span v-else v-html="defaultData.wattingMessage"></span>
            </div>
            <div
              class="approve-msg pl-30 ml-8 mb-10"
              v-show="
                defaultData.status == 'success' || defaultData.status == 'fail' || defaultData.status == 'warn'
              "
            >
            <div v-if="defaultData.status == 'success'">
              <span v-if="defaultData.successMessageType === 'string'">{{ defaultData.successMessage }}</span>
             <span v-else v-html="defaultData.successMessage"></span>
            </div>
            <div v-if="defaultData.status == 'fail'">
              <span v-if="defaultData.failMessageType === 'string'">{{ defaultData.failMessage }}</span>
             <span v-else v-html="defaultData.failMessage"></span>
            </div>
              <!-- {{
                defaultData.status == "success"
                  ? defaultData.successMessage
                  : defaultData.failMessage
              }} -->
            </div>
          </div>
          <div :class="`flex ${defaultData.hash ? 'between' : 'center'} mt-26 btn-done-box`">
            <Button
              @click="callBack"
              :disabled="disabled"
              class="okbtn"
              type="primary"
              >{{ i18n.global.t("returnreceipt.done") }}</Button
            >
            <Button v-if="defaultData.hash"  class="okbtn" type="primary" @click="viewTransactionByHash(defaultData.hash)">History</Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>

export type TradeOptions = {
  approveMessage?: string
  successMessage?: string
  wattingMessage?: string
  wattingTitle?: string
  failMessage?: string
  status: string
  callBack?: Function
  failBack?: Function
  disabled: Array<string>
  wattingMessageType: string
  failMessageType: string
  successMessageType: string
  receipt?: null | Object
  hash?: null | string
};



import { computed, Ref, ref } from "vue";
import { Button, Icon, Loading } from "vant";
import i18n from "@/language";
import { TradeConfirmOpt, TradeStatus } from "./tradeConfirm";
import { viewTransactionByHash } from "@/utils/utils";
console.warn("i18n-------", i18n);


enum messageType {
  string = 'string',
  html = 'html'
};
const getDefaultOpt = () => {
  return ref({
    approveMessage: i18n.global.t('send.approveMessage'),
    successMessage:  i18n.global.t('send.successMessage'),
    wattingMessage:  i18n.global.t('send.wattingMessage'),
    failMessage: i18n.global.t('send.failMessage'),
    wattingTitle: i18n.global.t('bootstrapwindow.watting'),
    status: "pendding",
    wattingMessageType: 'string',
    failMessageType:"string",
    successMessageType: 'string',
    hash: null,
    callBack: () => {},
    failBack: () => {},
    // The button is disabled in this state
    disabled: [TradeStatus.pendding, TradeStatus.approve]
  });
};
const defaultData: Ref<TradeOptions> = getDefaultOpt();

const disabled = computed(() => {
  if (defaultData.value.disabled.includes(defaultData.value.status)) {
    return true;
  }
  return false;
});
const isShow = ref(false);
const show = (opt: TradeConfirmOpt) => {
  defaultData.value = { ...defaultData.value, ...opt };
  !isShow.value ? (isShow.value = true) : "";
};
const callBack = () => {
  hide()
  const { callBack: done, failBack } = defaultData.value
  if(defaultData.value.status == 'success') {
    done && typeof done == 'function' ? done() :''
  }
  if(defaultData.value.status == 'fail') {
    failBack && typeof failBack == 'function' ? failBack() :''
  }
}
const hide = () => {
  isShow.value = false;
};

const open = (_opt: TradeConfirmOpt = {status: TradeStatus.pendding}) => {
  const defaultOpt = {
    ...getDefaultOpt().value,
    ..._opt,
  };

  show(defaultOpt);
};
const update = (_opt: TradeConfirmOpt= {status: TradeStatus.approve}) => {
  const defaultOpt: TradeConfirmOpt = {
    ..._opt,
  };
  show(defaultOpt);
};


defineExpose({
  isShow,
  show,
  hide,
  open,
  update,
  callBack
});
</script>
<style lang="scss" scoped>
.btn-done-box {
  padding: 0 50px;
}
.success {
  color: #3aae55 !important;
}
.fail {
  color: #d73a49 !important;
}
.warn {
  color: #f7bf03 !important;
}
.trade-dialog-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 5002;
  background: rgba($color: #000000, $alpha: 0.5);
  .okbtn {
    min-width: 100px;
  }
  .wormholes-dialog {
    overflow: hidden;
    .tit {
      line-height: 62px;
      background: #f8fcff;
      font-size: 15px;
      font-weight: 600;
    }
    width: 340px;
    min-height: 230px;
    max-height: 500px;
    background: #fff;
    border-radius: 7px;
    padding-bottom: 25px;
    .approve-msg {
      font-size: 12px;
    }
    .info-box {
      padding: 22px 15px 0;
      &.fail {
        .approve,.approve-msg {
          color:#d73a49;
        }
      }
      &.warn {
        .approve,.approve-msg {
          color:#f7bf03;
        }
      }
      .icon i {
        font-size: 26px;
        color: #9a9a9a;
      }
      .icon .van-icon-clear,.icon .van-icon-warning {
        font-size: 29px;
      }
    }
    .approve {
      font-size: 15px;
      font-weight: bold;
    }
    .approve-msg {
      line-height: 18px;
      color: #848484;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>