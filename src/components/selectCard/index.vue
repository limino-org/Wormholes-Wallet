<template>
  <div class="select-card flex van-hairline--bottom clickActive" @click.stop="handleClick">
    <div class="net-status flex center" v-if="hasSelect">
      <i :class="`iconfont ${
          select ? 'icon-danxuan' : 'icon-danxuan1'
        }`"></i>
    </div>

    <div class="net-name flex between center-v">
      {{ data.label }}
      <i class="iconfont icon-duihao" v-if="select"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { toRefs, defineComponent, SetupContext, watch, Ref, ref } from 'vue'
import { Icon } from 'vant'
import { getRandomColor } from '@/utils'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'select-card',
  components: {
    [Icon.name]: Icon
  },
  emits: ['handleClick', 'handleModif'],
  props: {
    data: {
      type: Object,
      default: {}
    },
    select: {
      type: Boolean,
      default: false
    },
    // Is there a selection ICON
    hasSelect: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context: SetupContext) {
    const { t } = useI18n()
    const { emit } = context
    const handleClick = () => {
      emit('handleClick', props.data)
    }

    const handleModif = () => {
      emit('handleModif', props.data)
    }
    return {
      t,
      getRandomColor,
      handleClick,
      handleModif
    }
  }
})
</script>
<style lang="scss">
.select-card {
  padding: 0 15px;
  height: 62px;
  transition: ease 0.3s;
  &:hover {
    background: #F8F3F9;
  }
  .net-status {
    width: 20px;
    color: #ccc;
    i {
      color: #9F54BA;
      font-size: 16px;
    }
    i.icon-xuanzhong1 {
      font-size: 18px;
    }
  }
  .net-name {
    line-height: 52px;
    margin-left: 13px;
    width: 100%;
    font-size: 13px;
    i {
      color: rgb(13, 215, 13);
      font-size: 14px;
      padding: 5px;
    }
  }
  .net-icon {
    margin-left: 18px;
    &-box {
      width: 13px;
      height: 13px;
      border-radius: 50%;
    }
  }
}
</style>
