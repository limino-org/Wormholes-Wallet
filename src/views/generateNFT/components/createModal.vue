<template>
  <div class="create-modal">
    <div class="form-item">
      <div class="label text-left">{{ t("generateNFT.promptWord") }}</div>
      <div class="word">
        sdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdfsdsdsfsfsdf
      </div>
    </div>
    <div class="van-hairline--bottom"></div>
    <div class="form-item flex between">
      <div class="label text-left">{{ t("send.from") }}</div>
      <div class="val">sdsdsfsfsdf</div>
    </div>
    <div class="form-item flex between">
      <div class="label text-left">{{ t("send.to") }}</div>
      <div class="val">sdsdsfsfsdf</div>
    </div>
    <div class="van-hairline--bottom"></div>
    <div class="form-item flex between">
      <div class="label text-left">{{ t("send.gasfee") }}</div>
      <div class="val">≈2.22 ERB</div>
    </div>
    <div class="form-item flex between">
      <div class="label text-left">{{ t("generateNFT.drawVal") }}</div>
      <div class="val">3 ERB</div>
    </div>
    <div class="van-hairline--bottom"></div>
    <div class="form-item flex between">
      <div class="label text-left">{{ t("generateNFT.emailAddr") }}</div>
      <div class="val">cbs8710064@163.com</div>
    </div>
  </div>
  <div class="btn-modal-group flex evenly pb-24">
    <van-button  @click="emit('cancel')">{{ t('common.cancel') }}</van-button>
    <van-button type="primary" @click="emit('confirm')">{{ t('common.confirm') }}</van-button>
  </div>
</template>

<script lang="ts" setup>
import { Button as VanButton } from "vant";
import { useI18n } from "vue-i18n";

const emit = defineEmits(['cancel', 'confirm'])
const { t } = useI18n();
</script>
<style lang="scss" scoped>
:deep(){
    min-width: 100px;
}
.create-modal {
  margin: 25px 15px;
  padding: 0 15px;
  border: 1px solid #e4e7e8;
  border-radius: 5px;
  .form-item {
    padding: 9px 0;
  }
  .label {
    color: #848484;
  }
  .word {
    text-align: left;
    margin-top: 5px;
    word-break: break-all;
  }
  .label,
  .word,
  .val {
    line-height: 17px;
  }
  .val {
    text-align: right;
  }
}
</style>