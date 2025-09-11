<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showNotify, showToast } from 'vant'
import moment from 'moment'
import _cloneDeep from 'lodash/cloneDeep'

import { turnipSVC } from '@/services'
import { copyValue, momentUtil } from '@/utils'
import { useMainStore } from '@/store'

import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'

// Props
interface Props {
  userList: any[]
  priceList: any[]
}

const props = withDefaults(defineProps<Props>(), {
  userList: () => [],
  priceList: () => [],
})

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const weekStart = momentUtil.getWeekStart()
const weekdays = momentUtil.getWeekdays()
const now = moment()

const sellPrice: any = {}
weekdays.forEach((item) => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  }
})

// 響應式數據
const group = ref(null)
const showEditor = ref(false)
const form = ref({
  groupName: '',
  isPrivate: false,
  password: '',
})

// 計算屬性
const profile = computed(() => store.profile)
const groupId = computed(() => route.params.id)
const filterPriceList = computed(() => {
  return props.userList
    .filter(item => group.value?.members?.includes(item.id))
    .map((user) => {
      const price = props.priceList.find(p => p.id === user.id) || {
        buyPrice: '',
        sellPrice: _cloneDeep(sellPrice),
      }

      return {
        ...price,
        profile: user,
      }
    })
    .sort((a, b) => {
      try {
        const w = now.weekday()
        if (w <= 0) {
          return (+a.buyPrice || 110) > (+b.buyPrice || 110) ? 1 : -1
        }
        // am 或 pm
        const key = now.locale('en-us').format('a')

        const aPrice = +a?.sellPrice[`w${w}`][key] || 0
        const bPrice = +b?.sellPrice[`w${w}`][key] || 0
        console.log(aPrice, bPrice)

        return aPrice > bPrice ? -1 : 1
      } catch (err) {
        console.log(err)
        return 1
      }
    })
})
const isCreator = computed(() => {
  // 創造群組之人
  return group.value?.creatorId === profile.value.userId
})

// 監聽器
watch(showEditor, (bool: boolean) => {
  if (bool && group.value) {
    form.value.groupName = group.value.name
    form.value.isPrivate = !!group.value.password
    form.value.password = group.value.password
  }
})

// 生命週期
onMounted(() => {
  turnipSVC.listenerGroupById(groupId.value, (groupData: any) => {
    group.value = groupData

    if (!group.value?.members?.includes(profile.value.userId)) {
      // 不在群組內
      router.replace({ name: 'TurnipGroup' })
    }
  })
})

onBeforeUnmount(() => {
  turnipSVC.removeListenerGroupById(groupId.value)
})

// 方法
async function removeMembers(userId: string) {
  try {
    await showDialog({
      title: '確定嗎？',
    })

    const members = group.value.members.filter((id: string) => id !== userId)

    await turnipSVC.updateGroup(groupId.value, {
      ...group.value,
      members,
    })

    showNotify({
      type: 'success',
      message: '成功',
    })
  } catch (err) {
    console.log(err)
  }
}

async function onSubmit() {
  try {
    await turnipSVC.updateGroup(groupId.value, {
      ...group.value,
      name: form.value.groupName,
      password: form.value.isPrivate ? form.value.password : '',
    })

    showEditor.value = false
    showNotify({
      type: 'success',
      message: '修改成功',
    })
  } catch (err) {
    console.log(err)
  }
}

async function removeGroup() {
  try {
    await showDialog({
      title: '注意，此動作無法復原',
      message: '確定要刪除群組？',
    })

    await turnipSVC.removeGroup(groupId.value)
  } catch (err) {
    console.log(err)
  }
}

function copyLink() {
  const isOk = copyValue(`https://liff.line.me/1557984400-gjEoY0y1/liff-sp${route.fullPath}`)
  if (isOk) {
    showToast({
      message: '已複製群組網址',
      duration: 700,
    })
  }
}
</script>

<template>
  <div>
    <van-skeleton
      v-if="!group"
      class="padding-bt-15"
      title
      avatar
      avatar-size="50"
      :row="6"
      :loading="!group"
    />
    <div v-else>
      <van-cell
        class="margin-b-15"
        :title="group.name"
        :border="false"
        center
      >
        <div slot="label">
          <van-icon name="user-o" />
          <span class="margin-l-5">{{ group.members.length }}</span>
        </div>
        <div slot="right-icon">
          <van-button
            v-if="isCreator"
            class="margin-r-5"
            type="primary"
            size="small"
            @click="showEditor = true"
          >
            編輯
          </van-button>
          <van-button
            v-else
            class="margin-r-5"
            type="danger"
            size="mini"
            @click="removeMembers(profile.userId)"
          >
            退出
          </van-button>
          <van-button
            class="padding-lr-5"
            type="primary"
            size="mini"
            plain
            @click="copyLink"
          >
            複製網址
          </van-button>
        </div>
      </van-cell>
      <van-panel v-for="item in filterPriceList" :key="item.id" class="margin-b-15">
        <van-cell slot="header">
          <van-image
            v-if="item.profile.pictureUrl"
            slot="icon"
            class="margin-r-15"
            :src="item.profile.pictureUrl"
            width="50"
            height="50"
            round
            lazy-load
          />
          <div slot="title">
            {{ item.profile.displayName }}
          </div>
          <div slot="label" class="little-text">
            買價：{{ item.buyPrice }}
          </div>
          <div v-if="isCreator && item.id !== profile.userId" slot="right-icon">
            <van-button type="danger" size="mini" @click="removeMembers(item.id)">
              移出
            </van-button>
          </div>
        </van-cell>
        <TurnipSellPrice :sell-price="item.sellPrice" />
        <div class="padding-bt-10">
          <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
        </div>
      </van-panel>

      <van-popup
        v-model="showEditor"
        position="bottom"
        closeable
        :style="{ height: '70%' }"
      >
        <div class="padding-a-10">
          <van-button type="danger" size="mini" @click="removeGroup">
            刪除群組
          </van-button>
        </div>
        <div>
          <van-divider>編輯群組</van-divider>
          <van-form @submit="onSubmit">
            <van-field
              v-model="form.groupName"
              name="群組名稱"
              label="群組名稱"
              placeholder="請填寫群組名稱"
              :rules="[{ required: true, message: '請填寫群組名稱' }]"
            />
            <van-field name="switch" label="私密群組">
              <template #input>
                <van-switch v-model="form.isPrivate" size="20" />
              </template>
            </van-field>
            <van-field
              v-if="form.isPrivate"
              v-model="form.password"
              name="群組密碼"
              label="群組密碼"
              placeholder="請填寫群組密碼"
              :rules="[{ required: true, message: '請填寫群組密碼' }]"
            />
            <div class="padding-a-15">
              <van-button
                type="primary"
                round
                block
                native-type="submit"
              >
                送出
              </van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
