<template>
  <van-dialog
    v-model:show="showService"
    show-cancel-button
    class="dialog-box-service"
    :showConfirmButton="false"
    :showCancelButton="false"
    :close-on-click-overlay="true"
  >
    <div class="dia-con">
      <div class="container text-info">
        <i
          class="iconfont icon-cuowu hover"
          v-if="hasClose"
          @click="closeModal"
        ></i>
        <!-- <div class="logo mt-20"></div> -->
        <div class="worm-box-out">
          <WormTransition size="small">
            <template v-slot:icon>
              <img src="@/assets/token/logowallet.png" style="width: 20px" />
            </template>
          </WormTransition>
        </div>
        <div class="tit-big text-bold">Wormholes Wallet</div>
        <div class="text-inner">
          <div class="f-16 tit-small pl-14 pr-14">Terms of Service</div>
          <div class="f-12 mb-16 mt-10 pl-14 pr-14">
            Last Updated: 2 August 2022 <br />
          </div>
          <div class="terms-content">
            <div class="f-12 paragraph lh-18 mt-10 mb-10">
              [Wormholes Foundation/Wormholes Lab Inc.] (the “Company”, “we”,
              ‘’us‘’, “our”), is committed to protecting and respecting your
              privacy. This notice (together with our respective Terms of
              Service) sets out how we will process and use any personal data we
              collect from you, or that you provide to us. Please read the
              following carefully to understand how we collect and process your
              personal information, how we define it, and how we will handle it.
              By using any of our services, including but not limited to our
              One-Click NFT Marketplace, Wormholes Digital Wallet, Wormholes
              Blockchain Explorer, Wormholes Faucet or by purchasing Wormholes
              blockchain's native ERB tokens (“Tokens”)(together “our Services”)
              or by accessing our Website [www.wormholes.org/www.wormholes.com],
              you accept and consent to the practices described in this notice.
              If you do not wish for your personal information to be used in the
              manner described within this Notice, you should not access our
              Services, Website or any subdomains or otherwise provide us with
              your personal information.
              <br />
              The Company is the data controller of your personal information
              processed in connection with the provision of our Services. In
              addition, our current or future affiliated companies, their
              respective parent companies, subsidiaries or joint ventures may
              also be provided with your data. This Notice applies to the
              actions and responsibilities of all such entities where they act
              as data controllers of your personal information. References to
              we, us or our in this Notice are references to the relevant
              company responsible for processing your personal information. In
              some cases, our affiliated entities may operate as data processors
              on our behalf, and we will ensure that such activities are subject
              to contractual obligations on privacy, security and other matters
              in accordance with this Notice. Please ensure that any relevant
              individuals are made aware of this Notice and the individual
              rights and information it sets out, prior to providing their
              information to us or our obtaining their information from another
              source. If you, or anyone else on your behalf, has provided or
              provides information on an individual connected to your business
              to us, you or they must first ensure that you or they have the
              authority and appropriate legal basis to do so. Please also note:
              <br /><br />
              • Unless otherwise defined in this Notice, terms used have the
              same meaning as in the relevant Terms of Service. <br />
              • The Notice does not address, and we are not responsible for, the
              privacy practices of any other parties, or data publicly available
              on the Wormholes Blockchain. <br />
              • We do not knowingly collect or ask for data, including personal
              information, from people under the age of 18 or who is considered
              a minor according to their jurisdiction. If you are such a person,
              please do not use our service or send us your data. We delete data
              that we learn is collected from a person under the age of 18 or
              who is considered a minor according to their jurisdiction without
              verified parental consent. <br />
              The types of information we collect<br />
              "Personal information" is any information that, either alone or in
              combination with other data, enables you to be directly or
              indirectly identified (for example, your name, email address,
              contact details, or any unique identifier such as an internet
              protocol (‘IP’) address, device ID or other online identifier). We
              collect your personal information when you provide it to us. We
              may also automatically collect certain information when you use,
              access, or interact with our Website and our Services. <br />
              Information you provide to us<br />
              When you use our Services, we may collect the following personal
              information from you:<br /><br />
              • first and last name;<br />
              • date of birth;<br />
              • nationality and country of residence;<br />
              • residential address;<br />
              • email address;<br />
              • passport number and issuing body; and<br />
              • your wallet address, any other cryptocurrency wallet address or
              bank account details and any related transaction details recorded
              by our Services and/or the Wormholes Blockchain.<br />
              We may also collect information that you voluntarily provide to
              us, including when you communicate with us via email, on social
              media or other channels, when you register for our updates and
              when you respond to our communications or requests for
              information. The information you provide may include your name,
              contact information, title and other personal information about
              you. <br />
              Information we may collect automatically through cookies and
              similar technologies <br />
              By accessing our Website we may also automatically collect certain
              data from your browser, including server log information (such as
              login details, IP address and details on the time spent on various
              pages of our Website) and device and browser information (such as
              the type of device, universally unique identifiers (‘UUID’),
              advertising identifiers (‘IDFA’), type of browser, operating
              system, hardware and processor information, plug-ins and
              add-ons).<br />
              Similar to other websites, our Website may utilise browser cookies
              (small text files stored on a user’s web browser when you visit a
              website), web beacons and similar tracking technologies
              (collectively, Cookies) to collect and store certain information
              when you use, access, or interact with our Website. We may, for
              example, use Cookies to collect information about the type of
              device you use to access the Website or our Services, your browser
              type, your IP address or other identifier, your general geographic
              location as indicated by your IP address, features you access and
              whether and how you interact with content.<br />
              We use Cookies to remember your preferences and settings, to
              remember information that you may enter online, to generate
              aggregate statistics about how people use our Website and
              Services, to help you share content with others and to improve
              your experience of our Website and Services.<br />
              You can choose how Cookies are handled by your device through your
              browser or device settings, including refusing or deleting all
              Cookies. If you choose not to receive Cookies at any time,
              websites may not function properly and certain services may not be
              provided. Each browser and device is different, so check the
              settings menu of the browser or device you are using to learn how
              to change your advertising settings and Cookie preferences. <br />
              Information we may collect from third party sources <br />
              We may receive information about you from other sources, including
              third parties that help us update, expand, and analyse our
              records, prevent or detect fraud or other suspicious activities
              and process payments. In addition, our Services may also include
              integrated content or links to content provided by third parties
              (such as live chat, social media content, plug-ins and
              applications) – see the section entitled “Third party services and
              content” below.<br />
              How we use the information we collect<br />
              We may use the information we collect:<br /><br />
              • to conduct know-your-client and anti-money laundering and other
              sanctions checks (or to verify those carried out by third party
              sources);<br />
              • to provide you with our Services and other services that you
              request including, as applicable, processing your payment and any
              other services to be provided to you;<br />
              • to respond to your enquiries or to any problems that may arise
              (such as navigating our Services or accessing certain services or
              features); <br />
              • to inform you of important changes or developments to our
              Services or policies and to provide you with technical, support or
              administrative notifications;<br />
              • to collect payments from you;<br />
              • with your separate consent, to send you marketing
              communications, and other information or materials that may be of
              interest you or which you have expressed an interest in receiving
              (and subject to your ability to opt-out from receiving those
              communications); <br />
              • to maintain our list of contacts; <br />
              • to understand how individuals use our Services, including by
              generating and analysing statistics and user trends, and to
              evaluate, administer, maintain and improve our Website and
              Services;<br />
              • for internal development of new products or services;<br />
              • for our internal business purposes, including data analysis,
              invoicing and detecting, preventing, and responding to actual or
              potential fraud, illegal activities, or intellectual property
              infringement; <br />
              • to assess the effectiveness of our promotional campaigns and
              publications; and<br />
              • as we believe reasonably necessary, advisable or appropriate to
              comply with our legal or regulatory obligations and to respond to
              legal, regulatory, arbitration or government process or requests
              for information issued by government authorities or other third
              parties or to protect your, our, or others’ rights.<br /><br />
              Further, we may aggregate personal and other data captured through
              our Website so that the data is no longer capable of identifying
              an individual. We reserve the right to use this aggregated
              information for the purposes of improving and enhancing our
              services, generating insights, for use in marketing to other users
              and current and potential partners and otherwise for the purposes
              of our business. Provided that such aggregated data does not
              directly or indirectly identify you as an individual, this data is
              not considered to be personal information for the purpose of this
              Notice.<br />
              How we may share the information we collect<br />
              We may share the personal information we collect with our current
              or future affiliated entities, as explained at the beginning of
              this Notice. <br />
              We may also disclose information we collect:<br /><br />
              • To our partners and third party service providers that perform
              services on our behalf such as marketing companies, web-hosting
              companies, analytics providers and information technology
              providers. In these circumstances contractual and other technical
              and security safeguards will be put in place with the partner or
              service provider, including to ensure that your personal
              information is processed only in accordance with this Notice.<br />
              • To law enforcement, other government authorities, or third
              parties (within or outside the jurisdiction in which you reside)
              as may be permitted or required by the laws of any jurisdiction
              that may apply to us, as provided for under contract, as we deem
              reasonably necessary to provide legal services or if we believe
              your actions are inconsistent with our agreements and policies. In
              these circumstances, we will take reasonable efforts to notify you
              before we disclose information that may reasonably identify you or
              your organisation, unless prior notice is prohibited by applicable
              law or is not possible or reasonable in the circumstances. <br />
              • To service providers, advisors, potential transactional
              partners, or other third parties in connection with the
              consideration, negotiation, or completion of a transaction in
              which we are acquired by or merged with another company or we
              sell, liquidate, or transfer all or a portion of our assets. Upon
              completion of such a transaction, your personal information will
              continue to be processed in accordance with this Notice, except as
              otherwise agreed by you or permitted by applicable law.<br />
              • To partners, financial institutions or service providers who may
              request such information in connection with providing services to
              us, including banking services, and only where we enter into an
              agreement with such institutions to limit their use and handling
              of personal information in accordance with this Notice.<br />
              • To our employees where required or necessary for the performance
              of their duties and in line with the reasons for processing. Our
              employees are required to keep that information confidential and
              are not permitted to use it for any purposes other than to enable
              you to use the Services or to deal with requests which you submit
              to us.<br />
              We do not sell, rent, or otherwise share personal information that
              reasonably identifies you or your organisation with unaffiliated
              entities for their independent use except as expressly described
              in this Notice or with your prior permission. We may share
              information that does not reasonably identify you or your
              organisation as permitted by applicable law.<br />
              When you voluntarily make your personal information available
              online in an environment shared by third parties (for example, on
              messaging applications, social media, message boards, web logs, or
              emails), that personal information may be viewed, saved,
              collected, heard, used and/or shared by others. We are not
              responsible for any unauthorised third party use of information
              provided in these contexts. Please be mindful whenever you share
              any information in such environments. <br />
              Grounds for using your personal information<br />
              We rely on the following legal grounds to process your personal
              information, namely:<br /><br />
              • Necessity for performance of a contract – We may need to collect
              and use your personal information to enter into a contract with
              you or to perform a contract that you have with us, for example,
              when you provide personal information to us to use our
              Services;<br />
              • Legal obligation – We may process your personal information as
              may be required to comply with any legal or regulatory obligations
              that may apply to us, for instance under anti-money laundering and
              sanctions regimes;<br />
              • Legitimate interests – We may use your personal information for
              our legitimate interests to improve our Services. Consistent with
              our legitimate interests and any consents that may be required
              under applicable laws, we may use technical information as
              described in this Notice and use personal information for our
              marketing purposes provided that those interests are not
              outweighed by your interests, rights and freedoms.<br />
              • Consent - To withdraw your consent to such use, you can contact
              [dataprivacy@wormholes.org/dataprivacy@wormholes.com]. The
              electronic marketing communications we send to you also contain
              opt-out mechanisms that allow you to opt-out from receiving those
              communications, update your contact information or change your
              preferences at any time. You may be able to disable the sharing of
              location information in your browser settings. Where required by
              applicable laws, we will rely on your consent for direct marketing
              and to collect information from your device or computer.
              <br /><br />
              Third party services and content<br />
              Our Website and Services may include integrated content or links
              to content provided by third parties (such as video materials,
              social media content, plug-ins and applications). <br />
              Please note that the websites, applications and services of third
              parties (including affiliates, partners, sponsors, advertisers or
              other persons) will be governed by the privacy settings, policies,
              and/or procedures of the third party, which may differ from this
              Notice. This Notice does not address, and we are not responsible
              for or able to control, the privacy, security, or other practices
              of such third parties. <br />
              Protection and storage of the information we collect<br />
              We deploy administrative, technical and physical safeguards
              designed to comply with applicable legal requirements and to
              safeguard the information that we collect. This includes, when
              required or appropriate and feasible, obtaining written assurances
              from third parties that may access your personal information that
              they will protect the information with safeguards designed to
              provide a level of protection equivalent to that adopted by us.
              <br />
              However, no information system can be 100% secure. So, we cannot
              guarantee the absolute security of your information. Moreover, we
              are not responsible for the security of information you transmit
              to us over networks that we do not control, including the internet
              and wireless networks.<br />
              We may store the information we collect in on our servers both
              cloud based or in servers located in countries where we or our
              service providers have facilities. Therefore, we may transfer
              information to countries outside of your country of residence
              which may have data protection laws and regulations that differ
              from those in your country. <br />
              We retain the information we collect for no longer than is
              reasonably necessary to fulfil the purposes for which we collect
              the information and to comply with our legal obligations. <br />
              Your choices and rights<br />
              To withdraw your consent to the use of your information as
              described in this Notice you can contact us through the methods
              stated below. Please note that in some circumstances this may mean
              that we can no longer provide our Services to you. <br />
              If you no longer wish to receive marketing communications from us,
              you can also let us know via through the methods stated below. The
              electronic marketing communications we send to you also contain
              opt-out mechanisms that allow you to opt-out from receiving those
              communications, update your contact information or change your
              preferences at any time. We will honour your choice and refrain
              from sending you such announcements. You may also opt back in to
              receive those communications at any time. <br />
              Under local law, you may have certain rights regarding your
              personal information that we have collected, including that EU
              residents have the right to request: (i) access to your personal
              information, (ii) rectification or erasure of personal
              information, (iii) restriction of processing concerning you, (iv)
              objection to processing that is based upon our legitimate
              interests, and (v) data portability to other service providers.
              Your ability to exercise these rights will depend on a number of
              factors and, in some instances, we will not be able to comply with
              your request, for example because we have legitimate grounds for
              not doing so or where the right doesn’t apply to the particular
              information we hold on you. Where so entitled to access to your
              personal information, you will not have to pay a fee unless your
              request is clearly unfounded, repetitive or excessive (upon which
              we may charge a reasonable fee or refuse to comply with your
              request). If you would like to discuss or exercise the rights you
              may have, you can contact us through the methods stated below.
              <br />
              It is important that any personal information we hold about you is
              accurate and current<br />
              Please keep us informed if your personal information changes
              whilst we continue to retain such information. We encourage you to
              contact us to update or correct your information if it changes or
              if you believe that any information that we have collected about
              you is inaccurate or out of date. You can also ask us to see what
              personal information we hold about you and to erase your personal
              information if it is no longer required. You may also tell us if
              you object to our use of your personal information.<br />
              How to contact us<br />
              We welcome your enquiries and comments. <br />
              If you would like to contact us regarding this Notice or to
              withdraw your consent to this Notice or any aspect of it, please
              send us an email at
              dataprivacy@wormholes.org/dataprivacy@wormholes.com.<br />
              We try to respond to all legitimate enquiries within 30 days.
              Occasionally it may take us longer if your request is particularly
              complex or you have made a number of requests. In this case, we
              will notify you and keep you updated.<br />
              Complaints<br />
              We are committed to working with you to obtain a fair resolution
              of any complaint or concern about your privacy. If you would like
              to contact us, please use the methods stated above.<br />
              If, however, you believe that we have not been able to assist with
              your complaint or concern, you may have the right to complain to
              the data protection authority/regulator, as applicable, in your
              jurisdiction. <br />
              Changes to this Notice<br />
              We may update this Notice from time to time and we encourage you
              to periodically review this Notice. If we make any material
              changes to this Notice regarding the way we collect, use, and/or
              share the personal information that you have provided, we will
              notify you by posting notice of the changes in a clear and
              conspicuous manner on our Website or, if we hold your email
              address, by email.<br />
              The use of certain of our Services may also be governed by other
              applicable terms and policies regarding privacy and the sharing of
              personal information, which supplement, and should be reviewed
              alongside, this Notice.<br />
              Governing Law & Dispute Resolution<br />
              This Notice shall be governed by, and construed, in accordance
              with the laws of British Virgin Islands, without regard to any
              conflict of law’s provisions. In the event of any disputes,
              controversies, or differences arising out of or in connection with
              this Notice (hereinafter, "Dispute"), the Dispute shall be
              submitted to the non-exclusive jurisdiction of the courts of
              British Virgin Islands.<br />
              <br />
            </div>
          </div>
        </div>

        <div class="h-20 nullele" ref="nullEle"></div>
        <div :class="`argee-box ${showBtn ? 'show' : ''}`" v-if="hasSelect">
          <div class="flex left">
            <van-checkbox
              shape="square"
              icon-size="14px"
              :disabled="checkDisabled"
              v-model="checked1"
            />
            <div class="tit-check f-12 ml-10 lh-16">
              I have read and accept the Wormholes Terms of Service
            </div>
          </div>
          <div class="mt-16">
            <van-button
              round
              block
              type="primary"
              :disabled="btnDisabled"
              @click="toback"
              >I Agree {{ count <= 0 ? "" : `(${count}s)` }}</van-button
            >
          </div>
        </div>
      </div>
    </div>
  </van-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  Ref,
  ref,
  watch,
  SetupContext,
  computed,
  reactive,
  nextTick,
  onMounted,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToggleAccount } from "@/components/accountModal/hooks/toggleAccount";
