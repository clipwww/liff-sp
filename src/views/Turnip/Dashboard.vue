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
  </div>
</template>


<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

import { turnipSVC } from '@/services';
import { momentUtil } from '@/utils';

import TurnipLineChart from '@/components/TurnipLineChart.vue';

const weekdays = momentUtil.getWeekdays();

export default {
  components: {
    TurnipLineChart,
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
        ...this.priceList.find(item => item.id === this.profile.userId),
      };
    },
  },
  methods: {
    goDetails(item) {
      this.$router.push({ name: 'TurnipGroupDetails', params: { id: item.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>