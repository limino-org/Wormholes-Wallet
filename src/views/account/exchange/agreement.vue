<template>
  <van-overlay :show="dislogShow" :z-index="999999" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <van-icon name="arrow-left" @click="submitClick('cancel')" />
        <span>{{$t('createExchange.open_exchange')}}</span>
      </div>
      <div class="miners-container">
        <div class="miners-container-text">
          <div class="text-a">{{$t('createExchange.termsofservice')}}</div>
          <div class="text-b">Last Updated:20/02/2022</div>
          <div>
            The Platform and the Services are subiect tothese
            terms of service("Terms"). By using the Platform or
            the Services you agree that you have read, unders-
            tood and agree to these Terms which shall form a
            legal agreement between you and Enjin These Ter-
            ms may be revised from time totime in accordance
            with Clause 9.2.If you do notagree with any of the
            foregoingyou must immediately cease access and
            use of theServices.
          </div>
          <div class="text-c">1. Defnitions and Interpretation</div>
          <div class="text-b">1.1 In these Terms,unless the contextotherwise requires, the following definitions shall apply:</div>
          <div>
            "Applicable Laws" means all applicable statutes
            enactments，acts of the state legislature or pa-
            rliament, laws,ordinances，rules，bye- laws,reg-
            ulationsnotifcationsguidelinesdirections directives
            and orders of any governmental authority statut-
            ory authority,tribunal boardcourt or recognised
            stock exchange as may beapplicable international
            treaties and regulations.
          </div>
        </div>
        <div class="miners-container-select flex">
          <van-checkbox v-model="checked" shape="square" icon-size="16px"></van-checkbox>
          <span>{{$t('createExchange.haveread')}}</span>
        </div>
        <van-button
          type="primary"
          class="btn"
          round
          block
          @click="submitClick('check')"
          :disabled="btnDisabled"
        >{{$t('createExchange.agree')}}</van-button>
      </div>
    </div>
  </van-overlay>
</template>

<script lang="ts">
import { Button, Overlay, Checkbox, Icon } from 'vant'
import { ref, computed, SetupContext } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'AgreementView',
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    check: {
      type: Boolean
    }
  },
  setup(props: any, context: SetupContext) {
    const { t } = useI18n()

    let { emit } = context
    let checked = computed({
      get: () => props.check,
      set: v => emit('update:check', v)
    })
    let timeOut = ref(180)
    let interVal = setInterval(() => {
      if (timeOut.value === 0) {
        clearInterval(interVal)
      } else {
        timeOut.value = timeOut.value - 1
      }
    }, 1000)
    let dislogShow = computed({
      get: () => props.show,
      set: v => {
        clearInterval(interVal)
        context.emit('update:show', v)
      }
    })
    let isTimeOut = computed(() => {
      return timeOut.value > 0
    })
    let submitClick = (type: string) => {
      dislogShow.value = false
    }
    const btnDisabled = computed(() => {
      if (checked.value == true) {
        return false
      }
      return true
    })
    return {
      t,
      btnDisabled,
      checked,
      isTimeOut,
      timeOut,
      dislogShow,
      submitClick
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;

  .miners {
    width: 341px;
    height: 646px;
    background: #fff;
    margin: auto;
    border-radius: 8px;
    .miners-header {
      height: 62px;
      line-height: 62px;
      padding-left: 15px;
      font-weight: bold;
      background: #f8fcff;
      font-size: 14px;
      color: #0f0f0f;
      span {
        margin-left: 80px;
      }
    }
    .miners-container {
      padding: 16px;
      .miners-container-text {
        line-height: 18px;
        font-size: 12px;
        color: #0f0f0f;
        .text-a {
          font-size: 14px;
          font-weight: bold;
          color: #0f0f0f;
        }
        .text-b {
          margin-bottom: 15px;
        }
        .text-c {
          margin: 15px 0;
        }
      }
      .miners-container-select {
        span {
          margin: 15px 0 15px 10px;
          line-height: 30px;
          font-size: 12px;
          color: #8f8f8f;
        }
      }
    }
  }
}
</style>