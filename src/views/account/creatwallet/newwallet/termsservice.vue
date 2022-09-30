<template>
  <van-dialog
    v-model:show="showService"
    show-cancel-button
    class="dialog-box-service"
    :showConfirmButton="false"
    :showCancelButton="false"
    teleport="#guide-step2-page"
    closeOnClickOverlay
  >
    <div class="dia-con">
      <div class="container text-info">
        <!-- <div class="logo mt-20"></div> -->
        <div class="worm-box">
          <WormTransition size="small">
            <template v-slot:icon>W</template>
          </WormTransition>
        </div>
        <div class="f-24 tit-big">Wormholes Wallet</div>
        <div class="terms-content">
          <div class="f-16 mt-20">Terms of Service</div>
          <div class="f-12 lh-16">Last Updated: 20/02/2022</div>
          <div class="f-12 paragraph lh-16 mt-10 mb-10">
            The Platform and the Services are subject to these terms of service
            ("Terms"). By using the Platform or the Services, you agree that you
            have read, understood and agree to these Terms which shall form a
            legal agreement between you and Enjin. These Terms may be revised
            from time to time accordance with Clause 9.2. If you do not agree
            with any of the foregoing, you must immediately cease access and use
            of theServices.
          </div>
          <div class="f-12 lh-16 mb-10">1. Definitions and Interpretation</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
          <div class="f-12 paragraph lh-16">
            1.1 In these Terms, unless the context otherwise requires, the
            following definitions shall apply
          </div>
          <div class="f-12 paragraph lh-16 mt-10">
            "Applicable Laws" means all applicable statutes, enactments, acts of
            the state legislature or parliament, laws, ordinances, rules,
            bye-laws,regulations, notifications, guidelines, directions,
            directives and orders of any governmental authority, statutory
            authority, tribunal, board, court or recognised stock exchange, as
            may be applicable, international treaties and regulations.
          </div>
          <div class="f-12 paragraph lh-16 mt-10">"Clause" means a clause in these Terms.</div>
          <div class="f-12 paragraph lh-16 mt-10">"Content" has the meanina aiven to it in Clause.</div>
        </div>
      </div>
    </div>
  </van-dialog>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, watch, SetupContext, computed, reactive, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon, Dialog, Button, Loading, Toast, Checkbox } from 'vant'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import WormTransition from '@/components/wromTransition/index.vue'

export default defineComponent({
  name: 'TermsService',
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Loading.name]: Loading,
    [Checkbox.name]: Checkbox,
    WormTransition
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const i18n = useI18n()
    const { dispatch } = store
    const { t } = useI18n()
    const showService: Ref<boolean> = ref(false)

    const checked1: Ref<boolean> = ref(false)
    const btnDisabled = computed(() => {
      if (checked1.value == true) {
        return false
      }
      return true
    })

    watch(
      () => props.modelValue,
      n => {
        showService.value = n
      },
      {
        immediate: true
      }
    )

    // watch(
    //   () => showService.value,
    //   n => {
    //     if (!n) {
    //       emit('update:modelValue', false)
    //     }
    //     if (n) {
    //       nextTick(() => {
    //         // Lazy loading animation encapsulation
    //         const intersectionObserver = new IntersectionObserver(entries => {
    //           if (entries[0].intersectionRatio <= 0) return
    //           console.log('Loaded new items')
    //           let time = setTimeout(() => {
    //             showBtn.value = true
    //             clearTimeout(time)
    //           })
    //         })
    //         intersectionObserver.observe(nullEle.value)
    //       })
    //     }
    //   }
    // )
    const nullEle = ref(null)
    const showBtn = ref(true)
    onMounted(() => {
      countdown()
    })
    let timer: any = null
    let count = ref(40)
    // Click 180 seconds later
    function countdown() {
      timer = setInterval(() => {
        count.value = count.value - 1
        if (count.value <= 0) {
          clearInterval(timer)
          timer = null
          //  btnDisabled.value=true
        }
      }, 1000)
    }
    const checkDisabled = computed(() => {
      if (count.value == 0) {
        return false
      }
      return true
    })

    return {
      showService,
      checked1,
      btnDisabled,
      nullEle,
      showBtn,
      count,
      checkDisabled
    }
  }
})
</script>
<style lang="scss" scoped>
.dia-con {
  padding: 22px 15px 0px;
}
.worm-box {
  width: 42%;
}
.worm-icon {
  color: #0287db;
  font-size: 24px;
}
.container {
  .logo {
    width: 60px;
    height: 60px;
    background-color: #0287db;
    border-radius: 50%;
  }
  .tit-big {
    color: #0287db;
    font-weight: 600;
  }
  .paragraph {
    overflow: normal;
  }
  .tit-small {
    color: #b3b3b3;
  }
}
.text-info {
  position: relative;
  height: 80vh;
  overflow-y: scroll;
}

:deep(.van-dialog) {
  border-radius: 0 !important;
}
:deep() {
  .dialog-box {
    border-radius: 0px !important;
  }
  .icon-box {
    margin-top: 0;
  }
}
::deep dialog-box {
  border-radius: 0px !important;
}
.nullele {
  margin-bottom: 105px;
}
.argee-box {
  opacity: 0;
  position: fixed;
  background: #fff;
  padding: 0 15px;
  bottom: 0;
  height: 106px;
  left: 0;
  right: 0;
  padding-bottom: 20px;
  transition: ease 0.6s;
  &.show {
    opacity: 1;
  }
}
</style>