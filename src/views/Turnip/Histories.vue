<script>
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
    histories: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      page: 1,
      isFinished: false,
    }
  },
  computed: {
    filterHistories() {
      return this.histories.slice(0, this.page * 2)
    },
  },
  methods: {
    onLoad() {
      if (this.isFinished) {
        return
      }
      console.log('on load')
      this.page += 1
      if (this.filterHistories.length === this.histories.length) {
        this.isFinished = true
      }
    },
  },
}
</script>

<template>
  <div class="list__container">
    <van-cell-group title="歷史紀錄" />
    <div title="歷史紀錄" class="list__content with-safe-area-inset-bottom">
      <van-list
        :finished="isFinished"
        finished-text="没有更多了"
        :offset="10"
        @load="onLoad"
      >
        <van-panel v-for="item in filterHistories" :key="item.id" class="margin-b-15">
          <van-cell slot="header" center>
            <div slot="title">
              <span class="fs-18">{{ item.id | formatWeekRange }}</span>
              <span class="little-text margin-l-5">{{ item.id | formatYear }}</span>
            </div>
            <div slot="label">
              買價：{{ item.buyPrice }}
            </div>
          </van-cell>
          <TurnipSellPrice :sell-price="item.sellPrice" />
          <div class="padding-bt-10">
            <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
          </div>
        </van-panel>
      </van-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 105px);
}
</style>
