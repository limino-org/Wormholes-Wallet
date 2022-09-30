<template>
  <div class="wormholes-tip flex pl-16 pr-16 pt-12 pb-12">
    <div class="flex center icon">
      <van-icon name="warning" />
    </div>
    <div class="lh-16 msg">{{message}}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Icon } from "vant";
export default defineComponent({
  components: {
    [Icon.name]: Icon,
  },
  props: {
    message: {
      type: String,
      default: "Message",
    },
  },
  setup() {},
});
</script>
<style lang="scss" scoped>
.wormholes-tip {
    margin: 15px;
    background: #F4FAFF;
    border-radius: 5px;
}
.icon i{
    font-size: 18px;
    color: #037CD6;
}
.msg {
    padding-left: 9px;
}
</style>
