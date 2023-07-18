<template>
  <div :class="`valid-card flex between position relative pl-8 pr-8 pt-10 pb-10 mb-8 ${props.data.selected ? 'selected' : ''}`" @click="handleClick">
    <div class="flex valid-info">
      <div class="flex center ">
        <AccountIcon :data="props.data?.icon" />
      </div>
      <div class="flex center-v text-left valid-addr ml-8 van-ellipsis">
        {{ addressMask(props.data?.Addr) }}
      </div>
      <div class="flex center" v-if="props.data?.isValidator">
        <img class="expresion" src="@/assets/smile.png" v-if="getIconClass == 'smile'" alt="" />
        <img class="expresion" src="@/assets/sad.png" v-if="getIconClass == 'sad'" alt="" />
        <img class="expresion" src="@/assets/neutral.png" alt="" v-if="getIconClass == 'neutral'" />
      </div>
    </div>
    <div class="flex valid-balance green">
      <div class="flex column between">
        <div class="lh-18 text-right">{{ props.data.Balance }} ERB</div>
        <div class="lh-18 text-right">{{props.data.percent}}%</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import AccountIcon from "@/components/accountIcon/index.vue";
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { addressMask } from '@/utils/filters'
const { state } = useStore();
const accountInfo = computed(() => state.account.accountInfo);
const props = defineProps({
  data: {
    type: Object,
    default: {
      selected: false
    }
  }
});

const emits = defineEmits(['handleClick'])
const getIconClass = computed(() => {
      const num = Number(props.data.Coefficient)
      if (num < 40) return "sad";
      if (num >= 40 && num <= 50) return "neutral";
      if (num > 50) return "smile";
})

const handleClick = () => {
  emits('handleClick', {
    addr: props.data.Addr
  })
}

</script>
<style lang="scss" scoped>
$fontColor: #848484;

.valid-card {
  background: #f3f3f3;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #f3f3f3;
  transition: ease .3s;
  height: 54px;
  cursor: pointer;
  &.selected {
    border: 1px solid #9F54BA;
  }
  .valid-info {

  }
  .expresion {
    width: 16px;
    display: block;
    margin-left: 5px;
  }

  .valid-addr {
    color: $fontColor;
    font-size: 12px;

  }

  i {
    color: $fontColor;
  }

  .valid-balance {
    &.green {
      color: #3aae55;
    }

    &.red {
      color: #d73a49;
    }

    &.yellow {
      color: #f7bf03;
    }
  }
}

@media screen and (max-width: 750px){
  .valid-addr {
    max-width: 200px;
    overflow: hidden;
  }
}
</style>
