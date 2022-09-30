<template>
  <div class="page-add-currency">
    <van-sticky>
      <NavHeader :hasRight="false" :title="$t('addCurrency.title')">
        <template v-slot:left>
          <van-icon name="arrow-left" class="back" @click="back" />
        </template>
      </NavHeader>
    </van-sticky>
    <div class="page-container">
      <div class="text-center tit">{{t('addCurrency.customtoken')}}</div>
      <van-form @failed="onFailed">
        <van-cell-group>
          <van-field v-model="value1" name="add" :placeholder="$t('addCurrency.tokenaddress')" :rules="[{ required: true, message: t('addCurrency.inputaddress') }]" />
          <van-field v-model="value2" name="sym" :placeholder="$t('addCurrency.tokensymbol')" :rules="[{ required: true, message:  t('addCurrency.inputsymbol') }]" />
          <van-field v-model="value3" name="ddd" :placeholder="$t('addCurrency.tokenaccuracy')" :rules="[{ required: true, message:  t('addCurrency.inputaccuracy') }]" />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">{{t('addCurrency.submit')}}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Sticky, Icon, Form, Field, Button, Cell, CellGroup } from 'vant'
import NavHeader from '@/components/navHeader/index.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'page-add-currency',
  components: {
    [Sticky.name]: Sticky,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Form.name]: Form,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    NavHeader
  },
  setup() {
    const{t}=useI18n()
    const router = useRouter()
    const back = () => {
      router.go(-1)
    }
    const onFailed = () => {}
    return {
      t,
      back,
      onFailed
    }
  }
})
</script>
<style lang="scss" scoped>
.page-add-currency {
  .back {
    font-size: 18px;
  }
  .tit {
    font-size: 18px;
    margin-top: 10px;
    line-height: 36px;
    border-bottom: 2px solid #0287db;
  }
}
</style>