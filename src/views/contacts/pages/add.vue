<template>
  <van-sticky>
    <NavHeader title="Close" :hasRight="true">
      <template v-slot:title>
        <div class="flex center title">{{t('setting.contacts')}}</div>
      </template>
    </NavHeader>
  </van-sticky>
  <div class="contacts-add">
    <div class="mt-16">
      <van-form @submit="onSubmit">
        <div class="label text-bold">{{ t("contacts.name") }}</div>
        <van-field
          v-model="params.name"
          maxlength="12"
          :placeholder="$t('contacts.entername')"
          :rules="[
            {
              required: true,
              message: t('contacts.namecannotbeempty'),
            },
          ]"
        />
        <div class="label text-bold">{{ t("contacts.address") }}</div>
        <van-field
          v-model="params.address"
          :placeholder="$t('contacts.enteraddress')"
          maxlength="50"
          :rules="[
            { required: true, message: t('contacts.addresscannotbeempty') },
            { validator: asyncaddress, message: t('contacts.wrongaddressformat') },
          ]"
        />
        <div class="label text-bold">{{ t("contacts.memo") }}</div>
        <van-field v-model="params.memo" maxlength="30" :placeholder="$t('contacts.entermemo')" />
        <!-- Add a Contact -->
        <div class="flex center btn-groups" v-if="!query.address">
          <van-button block type="primary" native-type="submit">
            {{
            t("addNetwork.add")
            }}
          </van-button>
        </div>

        <!-- Edit Contact -->
        <div class="flex center btn-groups" v-else>
          <van-button block class="mr-10" @click="handleDelete">{{ t("contacts.delete") }}</van-button>
          <van-button block type="primary" native-type="submit">{{ t("contacts.submit") }}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { toRaw } from 'vue'
import { Icon, Toast, Button, Sticky, Field, Dialog, Form } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import NetWorkCard from '@/popup/components/netWorkCard/index.vue'
import { defineComponent, Ref, ref, watch, SetupContext } from 'vue'
import { useStore } from 'vuex'
import { utils } from 'ethers'
import { regEnglish } from '@/popup/enum/regexp'
import router from '@/popup/router'
import { useI18n } from 'vue-i18n'
import { getRandomIcon, guid } from '@/popup/utils'
import NavHeader from '@/popup/components/navHeader/index.vue'
import { useBroadCast } from '@/popup/utils/broadCost'

export default {
  name: 'contacts-add',
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Form.name]: Form,
    [Icon.name]: Icon,
    NavHeader
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const { dispatch } = store
    const { query } = useRoute()
    const { state, commit } = store
    const params: any = ref({
      name: '',
      address: '',
      memo: '',
      icon: getRandomIcon(),
      id: ''
    })
        // Listen to the broadcast of the same source window
    const { handleUpdate } = useBroadCast()

    if (query.address) {
      params.value = query
    }
    const name: Ref<string> = ref('')
    const address: Ref<string> = ref('')
    const memo: Ref<string> = ref('')

    const asyncaddress = (val: string) => {
      try {
        utils.getAddress(val)
        return true
      } catch (err) {
        return false
      }
    }
    const handleDelete = () => {
      Dialog.confirm({
        title: t('contacts.hint'),
        message: t('contacts.sureyouwanttodelete', { name: query.name })
      }).then(async () => {
        // on confirm
        try {
          await dispatch(`account/deleteContact`, query.id)
          handleUpdate()
          Toast(t('contacts.contactdeletedsuccessfully'))
          router.back()
        } catch (err) {
          Toast(err)
        }
      })
    }
    const onSubmit = async () => {
      const opt = { ...params.value, icon: getRandomIcon(), id: query.id || guid() }

      try {
        await store.dispatch(`account/${query.address ? 'modifContact' : 'addContacts'}`, opt)
        handleUpdate()
        Toast(query.address ? t('contacts.editedsuccessfully') : t('contacts.addedsuccessfully'))
        router.back()
      } catch (err: any) {
        Toast(err)
      }
    }
    return {
      t,
      onSubmit,
      asyncaddress,
      name,
      address,
      memo,
      query,
      params,
      handleDelete,
    }
  }
}
</script>
<style lang="scss" scoped>
.contacts-add {
  padding: 0 22px;

  .label {
    font-size: 12px;
    line-height: 16px;
    margin-bottom: 10px;
  }

  .btn-groups {
    margin-top: 30px;
  }
  :deep(.van-field__label) {
    display: none;
  }
  :deep(.van-field__error-message) {
    margin-bottom: 12px;
  }
  :deep(.van-cell:after) {
    display: none;
  }
  :deep(.van-cell) {
    padding: 0;
  }
  :deep(.van-field__body) {
    margin-bottom: 10px;
    &:hover {
      border: 1PX solid #1989fa;
    }
  }
}
</style>