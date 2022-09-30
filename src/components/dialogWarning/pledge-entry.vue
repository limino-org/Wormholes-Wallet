<template>
  <van-overlay :show="dislogShow" :z-index="9999" class="custom-overlay">
    <div class="miners">
      <div class="miners-header">
        <span>Staking Income</span>
      </div>
      <div class="miners-container flex column between">
        <div class="miners-container-entre">
          <div class="miners-container-entre_txt">Select</div>
          <div class="check_select">
              <van-radio-group v-model="checked_ENTRY" @change="chan_select">
                <van-radio name="0">ERB</van-radio>
                <div style="border-top:1px solid #F0F0F6;margin-top:10px;"></div>
                <van-radio name="1" class="snft_select" style="margin-top:10px;">SNFT</van-radio>
                <div style="border-bottom:1px solid #F0F0F6;margin-top:10px;"></div>
              </van-radio-group>
          </div>
        </div>

        <!-- ERB -->
        <div class="select_erb" v-if="select_erb">
            Tips:Select ERB,your pledge income will be returned in the form ERB
        </div>

        <div class="select_erb" v-if="select_snft">
            Tips:Select SNFT,your pledge income will be returned in the form SNFT
        </div>
        <!-- </div> -->
        <div class="container-btn flex center column">
          <div>
            <van-button
              color="#000000"
              class="btn"
              plain
              @click="dislogShow = false"
              >{{t('common.cancel')}}</van-button
            >
            <van-button
              type="primary"
              class="btn"
              :loading="isLoading"
              :disabled="Time !== 0"
              round
              @click="submit"
              >{{t('common.confirm')}}{{ Time === 0 ? "" : `(${Time}s)` }}</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </van-overlay>
<!-- iconName="checked" -->
  <dialog-warning
      v-model:isWarning="isWarning"
      text="Please select first"
      color="#FDBF27"
    />
</template>

