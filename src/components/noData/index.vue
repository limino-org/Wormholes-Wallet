<template>
  <div class="flex center no-list pt-30">
    <i class="iconfont icon-empty"></i>
  </div>
  <div class="flex center msg f-12 mt-10">
      {{text}}
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "no-data",
  props:{
      text: {
          type: String,
          default:''
      }
  },
  setup() {
      const { t} = useI18n()
      return {
          t
      }
  },
});
</script>
<style lang="scss" scoped>
.no-list {
  i {
    font-size: 40px;
    color: #037CD6;
  }

}
  .msg {
      color: #BBBBBB;
  }
</style>
