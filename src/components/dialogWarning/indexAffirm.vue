<template>
    <div class="mask flex center" v-if="show" >
    <div :class="`dialog-warning ${theme}`">
        <div class="warning-icon">
            <van-icon color="#F7BF03" name="warning"  />
        </div>
        <div class="warning-text">
            <span>{{text}}</span>
        </div>
        <div class="footer-btns">
            <div>

                <span @click="show = false">{{t('common.no')}}</span>
                <span @click="emitWarningSuccess">{{t('common.yes')}}</span>
            </div>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { emit } from 'process'
import { Icon, Checkbox, Button, Toast } from 'vant'
import { ref, Ref, computed, toRaw, SetupContext, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    components: {
        [Icon.name]: Icon,
    },
    props: {
        isWarning: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        },
        theme: {
            type: String,
            default:"dark"
        }
    },
    setup(props: any, context: SetupContext) {
        const { emit }: any = context
        const {t} = useI18n()
        const show = computed({
            get() {
                return props.isWarning
            },
            set(v: boolean) {
                emit('update:isWarning', v)
            }
        })
        const emitWarningSuccess = () => {
            emit('warningSuccess')
        }
        const text = props.text
        return {
            show,
            text,
            emitWarningSuccess,
            t
        }
    }
}
</script>

<style lang="scss" scoped>
    .mask {
        background: rgba($color: #000000, $alpha: 0.7);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 1000000;
    }
    .dialog-warning {
        width: 340px;
        font-weight: bold;
        font-size: 15px;
        height: 236px;
        border-radius: 8px;
        &.dark {
            background: rgba($color: #000000, $alpha: 0.8);
            color: #fff;
            .footer-btns {
                div span {
                color: #fff;
                &:first-child {
                    border: 1px solid #fff;
                    margin-right: 40px;
                }
                &:last-child {
                    background-color: #037cd6;
                }
            }
            }
    
        }
        &.light {
            background: rgba($color: #fff, $alpha: 1);
            color: #000;
            .footer-btns {
                div span {
                color: #000000;
                &:first-child {
                    border: 1px solid #000;
                    margin-right: 40px;
                }
                &:last-child {
                    color: #fff;
                    background-color: #037cd6;
                }
            }
            }
        }
    }
    .warning-icon {
        padding: 25px;
        padding-top: 50px;
        text-align: center;
        i {
            font-size: 40px;
        }
    }
    .warning-text {
        text-align: center;
        padding: 0 35px;
        font-size: 14px;
    }
    .footer-btns {
        div {
            padding: 25px;
            text-align: center;
            span {
                cursor: pointer;
                display: inline-block;
                width: 100px;
                height: 45px;
                font-size: 12px;
                border-radius: 50px;
                text-align: center;
                line-height: 45px;
     
                box-sizing: border-box;
   
            }
        }
    }
</style>