<script lang="ts">
import { Button, Overlay, Field, Toast, Icon,RadioGroup, Radio} from "vant";
import { ref, SetupContext, computed, nextTick } from "vue";
import { ethers, utils } from "ethers";
import { useStore } from "vuex";
import { formatEther, toUsd } from "@/utils/filters";
import { useI18n } from "vue-i18n";
import { ElTooltip } from "element-plus";
import { getWallet } from "@/store/modules/account";
import dialogWarning from "@/components/dialogWarning/message.vue";
export default {
  components: {
    [Button.name]: Button,
    [Overlay.name]: Overlay,
    [Field.name]: Field,
    ElTooltip,
    [Icon.name]: Icon,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    "dialog-warning": dialogWarning,
  },
  props: ["show", "name", "serverIndex", "money"],
  setup(props: any, context: SetupContext) {
    const { t } = useI18n();
     const store = useStore();
    const accountInfo = computed(() => store.state.account.accountInfo);
    const { emit }: any = context;
    let amount = ref(props.minersMoney);
    let moneyMin = ref(100000);
    let moneyMax = ref(10000000);

    let dislogShow = computed({
      get: () => props.show,
      set: (v) => emit("update:show", v),
    });
    let money = computed({
      get: () => props.minersMoney,
      set: (v) => emit("update:minersMoney", v),
    });
    const toHex = (str: string) => {
      if (str === "") return "";
      var hexCharCode = [];
      for (var i = 0; i < str.length; i++) {
        hexCharCode.push(str.charCodeAt(i).toString(16));
      }
      return hexCharCode.join("");
    }
    const isLoading = ref(false)
     const isWarning = ref(false);
    const submit = () => {
      if (getselect_va.value == '') {
          isWarning.value = true;
      }else{
        isLoading.value = true
        try {
          return new Promise(async (resolve) => {
              const str = `wormholes:{"version": "0.0.1","type": 25,"reward_flag": "${getselect_va}"}`;
              const data3 = toHex(str);
              const tx1 = {
                from: accountInfo.value.address,
                to: accountInfo.value.address,
                data: `0x${data3}`
              };
              const wallet = await getWallet()
              const receipt:any = await wallet.sendTransaction(tx1)
              const { hash } = receipt;
              localStorage.setItem('tx1', JSON.stringify(receipt))
              const data1 = await wallet.provider.waitForTransaction(hash)
              console.log(data1);
              resolve(data1)
            })
         
        } catch (error) {
             isLoading.value = false
        }
          
      }

    };
    let screentNumber = () => {
      return Number(utils.formatEther(amount.value + "")).toFixed(2);
    };

    let select_erb = ref(false)
    let select_snft = ref(false)
    let getselect_va = ref('')
    let chan_select =(event:any)=>{
        getselect_va.value = event
        if(event === '0'){
                select_erb.value = true;
                select_snft.value = false;
        }else if(event === '1'){
                select_snft.value = true;
                select_erb.value = false;
        }
    }
    let Time = ref(3);
    let checked_ENTRY = ref(false);
    nextTick(() => {
      let setIntervalValue = setInterval(() => {
        Time.value -= 1;
        if (Time.value === 0) {
          clearInterval(setIntervalValue);
        }
      }, 1000);
    });
    return {
      t,
    //   select_entry,
    //   select_entry2,
    select_erb,
    isWarning,
    isLoading,
    getselect_va,
    select_snft,
      chan_select,
      checked_ENTRY,
      Time,
      amount,
      money,
      moneyMin,
      moneyMax,
      dislogShow,
      submit,
      screentNumber,
      toUsd,
      ...props,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-overlay {
  display: flex;
  .miners {
    width: 341px;
    height:320px;
    // margin-bottom:25px;
    background: #fff;
    // margin: auto;
    margin-top:180px;
    border-radius: 8px;
    .miners-header {
      height: 62px;
      line-height: 62px;
      text-align: center;
      font-weight: bold;
      background: #f8fcff;
      font-size: 14px;
      color: #0f0f0f;
    }
    .miners-container {
        .select_erb{
        color:#388EBF;
        margin:10px;
        font-size:14px;
        line-height:20px;
        }
      .miners-container-entre_txt {
        margin: 10px;
        color: #b8b8ba;
        // .snft_select{
        //     display: inline-block;
        //     margin-top:30px;
        //     background-color: red;
        // }
      }
      .check_select{
          padding:0px 15px;
      }
      .contaienr-top-header {
        margin: 28px 0 21px 0;
        span {
          &:first-child {
            display: inline-block;
            width: 35px;
            height: 35px;
            line-height: 35px;
            margin-bottom: 12px;
            text-align: center;
            border-radius: 5px 5px 5px 5px;
            opacity: 1;
            color: #0287db;
            border: 3px solid #0287db;
          }
          &:last-child {
            font-weight: bold;
            font-size: 14px;
            color: #0f0f0f;
          }
        }
      }
      .contaienr-top-ipt {
        width: 315px;
        height: 90px;
        margin: auto;
        padding: 11px 15px 20px 15px;
        box-sizing: border-box;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #e4e7e8;
        .ipt {
          width: 280px;
          span {
            font-size: 16px;
            font-weight: bold;
          }
        }
        .text {
          font-size: 14px;
        }
        .user-field {
          font-size: 12px;
        }
        > span {
          font-size: 12px;
          color: #8f8f8f;
        }
        .ipt-text-a {
          padding-top: 20px;
          margin-top: 30px;
          font-size: 12px;
          color: #8f8f8f;
        }
        .ipt-text-b {
          margin: 5px 0 9px 0;
          color: #000;
          font-size: 12px;
          font-weight: bold;
        }
        .ipt-server {
          font-size: 10px;
          color: #8f8f8f;
          font-weight: bold;
          span {
            font-weight: 400;
            color: #000000;
          }
          .ipt-server-i {
            width: 133px;
            height: 30px;
            padding: 0 2px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f4faff;
            border-radius: 7px 7px 7px 7px;
            &:first-child {
              padding: 0 18px;
            }
          }
          .ipt-server-i-active {
            color: #0287db;
            background: #f4faff;
            border: 1px solid #037cd6;
            span {
              color: #0287db;
            }
          }
        }
        .money {
          margin: 10px 0 20px 0;
          font-size: 12px;
          font-weight: bold;
          span {
            &:first-child {
              color: #000000;
            }
            &:last-child {
              color: #0287db;
            }
          }
        }
        .ipt-slider {
          margin-left: 5px;
        }
        .stake {
          margin: 20px 0 5px 0;
          font-size: 12px;
          color: #8f8f8f;
          span {
            color: #3aae55;
          }
        }
        ::v-deep .van-cell {
          padding-left: 0px;
        }
        .van-cell:after {
          display: none;
        }
      }
      .container-btn {
        margin-top: 10px;
        .btn {
          width: 104px;
          height: 45px;
          margin-top: 21px;
          &:first-child {
            margin-right: 35px;
          }
        }
        span {
          font-size: 12px;
          &:first-child {
            margin: 0 5px 0 10px;
            color: #8f8f8f;
          }
          &:last-child {
            color: #0287db;
          }
        }
        .btn-text {
          margin: 15px 0 10px 0;
          font-size: 12px;
          color: #8f8f8f;
        }
        .underline {
          text-decoration: underline;
        }
      }
    }
  }
}
.miners-container-item {
  margin: 25px 12.5px 0 12.5px;
  padding: 17px 15px 0 15px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #e4e7e8;
}
.c1 {
  color: #8f8f8f;
}
.exchange {
  margin-top: 7px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7e8;
}
.bourse-container-meaning {
  margin-bottom: 16px;
}
.exchange-z {
  border: none;
}
.c2 {
  color: #3aae55;
}
</style>