<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { showToast } from 'vant'
import moment from 'moment'

import { momentUtil } from '@/utils'
import { turnipSVC } from '@/services'
import { useMainStore } from '@/store'

import TurnipEditorPopup from '@/components/TurnipEditorPopup.vue'

const weekdays = momentUtil.getWeekdays()
const weekStart = momentUtil.getWeekStart()

const store = useMainStore()

// 響應式數據
const showEditor = ref(false)
const groupList = ref([])
const priceList = ref([])
const userList = ref([])
const histories = ref([])
const isLoading = ref(false)

// 計算屬性
const isLoggedIn = computed(() => store.isLoggedIn)
const profile = computed(() => store.profile)

// 監聽器
watch(profile, (val: any) => {
  if (!val || !val.userId) {
    return
  }
  turnipSVC.removeListenerHistoriesByUserId()
  turnipSVC.listenerHistoriesByUserId(val.userId, (list: any) => {
    histories.value = list
      .filter((item: any) => !moment().isSame(item.id, 'week'))
      .sort((a: any, b: any) => (moment(a.id).isBefore(b.id) ? 1 : -1))
  })
}, { immediate: true })

// 生命週期
onMounted(() => {
  initListener()
})

onBeforeUnmount(() => {
  turnipSVC.removeListenerGroupList()
  turnipSVC.removeListenerUserList()
  turnipSVC.removeListenerPriceList(weekStart)
  turnipSVC.removeListenerHistoriesByUserId()
})

// 方法
async function initListener() {
  isLoading.value = true

  await Promise.all([
    turnipSVC.listenerGroupList((list: any) => {
      groupList.value = list
    }),
    turnipSVC.listenerPriceList(weekStart, (list: any) => {
      priceList.value = list
    }),
    turnipSVC.listenerUserList((list: any) => {
      userList.value = list
    }),
  ])
  // console.log(groupList.value)

  isLoading.value = false
}

function openEditor() {
  if (!isLoggedIn.value) {
    showToast({
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
