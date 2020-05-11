<template>
  <div class="list__container">
    <van-cell-group title="歷史紀錄"></van-cell-group>
    <div title="歷史紀錄" class="list__content">
      <van-list :finished="isFinished" finished-text="没有更多了" @load="onLoad">
        <van-panel class="margin-b-15" v-for="item in filterHistories" :key="item.id">
          <van-cell slot="header" center>
            <div slot="title" class="fs-18">{{ item.id }}</div>
            <div slot="label">買價：{{ item.buyPrice }}</div>
          </van-cell>
          <TurnipSellPrice :sellPrice="item.sellPrice" />
          <div class="padding-bt-10">
            <TurnipLineChart :id="item.id" :buyPrice="item.buyPrice" :sellPrice="item.sellPrice" />
          </div>
        </van-panel>
      </van-list>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

import { momentUtil } from '@/utils';

import TurnipLineChart from '@/components/TurnipLineChart.vue';
import TurnipSellPrice from '@/components/TurnipSellPrice.vue';

const weekdays = momentUtil.getWeekdays();
const sellPrice = {};
weekdays.forEach(item => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  };
});

export default {
  components: {
    TurnipLineChart,
    TurnipSellPrice,
  },
  props: {
    histories: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      page: 1,
      isFinished: false,
    };
  },
  computed: {
    filterHistories() {
      return this.histories.slice(0, this.page * 2);
    },
  },
  methods: {
    onLoad() {
      if (this.isFinished) {
        return;
      }
      this.page += 1;
      if (this.filterHistories.length === this.histories.length) {
        this.isFinished = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 110px);
}
</style>
