<template>
  <div class="account-icon-component">
    <div v-for="(item, idx) in data.list" :key="idx">
      <div
        v-for="(child, index) in item"
        :key="index"
        :data="child"
        :class="size"
        :style="{ background: data.color }"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: {},
    },
    // SMALL LARGE
    size: {
        type: String,
        default: 'small'
    }
  },
});
</script>
<style lang="scss" scoped>
.account-icon-component {
  transition: ease .3s;
  border-radius: 50%;
    overflow: hidden;
  &:hover {
    transform: scale(1.2);
  }
  & > div > div {
    float: left;
    background: #eee;
  }
  & > div > div.small {
    height: 6px;
    width: 6px;
  }
    & > div > div.large {
    height: 10px;
    width: 10px;
  }
      & > div > div.mini {
    height: 6px;
    width: 6px;
  }
 & > div > div[data="0"] {
    background: #eee !important;
}
  & > div > div:nth-child(5n + 1) {
    clear: both;
  }
  &:after {
    content: "";
    clear: both;
    display: block;
  }
}
</style>