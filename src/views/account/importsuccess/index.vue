<template>
  <view class="page-import-success page-container">
    <van-icon class="import close-icon" name="cross" @click="close" />

    <!-- <van-icon class="import-success" name="passed" size="45px" color="#28A745" /> -->
    <i class="iconfont icon-dui import-success import-success-icon"></i>
    <div class="import-success title">{{t('importsuccess.success')}}</div>
    <div class="import-success content">{{t('importsuccess.check')}}</div>
  </view>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from 'vant'
export default {
  name: 'importSuccess',
  components: {
    [Icon.name]: Icon
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const close = () => {
      router.replace('/')
    }
    return {
      t,
      close
    }
  }
}
</script>

<style lang="scss" scoped>
.close-icon {
  padding:30px 20px 0;
  font-size: 14px;
  text-align: right;
  display: block;
    font-size: 18px;

}
.page-import-success {
  padding-top: 40px;
  width: 100vw;
  height: 100vh;
}
.import-success {
  margin-left: 20px;
  margin-top: 6px;
  &-icon {
    color: #28a745;
    font-size: 45px;
    display: inline-block;
    margin-top: 20px;
  }
}
.title {
  height: 29px;
  font-size: 25px;
  margin-top: 29px;
  line-height: 29px;
  white-space: wrap;
}
.content {
  font-size: 12px;
  margin-top: 39px;
  line-height: 12px;
}
</style>