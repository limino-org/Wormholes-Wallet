<template>
  <div class="create-account">
    <div class="container page-container flex center">
      <div class="account-groups">
        <div class="tit-company text-center">Wormholes</div>
        <div class="create-btn acc-btn text-center  hover" @click="toCreate">
          {{t('create.createwallet')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
export default {
  name:'create',
  setup() {
    const{t}=useI18n()
    const router = useRouter()
    const toImport = () => {
      router.push({
        name:'importByMnemonic',
      })
    }
    const toCreate = () => {
      router.push({
        name: 'newwallet'
      })
    }
    return {
      t,
      toImport,
      toCreate
    }
  },
};
</script>
<style lang="scss" scoped>
.create-account {
  .account-groups {
    width: 100%;
    .tit-company {
      margin-bottom: 30px;
      font-size: 24px;
    }
    .acc-btn {
      border-top: 1px solid #979797;
      border-bottom: 1px solid #979797;
      color: rgba(3, 125, 214, 1);
      font-size: 12px;
      line-height: 50px;
    }
  }
}
</style>
