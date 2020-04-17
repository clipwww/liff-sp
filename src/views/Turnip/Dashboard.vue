<template>
  <div>
    <van-panel v-if="item">
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
      <TurnipSellPrice :sellPrice="item.sellPrice" />
      <div class="padding-bt-10">
        <TurnipLineChart :id="item.id" :buyPrice="item.buyPrice" :sellPrice="item.sellPrice" />
      </div>
    </van-panel>
    <van-panel v-else>
      <div slot="header">
        <div class="text-center padding-bt-30">
          <van-icon class="fs-30" name="info" />
          <div>本週次還沒提供任何菜價唷</div>
        </div>
      </div>
    </van-panel>

    <van-cell-group title="已加入群組">
      <van-cell
        v-for="item in filterGroupList"
        :key="item.id"
        :title="item.name"
        center
        is-link
        clickable
        @click="goDetails(item)"
      >
        <div slot="label">
          <van-icon name="user-o" />
          <span class="margin-l-5">{{ item.members.length }}</span>
        </div>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="歷史紀錄">
      <van-cell v-for="item in histories" :key="item.id" center is-link @click="openHistory(item)">
        <div slot="title">{{ item.id }}</div>
        <div slot="label">第{{ item.id | formatWeek }}</div>
      </van-cell>
    </van-cell-group>

    <van-popup v-model="showHistory" position="bottom" closeable :style="{ height: '70%' }">
      <div v-if="historyItem">
        <van-divider>{{ historyItem.id }}</van-divider>
        <div class="little-text padding-a-10">買價：{{ historyItem.buyPrice }}</div>
        <TurnipSellPrice :sellPrice="historyItem.sellPrice" />
        <TurnipLineChart
          :id="historyItem.id"
          :buyPrice="historyItem.buyPrice"
          :sellPrice="historyItem.sellPrice"
        />
      </div>
    </van-popup>
  </div>
</template>


<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

import { turnipSVC } from '@/services';
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
  filters: {
    formatWeek(val) {
      return moment(val).format('wo');
    },
  },
  props: {
    groupList: {
      type: Array,
      default() {
        return [];
      },
    },
    priceList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      weekdays,

      histories: [],
      showHistory: false,
      historyItem: null,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    filterGroupList() {
      return this.groupList.filter(item => item.members.includes(this.profile.userId));
    },
    item() {
      return {
        profile: this.profile,
        ...(this.priceList.find(item => item.id === this.profile.userId) || {
          buyPrice: '',
          sellPrice,
        }),
      };
    },
  },
  created() {
    turnipSVC.listenerHistoriesByUserId(this.profile.userId, list => {
      this.histories = list
        .filter(item => !moment().isSame(item.id, 'week'))
        .sort((a, b) => (moment(a.id).isBefore(b.id) ? 1 : -1));
    });
  },
  beforeDestroy() {
    turnipSVC.removeListenerHistoriesByUserId();
  },
  methods: {
    goDetails(item) {
      this.$router.push({ name: 'TurnipGroupDetails', params: { id: item.id } });
    },
    openHistory(item) {
      console.log(item);
      this.historyItem = item;
      this.showHistory = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>