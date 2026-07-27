<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { showFailToast } from 'vant'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import TurnipEditorPopup from '@/components/TurnipEditorPopup.vue'
import dayjs from '@/plugins/dayjs'
import { turnipSVC } from '@/services'
import { useAppStore } from '@/store'
import { momentUtil } from '@/utils'

const weekdays = momentUtil.getWeekdays()
const weekStart = momentUtil.getWeekStart()

const appStore = useAppStore()
const { isLoggedIn, profile } = storeToRefs(appStore)

const showEditor = shallowRef(false)
const groupList = ref<any[]>([])
const priceList = ref<any[]>([])
const userList = ref<any[]>([])
const histories = ref<any[]>([])
const isLoading = shallowRef(false)

watch(profile, (value) => {
  if (!value?.userId) {
    histories.value = []
    return
  }

  turnipSVC.removeListenerHistoriesByUserId()
  turnipSVC.listenerHistoriesByUserId(value.userId, (list) => {
    histories.value = list
      .filter(item => !dayjs().isSame(item.id, 'week'))
      .sort((a, b) => (dayjs(a.id).isBefore(b.id) ? 1 : -1))
  })
}, { immediate: true })

onMounted(() => {
  initListener()
})

onBeforeUnmount(() => {
  turnipSVC.removeListenerGroupList()
  turnipSVC.removeListenerUserList()
  turnipSVC.removeListenerPriceList(weekStart)
  turnipSVC.removeListenerHistoriesByUserId()
})

async function initListener() {
  isLoading.value = true

  await Promise.all([
    turnipSVC.listenerGroupList((list) => {
      groupList.value = list
    }),
    turnipSVC.listenerPriceList(weekStart, (list) => {
      priceList.value = list
    }),
    turnipSVC.listenerUserList((list) => {
      userList.value = list
    }),
  ])

  isLoading.value = false
}

function openEditor() {
  if (!isLoggedIn.value) {
    showFailToast({
      message: '必須要登入才可以使用唷',
    })
    return
  }

  showEditor.value = true
}

function login() {
  window.liff.login({
    redirectUri: window.location.href,
  })
}
</script>

<template>
  <div class="with-safe-area-inset-bottom">
    <van-notice-bar background="#ecf9ff" left-icon="volume-o">
      <span class="margin-r-15">{{ weekdays[0].label }} ~ {{ weekdays[weekdays.length - 1].label }}</span>
      <span>南北菜蟲一起串連</span>
    </van-notice-bar>

    <div v-if="!isLoggedIn" class="padding-a-10">
      <van-button
        type="primary"
        size="large"
        block
        @click="login"
      >
        請先登入
      </van-button>
    </div>
    <div v-else-if="isLoading">
      <van-skeleton class="padding-bt-15" title :row="6" />
    </div>
    <div v-else>
      <router-view
        :group-list="groupList"
        :price-list="priceList"
        :user-list="userList"
        :histories="histories"
      />
    </div>

    <TurnipEditorPopup v-model="showEditor" />

    <van-tabbar fixed route safe-area-inset-bottom>
      <van-tabbar-item icon="chart-trending-o" :to="{ name: 'TurnipDashboard' }">
        儀表板
      </van-tabbar-item>
      <van-tabbar-item icon="friends" :to="{ name: 'TurnipGroup' }">
        群組列表
      </van-tabbar-item>
      <van-tabbar-item icon="edit" @click="openEditor">
        紀錄本週價格
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
</style>
