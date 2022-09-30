<template>
    <div v-if="show" class="dialog-warning-dark">
      <div v-if="show" class="dialog-warning">
        <div class="dialog-warning-header"  style="color:000;">Closing of the Exchange </div>
        <div class="warning-icon">
            <van-icon color="#3AAE55" name="checked" size="35" />
        </div>
        <div class="warning-text">
            <span>Closed Successfully Thank you for your company</span>
        </div>
        <div class="footer-btns">
            <van-button style="width: 175px;" type="primary" class="btn" :disabled="Time !== 0" round @click="emitWarningSuccess">Back Home{{Time === 0 ? '' : `(${Time}s)`}}</van-button>
      </div>
    </div>
    </div>
</template>

<script lang="ts">
import { emit } from 'process'
import { Icon, Checkbox, Button, Toast } from 'vant'
import { useRouter } from 'vue-router'
import { ref,nextTick, Ref, computed, toRaw, SetupContext, onMounted, watch } from 'vue'
export default {
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button
    },
    props: {
        isWarning: {
            type: Boolean,
            default: false
        },
    },
    setup(props: any, context: SetupContext) {
        let Time = ref(3)
        nextTick(() => {
          let setIntervalValue = setInterval(() => {
            Time.value -= 1
            if (Time.value === 0) {
              clearInterval(setIntervalValue)
            }
          }, 1000)
        })
        const { emit }: any = context
        const show = computed({
            get() {
                return props.isWarning
            },
            set(v: boolean) {
                emit('update:isWarning', v)
            }
        })
        const router = useRouter()
        const emitWarningSuccess = () => {
            router.push({
              name: 'wallet'
            })
        }
        const text = props.text
        return {
            show,
            text,
            emitWarningSuccess,
            Time
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-warning-dark {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
    left: 0;
  right: 0;
  background: rgba(0,0,0,0.7000);
  z-index: 9000;
}
    .dialog-warning {
        z-index: 9999;
        width: 340px;
        height: 280px;
        background: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        max-width: 340px;
        font-size: 15px;
        border-radius: 8px;
        overflow: hidden;
    }
    .dialog-warning-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-size: 15px;
      color: #B3B3B3;
      background: #F8FCFF;
    }
    .warning-icon {
        padding: 25px;
        padding-top: 25px;
        text-align: center;
    }
    .warning-text {
        text-align: center;
        padding: 0 75px;
        font-size: 14px;
        color: #000;
    }
    .footer-btns {
      display: flex;
      justify-content: space-between;
      padding: 0 100px;
      margin-top: 30px;
        div {
            padding: 25px;
            text-align: center;
            span {
                display: inline-block;
                width: 100px;
                height: 45px;
                font-size: 12px;
                border-radius: 50px;
                text-align: center;
                line-height: 45px;
                box-sizing: border-box;
                &:first-child {
                    color: #000;
                    margin-right: 40px;
                    border: 1px solid #000;
                }
                &:last-child {
                    background-color: #D73A49;
                }
            }
        }
    }
</style>