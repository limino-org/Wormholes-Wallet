<template>
  <transition name="toast">
    <div class="wormholes-mask flex center" v-if="isShow">
      <div
        class="wormholes-toast pl-14 pr-14 pt-26 pb-26 f-12 lh-16 toast-container"
      >
        <div :class="`icon flex center mt-12  ${type}`" v-if="type">
          <i v-show="type == 'success'" class="iconfont icon-duihao2"></i>
          <i v-show="type == 'warn'" class="iconfont icon-gantanhao"></i>
          <i v-show="type == 'fail'" class="iconfont icon-gantanhao"></i>
        </div>
        <div class="msg text-center f-12">{{ message }}</div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
console.warn("route---", route);
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
let time: any = null;
const open = (_opt: ToastOpt) => {
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
  if (isShow.value) {
    clearTimeout(time)
  }
  isShow.value = true;
};
const hide = () => {
  if (time) {
    clearTimeout(time);
  }
  isShow.value = false;
  let t = setTimeout(() => {
    duration.value = 3000;
    clearTimeout(t);
  }, 300);
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
  transform: translate3d(-50%, -50%, 0);
}
.wormholes-toast {
  max-width: 200px;
  min-width: 150px;
  background: rgba($color: #000000, $alpha: 0.8);
  color: #fff;
  border-radius: 10px;
  .msg {
    word-wrap: break-word;
  }
}
.icon {
  height: 40px;
  margin-bottom: 9px;
  &.success i {
    color: #3aae55;
  }
  &.warn i {
    color: #f6be27;
  }
  &.fail i {
    color: #d73a49;
  }
  i {
    font-size: 40px;
  }
}

</style>