<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

import { momentUtil } from '@/utils'
import { turnipSVC } from '@/services'

import TurnipEditorPopup from '@/components/TurnipEditorPopup.vue'

const weekdays = momentUtil.getWeekdays()
const weekStart = momentUtil.getWeekStart()

export default {
  components: {
    TurnipEditorPopup,
  },
  data() {
    return {
      weekdays,
      showEditor: false,
      groupList: [],
      priceList: [],
      userList: [],
      histories: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
  },
  watch: {
    profile: {
      immediate: true,
      handler(val) {
        if (!val || !val.userId) {
          return
        }
        turnipSVC.removeListenerHistoriesByUserId()
        turnipSVC.listenerHistoriesByUserId(val.userId, (list) => {
          this.histories = list
            .filter(item => !moment().isSame(item.id, 'week'))
            .sort((a, b) => (moment(a.id).isBefore(b.id) ? 1 : -1))
        })
      },
    },
  },
  created() {
    this.initListener()
  },
  beforeUnmount() {
    turnipSVC.removeListenerGroupList()
    turnipSVC.removeListenerUserList()
    turnipSVC.removeListenerPriceList(weekStart)
    turnipSVC.removeListenerHistoriesByUserId()
  },
  methods: {
    async initListener() {
      this.isLoading = true

      const ret = await Promise.all([
        turnipSVC.listenerGroupList((list) => {
          this.groupList = list
        }),
        turnipSVC.listenerPriceList(weekStart, (list) => {
          this.priceList = list
        }),
        turnipSVC.listenerUserList((list) => {
          this.userList = list
        }),
      ])
      // console.log(ret, this.groupList)

      this.isLoading = false
    },
    openEditor() {
      if (!this.isLoggedIn) {
        this.$toast.fail({
          message: '必須要登入才可以使用唷',
        })
        return
      }
      this.showEditor = true
    },
    login() {
      window.liff.login({
        redirectUri: window.location.href,
      })
    },
  },
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