import { Icon, Dialog, Button, Loading, Toast, Checkbox } from "vant";
import AccountIcon from "@/components/accountIcon/index.vue";
import { decimal } from "@/utils/filters";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import WormTransition from "@/components/wromTransition/index.vue";

export default defineComponent({
  name: "Privacypolicy",
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [Button.name]: Button,
    [Loading.name]: Loading,
    [Checkbox.name]: Checkbox,
    AccountIcon,
    WormTransition,
  },
  emits: ["select", "update:show"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    hasClose: {
      type: Boolean,
      default: true,
    },
    hasSelect: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: any, context: SetupContext) {
    const { emit }: any = context;
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const i18n = useI18n();
    const { dispatch } = store;
    const { t } = useI18n();
    let showService = ref(false);
    const checkDisabled = computed(() => {
      if (count.value == 0) {
        return false;
      }
      return true;
    });
    const showBtn = ref(true);
    const checked1: Ref<boolean> = ref(false);
    const btnDisabled = computed(() => {
      if (checked1.value == true) {
        return false;
      }
      return true;
    });
    watch(
      () => props.show,
      (now: any) => {
        console.log(now);
        if (now) {
          showService.value = true;
          countdown();
        }
      }
    );
    watch(
      () => checked1.value,
      (now) => {
        console.log(now);
        if (!now) {
          emit("select", false);
        }
      }
    );
    watch(
      () => showService.value,
      (n) => {
        emit("update:show", n);
      }
    );
    let timer: any = null;
    let count = ref(1);
    // Click 180 seconds later
    function countdown() {
      if (count.value != 0) {
        clearInterval(timer);
        timer = setInterval(() => {
          count.value = count.value - 1;
          if (count.value <= 0) {
            clearInterval(timer);
            timer = null;
            //  btnDisabled.value=true
          }
        }, 1000);
      }
    }
    const toback = () => {
      emit("select", true);
      showService.value = false;
    };

    const closeModal = () => {
      showService.value = false;
    };
    return {
      showService,
      checked1,
      toback,
      btnDisabled,
      closeModal,
      count,
      showBtn,
      checkDisabled,
    };
  },
});
</script>
<style lang="scss" scoped>
.worm-box-out {
  width: 75px;
  padding: 21px 0 0 15px;
}
.terms-content {
  padding: 0 15px;
}
.text-inner {
  height: calc(100% - 140px);
  overflow-y: scroll;
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
    // background: #F8FCFF;
    padding: 0 15px;
    line-height: 34px;
    font-size: 24px;
  }
  .paragraph {
    overflow: normal;
  }
  .tit-small {
    padding-top: 16px;
    font-size: 14px;
    font-weight: bold;
  }
}
.text-info {
  position: relative;
  height: 80vh;
  overflow-y: scroll;
  .icon-cuowu {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #bdbfc1;
  }
}

:deep(.van-dialog) {
  border-radius: 0 !important;
}
:deep() {
  .dialog-box {
    border-radius: 0 !important;
  }
  .icon-box {
    margin-top: 0;
  }
  .van-checkbox {
    overflow: inherit;
    display: flex;
    align-items: flex-start;
  }
}
.dialog-box {
  border-radius: 0 !important;
}
.nullele {
  margin-bottom: 105px;
}
.tit-check {
  color: #8f8f8f;
}
.argee-box {
  opacity: 0;
  position: fixed;
  background: #fff;
  padding: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 10px;
  transition: ease 0.6s;
  &.show {
    opacity: 1;
  }
}
:deep(.dialog-box) {
  .dialog-box {
    border-radius: 0 !important;
  }
  .icon-box {
    margin-top: 0;
  }
}
</style>