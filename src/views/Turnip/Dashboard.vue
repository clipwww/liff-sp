<script>
import { mapGetters } from 'vuex'

import { momentUtil } from '@/utils'

import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'

const weekdays = momentUtil.getWeekdays()
const sellPrice = {}
weekdays.forEach((item) => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  }
})

export default {
  components: {
    TurnipLineChart,
    TurnipSellPrice,
  },

  props: {
    groupList: {
      type: Array,
      default() {
        return []
      },
    },
    priceList: {
      type: Array,
      default() {
        return []
      },
    },
    histories: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      weekdays,

      showHistory: false,
      historyItem: null,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    filterGroupList() {
      return this.groupList.filter(item => item.members.includes(this.profile.userId))
    },
    filterHistories() {
      return this.histories.filter((item, index) => index < 3)
    },
    item() {
      return {
        profile: this.profile,
        ...(this.priceList.find(item => item.id === this.profile.userId) || {
          buyPrice: '',
          sellPrice,
        }),
      }
    },
  },
  methods: {
    goDetails(item) {
      this.$router.push({ name: 'TurnipGroupDetails', params: { id: item.id } })
    },
    openHistory(item) {
      console.log(item)
      this.historyItem = item
      this.showHistory = true
    },
  },
}
</script>

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
        />
        <div slot="title">
          {{ item.profile.displayName }}
        </div>
        <div slot="label" class="little-text">
          買價：{{ item.buyPrice }}
        </div>
      </van-cell>
      <TurnipSellPrice :sell-price="item.sellPrice" />
      <div class="padding-bt-10">
        <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
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
      <van-cell
        v-for="item in filterHistories"
        :key="item.id"
        center
        is-link
        @click="openHistory(item)"
      >
        <div slot="title">
          {{ item.id | formatWeekRange }}
        </div>
        <div slot="label">
          {{ item.id | formatYear }} 第{{ item.id | formatWeek }}
        </div>
      </van-cell>
      <van-cell
        v-if="histories.length > 3"
        is-link
        center
        title
        label="查看更多"
        :to="{ name: 'TurnipHistories' }"
      />
    </van-cell-group>

    <van-popup
      v-model="showHistory"
      position="bottom"
      closeable
      :style="{ height: '70%' }"
    >
      <div v-if="historyItem">
        <van-divider>{{ historyItem.id | formatWeekRange }}</van-divider>
        <div class="little-text padding-a-10">
          買價：{{ historyItem.buyPrice }}
        </div>
        <TurnipSellPrice :sell-price="historyItem.sellPrice" />
        <TurnipLineChart
          :id="historyItem.id"
          :buy-price="historyItem.buyPrice"
          :sell-price="historyItem.sellPrice"
        />
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
</style>
