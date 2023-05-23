<template>
  <div class="page-sign">
    <van-sticky>
      <NavHeader :hasRight="false" :title="t('sign.title')">
        <template v-slot:left>
                <span class="back hover" @click="back">{{
        t("createAccountpage.back")
      }}</span>

        </template>
      </NavHeader>
    </van-sticky>
    <div class="page-container">
      <div class="sign-bg flex center">
        <div>
          <div class="text-center sign-bg-icon">
            <van-icon name="records" />
          </div>
          <div class="text-center sign-bg-tit">{{t('sign.signatureIdentification')}}</div>
          <div class="text-center sign-bg-tit1">
           {{t('sign.confirmsignaturedata')}}
          </div>
        </div>
      </div>
      <div class="sign-info">
        <div class="title"> {{t('sign.walletaddress')}}</div>
        <div class="value">{{ address }}</div>
        <div class="title">{{t('sign.signaturedata')}}</div>
        <div class="flex center" v-if="loading">
          <van-loading color="#9F54BA" />
        </div>
        <div v-else :class="`value ${signSelect ? 'focus' : ''}`" @click="toCopy">
          {{ sign }}
        </div>
      </div>

      <div class="flex between btn-box">
        <van-button type="default" @click="router.replace({name:'wallet'})" plain>{{t('sign.cancel')}}</van-button>
        <van-button type="primary" @click="goOn">{{t('sign.confirm')}}</van-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Loading, Sticky, Icon, Field, Button, Toast } from "vant";
import NavHeader from "@/components/navHeader/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useSign } from "./hooks/sign";
import { onMounted, ref, Ref } from "vue";
import useClipboard from "vue-clipboard3";
import { useI18n } from 'vue-i18n'

export default {
  name: "sign",
  components: {
    [Loading.name]: Loading,
    [Icon.name]: Icon,
    [Sticky.name]: Sticky,
    [Field.name]: Field,
    [Button.name]: Button,
    NavHeader,
  },
  setup() {
    const{t}=useI18n()
    const router = useRouter();
    const { backUrl: backUrl1 }: any = useRoute()
    const back = () => {
      router.replace({name:'wallet'})
    };
    const { toSign, loading, password, sign, address, backUrl }: any = useSign();
    const signSelect: Ref<boolean> = ref(false);
    const { toClipboard } = useClipboard();
    const toCopy = async () => {
      if (!sign.value) {
        Toast(t('sign.ready'));
        return;
      }
      try {
        await toClipboard(`${sign.value}`);
        signSelect.value = true;
        Toast.success(t('sign.copy'));
      } catch (e) {
        console.error(e);
      }
    };
    const goOn = () => {
      if (!sign.value) {
        Toast(t('sign.ready'));
        return;
      }
      console.log('backUrl', backUrl.value)
      if(backUrl.value){
        location.href = backUrl.value
      }
    }

    onMounted(() => {
      toSign();
    });
    return {
      t,
      back,
      loading,
      toSign,
      password,
      sign,
      address,
      toCopy,
      signSelect,
      router,
      goOn
    };
  },
};
</script>
<style lang="scss" scoped>
.back {
  color: #9F54BA;
  font-size: 12px;
}
.page-sign {

  .btn-box {
    margin-top: 20px;
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 25px;
    .van-button {
      width: 160px;
    }
  }
  .sign-bg {
    background: #F8F3F9;
    height: 135px;
    &-icon {
      font-size: 40px;
      color: #9F54BA;
    }
    &-tit {
      line-height: 20px;
      font-size: 15px;
      font-weight: bold;
      margin-top: 5px;
    }
    &-tit1 {
      font-size: 12px;
      line-height: 16px;
      margin-top: 7.5px;
    }
  }
  .sign-info {
    margin: 25px 27px;
    padding: 15px;
    max-height: 327px;
    border-radius: 4px;
    overflow-y: scroll;
    border: 1px solid #e4e7e8;
    div {
      word-break: break-all;
      font-size: 14px;
    }
    .title {
      line-height: 30px;
    }
    .value {
      line-height: 14px;
      // &.select {
      //   background: #9F54BA;
      //   color:#fff;
      // }
      &:nth-of-type(1) {
        margin-bottom: 20px;
      }
    }
    .value.focus {
      background: #3897f7;
      color: #fff;
      outline: none;
      display: inline;
      animation: select 200ms step-end forwards;
    }
  }

  @keyframes select {
    to {
      -webkit-user-select: text;
      user-select: text;
    }
  }
}
</style>