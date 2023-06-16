<template>
    <!-- <div class="loading-bg pt-24 pb-24">
      <div class="tit-big text-center f-16">{{t('castingnft.createNFT')}}</div>
      <div class="flex between center-v dotted-box">
        <div class="step2 f-12 lh-16">1</div>
        <span class="dotted-line"></span>
        <div class="step2 f-12 lh-16 no">2</div>
      </div>
      <div class="flex between f-12 dotted-box">
        <div class="tit-small">{{t('castingnft.information')}}</div>
        <div class="tit-small">{{t('castingnft.done')}}</div>
      </div>
    </div> -->
    <!-- icon -->
    <div class="icon-box flex center">
      <div class="iconele flex center" :style="{backgroundImage: `url(${require('@/views/createNft/imgs/circle.png')})`}">
        <div class="iconinner flex center" :style="{backgroundImage: `url(${require('@/views/createNft/imgs/circle1.png')})`}">
          <i class="iconfont icon-duigouxiao"></i>
        </div>
      </div>
    </div>
    <div class="tip">
      <div class="lh-30 text-bold text-center f-21 mt-8 mb-16">{{t('castingnft.congratulations')}}</div>
      <div class="f-12 lh-16 tip-info text-center">{{t('castingnft.successfullyCreated')}}</div>
    </div>
    <div class="btn-group">
      <div class="container pl-26 pr-26 pb-26">
        <van-button type="primary" block @click="tohome">
        {{t('castingnft.backHome')}}
        <span>{{count}}s</span>
      </van-button>
      </div>
    </div>
  </template>
  <script lang="ts">
  import Vue from 'vue'
  import { Icon, Toast, Button, Tab, Tabs, Uploader, Form, Field, CellGroup, Dialog, Step, Steps, CountDown } from 'vant'
  import { ref, Ref, computed, toRaw, SetupContext, onMounted,onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  
  export default {
    name: 'createNft-step1',
    components: {
      [Button.name]: Button,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Uploader.name]: Uploader,
      [Form.name]: Form,
      [Field.name]: Field,
      [CellGroup.name]: CellGroup,
      [Dialog.Component.name]: Dialog.Component,
      [Step.name]: Step,
      [Steps.name]: Steps
    },
    setup(): any {
      const { t } = useI18n()
      const active = ref(2)
      const router = useRouter()
      const tohome = () => {
        router.push({
          name: 'wallet'
        })
      }
      onMounted(() => {
        countdown()
      })
      let timer: any = null
      let count = ref(5)
      function countdown() {
        timer = setInterval(() => {
          count.value = count.value - 1
          if (count.value <= 0) {
            clearInterval(timer)
            timer = null
            router.push({
              name: 'wallet',
            })
          }
        }, 1000)
      }
      
      onUnmounted(() => {
        clearInterval(timer)
      })
      return {
        t,
        active,
        count,
        tohome
      }
    }
  }
  </script>
  <style lang="scss" scoped>
  .btn-group {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .dotted-box {
    width: 45vw;
    margin: 0 auto;
  }
  .icon-duigouxiao {
    color: rgba(62, 174, 88,1);
    font-size: 50px;
  }
  .loading-bg {
    background: #F8F3F9;
    height: 135px;
    .tit-big {
      line-height: 21px;
    }
    .step {
      width: 17px;
      height: 17px;
      background-color: #9F54BA;
      color: #fff;
      text-align: center;
      border-radius: 50%;
    }
    .step2 {
      width: 17px;
      height: 17px;
      background-color: #9F54BA;
      color: #fff;
      text-align: center;
      border-radius: 50%;
    }
    .step3 {
      width: 16px;
      height: 16px;
      background-color: #fff;
      border: 1PX solid #9F54BA;
      color: #b3b3b3;
      text-align: center;
      border-radius: 50%;
    }
    .dotted-line {
      text-align: center;
      width: 88%;
      height: 0px;
      border-bottom: 1px dashed #9F54BA;
    }
  
    .tit-small {
      color: #9F54BA;
    }
  }
  .dotted-box {
    width: 45vw;
    margin: 0 auto;
  }
  .icon-box {
    margin-top: 100px;
    .iconele {
      width: 175px;
      height: 175px;
      border-radius: 50%;
      overflow: hidden;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: left 0 top 0 right 0 bottom 0;
      .iconinner {
        width: 110px;
        height: 110px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left 0 top 0 right 0 bottom 0;
  
        img {
          display: block;
          width: 40%;
        }
      }
    }
  }
  .tip-info {
    width: 255px;
    margin: 0 auto;
    color: #848484;
  }
  </style>