<template>
  <div>
    <van-notice-bar text="南北菜蟲一起串連，就是這麼簡單！" background="#ecf9ff" left-icon="volume-o" />

    <van-panel class="margin-b-15" v-for="item in list" :key="item.id">
      <div slot="header" class="padding-a-10">
        <div>{{ item.id }}</div>
        <div class="little-text">買價：{{ item.buyPrice }}</div>
      </div>
      <van-grid :column-num="6">
        <van-grid-item v-for="key in Object.keys(item.sellPrice)" :key="key">
          <div>{{ item.sellPrice[key].am || '--' }}</div>
          <van-divider />
          <div>{{ item.sellPrice[key].pm || '--' }}</div>
        </van-grid-item>
      </van-grid>
    </van-panel>
  </div>
</template>

<script>
import moment from 'moment';

import { turnipSVC } from '@/services';

const weekStart = moment().startOf('week');

export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getPriceList();
  },
  methods: {
    async getPriceList() {
      this.list = await turnipSVC.getPriceList(weekStart);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>