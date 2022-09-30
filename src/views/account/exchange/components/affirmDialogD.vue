<template>
  <van-overlay :show="dislogShow" :z-index="2" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>{{$t('closeexchange.minerspledge')}}</span>
      </div>
      <div class="flex center miners-icons">
        <van-icon size="41" color="#037CD6" name="warning" />
      </div>
      <div class="flex center column">
        <span class="text-s">{{$t('closeexchange.unfortunately')}}</span>
        <div class="confirmation">
          {{$t('closeexchange.confirmationof')}}
          <span>{{$t('closeexchange.termsAndConditions')}}</span>
        </div>
      </div>
      <div class="container-btn flex center">
        <van-button type="primary" class="btn" round @click="clickLeft">{{$t('closeexchange.gohome')}}</van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Field, Icon } from 'vant'
import { ref, SetupContext, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AffirmDialogD',
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    [Icon.name]: Icon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()
    const { emit } = context
    const router = useRouter()
    let dislogShow = computed({
      get: () => props.show,
      set: v => emit('update:show', v)
    })
    const clickLeft = () => {
      router.back()
    }
    return {
      t,
      dislogShow,
      clickLeft
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 427px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    .confirmation {
      font-size: 12px;
      color: #8f8f8f;
    }
    .miners-icons {
      margin: 40px 0;
    }
    .text-s {
      margin: 0 42px 41px 42px;
      font-size: 14px;
      color: #0f0f0f;
    }
    .exchange-welcome-icon {
      width: 41px;
      height: 41px;
      margin: 20px 0 16px 0;
    }
    .miners-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-weight: bold;
      background: #f8fcff;
      font-size: 14px;
      color: #0f0f0f;
    }
    .miners-container {
      .contaienr-top-header {
        margin: 28px 0 21px 0;
        span {
          &:first-child {
            display: inline-block;
            width: 35px;
            height: 35px;
            line-height: 35px;
            margin-bottom: 12px;
            text-align: center;
            border-radius: 5px 5px 5px 5px;
            opacity: 1;
            color: #0287db;
            border: 3px solid #0287db;
          }
          &:last-child {
            font-weight: bold;
            font-size: 14px;
            color: #0f0f0f;
          }
        }
      }
      .contaienr-top-ipt {
        width: 315px;
        height: 115px;
        margin: auto;
        padding: 11px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
      }
      .conditions {
        margin: 20px 0 0px 0;
      }
      .text-a {
        height: 17px;
        line-height: 14px;
        font-size: 12px;
        color: #8f8f8f;
      }
      .m-r-5 {
        margin-right: 5px;
      }
      .text-b {
        text-decoration: underline;
        font-size: 12px;
        color: #0287db;
      }
      .block {
        display: inline-block;
        padding-bottom: 12px;
        margin-bottom: 11px;
        border-bottom: 1px solid #ecedef;
      }
    }
  }
}
.container-btn {
  margin-top: 11px;
  .btn {
    width: 104px;
    height: 45px;
    margin-top: 21px;
  }
  span {
    font-size: 12px;
    &:first-child {
      margin: 0 5px 0 10px;
      color: #8f8f8f;
    }
    &:last-child {
      color: #0287db;
    }
  }
  .btn-text {
    margin: 15px 0 10px 0;
    font-size: 12px;
    color: #8f8f8f;
  }
  .underline {
    text-decoration: underline;
  }
}
</style>