<template>
    <div class="cancel-btn flex center">
        <span @click="backHome">{{t('common.cancel')}}</span>
    </div>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const {t} = useI18n()
const router = useRouter()
const backHome = () => {
    router.replace({name:"wallet"})
}
</script>
<style lang="scss">
    .cancel-btn {
        span {
            font-size: 12px;
            color: #9F54BA;
        }
    }
</style>
