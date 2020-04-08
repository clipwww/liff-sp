<template>
  <div>
    <van-notice-bar background="#ecf9ff" left-icon="volume-o">
      <span class="margin-r-15">{{ weekdays[0].label }} ~ {{ weekdays[weekdays.length - 1].label }}</span>
      <span>南北菜蟲一起串連</span>
    </van-notice-bar>

    <van-panel class="margin-b-15" v-for="item in dataList" :key="item.id">
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
        ></van-image>
        <div slot="title">{{ item.profile.displayName }}</div>
        <div slot="label" class="little-text">買價：{{ item.buyPrice }}</div>
      </van-cell>
      <van-grid :column-num="6">
        <van-grid-item v-for="(key, index) in Object.keys(item.sellPrice)" :key="key">
          <div class="little-text">{{ weekdays[index].momentInstance.format('ddd') }}</div>
          <div class="margin-bt-10">{{ item.sellPrice[key].am || '--' }}</div>
          <div>{{ item.sellPrice[key].pm || '--' }}</div>
        </van-grid-item>
      </van-grid>
      <div class="padding-bt-10">
        <TurnipLineChart :id="item.id" :buyPrice="item.buyPrice" :sellPrice="item.sellPrice" />
      </div>
    </van-panel>
  </div>
</template>



<script>
import moment from 'moment';

import { turnipSVC } from '@/services';
import { momentUtil } from '@/utils';

import TurnipLineChart from '@/components/TurnipLineChart.vue';

const weekStart = momentUtil.getWeekStart();
const weekdays = momentUtil.getWeekdays();
const now = moment();

export default {
  components: {
    TurnipLineChart,
  },
  data() {
    return {
      buyDay: weekStart.format('M/D (ddd)'),
      weekdays,

      list: [],
      userList: [],
    };
  },
  computed: {
    dataList() {
      return this.list
        .map(item => {
          const user = this.userList.find(u => u.id === item.id);

          return {
            ...item,
            profile: user || {},
          };
        })
        .sort((a, b) => {
          const w = now.weekday();

          const aPrice = a?.sellPrice[`w${w}`][now.format('a')] ?? 0;
          const bPrice = a?.sellPrice[`w${w}`][now.format('b')] ?? 0;

          return aPrice > bPrice ? -1 : 1;
        });
    },
  },
  created() {
    this.getPriceList();
    this.getUserList();
  },
  methods: {
    async getPriceList() {
      this.list = await turnipSVC.getPriceList(weekStart);
    },
    async getUserList() {
      this.userList = await turnipSVC.getUserList();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>