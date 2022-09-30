<template>
  <transition name="fade">
  <div class="wormholes-mask flex center" v-show="isShow">
    <div class="wormholes-toast pl-14 pr-14 pt-26 pb-26 f-12 lh-16">
        <div :class="`icon flex center mt-12  ${type}`" v-if="type">
            <i v-show="type == 'success'" class="iconfont icon-duihao2"></i>
            <i  v-show="type == 'warn'"  class="iconfont icon-gantanhao"></i>
            <i  v-show="type == 'fail'" class="iconfont icon-gantanhao"></i>
        </div>
        <div class="msg text-center f-12">{{ message }}</div>
    </div>
  </div>
  </transition>
</template>
<script lang="ts" setup>
import route from "@/views/transferAccounts/route";
import { ref, onMounted, watch } from "vue";

 enum ToastType {
  success = "success",
  warn = "warn",
  fail = "fail",
  none = "",
}
interface ToastOpt {
  type?: ToastType;
  message: string;
  duration?: number;
}

const message = ref("");
const type = ref(ToastType.none);
const isShow = ref(false);
const duration = ref(3000);
let time: any = null
const open = (_opt: ToastOpt) => {
  if(isShow.value){
    return
  }
  const defaultOpt: ToastOpt = {
    duration: duration.value,
    type: ToastType.none,
    ..._opt,
  };
  const { message: msg, type: newType, duration: dur } = defaultOpt;
  message.value = msg;
  type.value = newType;
  duration.value = dur;
  show();
  if (dur > 0) {
    time = setTimeout(() => {
      hide();
      clearTimeout(time);
    }, dur);
  }
};

const show = () => {
  isShow.value = true;
};
const hide = () => {
  if(time){
    clearTimeout(time)
  }
  isShow.value = false;
  let t = setTimeout(() => {
  duration.value = 3000
  clearTimeout(t)
  },300)
};

const success = (message: string) => {
  open({
    message,
    type: ToastType.success,
  });
};
const warn = (message: string) => {
  open({
    message,
    type: ToastType.warn,
  });
};
const fail = (message: string) => {
  open({
    message,
    type: ToastType.fail,
  });
};



//export fun
defineExpose({
  isShow,
  show,
  hide,
  open,
  success,
  warn,
  fail,
});
</script>
<style lang="scss" scoped>
.wormholes-mask {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 3001;
  transform: translate3d(-50%,-50%,0);
}
.wormholes-toast {
  max-width: 200px;
  min-width: 150px;
  background: rgba($color: #000000, $alpha: 0.8);
  color: #fff;
  border-radius: 10px;
  .msg {
    word-wrap:break-word;
  }
}
.icon {
    height: 40px;
    margin-bottom: 9px;
        &.success i{
        color: #3AAE55;
    }
    &.warn i{
        color: #F6BE27;
    }
    &.fail i{
        color: #D73A49;
    }
     i {
    font-size: 40px;


}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>