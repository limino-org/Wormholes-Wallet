<template>
    <div v-if="show" class="dialog-warning">
        <div class="warning-icon">
            <van-icon :color="color" :name="iconName" size="35" />
        </div>
        <div class="warning-text">
            <span>{{text}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { Icon, Checkbox, Button, Toast } from 'vant'
import { ref, Ref, computed, toRaw, SetupContext, onMounted, watch } from 'vue'
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
        color: {
            type: String,
            default: '#F7BF03'
        },
        iconName: {
           type: String,
            default: 'warning' 
        }
    },
    setup(props: any, context: SetupContext) {
        const { emit }: any = context
        const show = computed({
            get() {
                return props.isWarning
            },
            set(v: boolean) {
                emit('update:isWarning', v)
            }
        })
        let time:any = null
        watch(() => props.isWarning,
        (now) => {
            if (now) {
                clearTimeout(time)
                console.log(now);
                
                time = setTimeout(() => {
                    show.value = false
                }, 2500)
            }
        })
        const text = props.text
        
        return {
            show,
            text
        }
    }
}
</script>

<style lang="scss" scoped>
    .dialog-warning {
        width: 250px;
        background: rgba($color: #000000, $alpha: 0.8);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        max-width: 250px;
        font-size: 15px;
        min-height: 160px;
        border-radius: 8px;
        z-index: 99999;
    }
    .warning-icon {
        padding: 25px;
        text-align: center;
    }
    .warning-text {
        text-align: center;
        padding: 0 35px;
        font-size: 14px;
    }
</style>