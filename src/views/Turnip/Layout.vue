<template>
  <div class="with-safe-area-inset-bottom">
    <van-notice-bar background="#ecf9ff" left-icon="volume-o">
      <span class="margin-r-15">{{ weekdays[0].label }} ~ {{ weekdays[weekdays.length - 1].label }}</span>
      <span>南北菜蟲一起串連</span>
    </van-notice-bar>

    <div v-if="isLoggedIn">
      <router-view :groupList="groupList" :priceList="priceList" :userList="userList"></router-view>
    </div>
    <div v-else class="padding-a-10">
      <van-button type="primary" size="large" block @click="login">請先登入</van-button>
    </div>

    <van-popup v-model="showEditor" position="bottom" closeable :style="{ height: '90%' }">
      <div class="padding-t-30">
        <TurnipEditor v-if="showEditor" @success="showEditor = false" />
      </div>
    </van-popup>

    <van-tabbar fixed route safe-area-inset-bottom>
      <van-tabbar-item icon="chart-trending-o" :to="{ name: 'TurnipDashboard' }">儀表板</van-tabbar-item>
      <van-tabbar-item icon="friends" :to="{ name: 'TurnipGroup' }">群組列表</van-tabbar-item>
      <van-tabbar-item icon="edit" @click="openEditor">紀錄本週價格</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { momentUtil } from '@/utils';
import { turnipSVC } from '@/services';

import TurnipEditor from '@/components/TurnipEditor.vue';

const weekdays = momentUtil.getWeekdays();
const weekStart = momentUtil.getWeekStart();

export default {
  components: {
    TurnipEditor,
  },
  data() {
    return {
      weekdays,
      showEditor: false,
      groupList: [],
      priceList: [],
      userList: [],
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
  },
  created() {
    turnipSVC.listenerGroupList(list => {
      this.groupList = list;
    });

    turnipSVC.listenerPriceList(weekStart, list => {
      this.priceList = list;
    });

    turnipSVC.listenerUserList(list => {
      this.userList = list;
    });
  },
  beforeDestroy() {
    turnipSVC.removeListenerGroupList();
    turnipSVC.removeListenerUserList();
    turnipSVC.removeListenerPriceList(weekStart);
  },
  methods: {
    openEditor() {
      if (!this.isLoggedIn) {
        this.$toast.fail({
          message: `必須要登入才可以使用唷`,
        });
        return;
      }
      this.showEditor = true;
    },
    login() {
      window.liff.login({
        redirectUri: window.location.href,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>