<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'
import { filters } from '@/plugins/vue-filter'

const props = withDefaults(defineProps<{
  histories?: any[]
}>(), {
  histories: () => [],
})

const page = shallowRef(1)
const isFinished = shallowRef(false)

const filterHistories = computed(() => {
  return props.histories.slice(0, page.value * 2)
})

function onLoad() {
  if (isFinished.value) {
    return
  }

  page.value += 1
  if (filterHistories.value.length === props.histories.length) {
    isFinished.value = true
  }
}
</script>

<template>
  <div class="list__container">
    <div title="歷史紀錄" class="list__content with-safe-area-inset-bottom">
      <van-list
        :finished="isFinished"
        finished-text="没有更多了"
        :offset="10"
        @load="onLoad"
      >
        <section v-for="item in filterHistories" :key="item.id" class="app-surface turnip-history-card margin-b-15">
          <div class="turnip-history-card__head">
            <div>
              <div class="turnip-history-card__title">
                {{ filters.formatWeekRange(item.id) }}
              </div>
              <div class="little-text">
                {{ filters.formatYear(item.id) }}
              </div>
            </div>
            <div class="turnip-history-card__buy">
              買價 {{ item.buyPrice || '--' }}
            </div>
          </div>
          <TurnipSellPrice :sell-price="item.sellPrice" />
          <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
        </section>
      </van-list>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 105px);
}

.turnip-history-card__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.turnip-history-card {
  padding: 20px;
}

.turnip-history-card__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 12px;
}

.turnip-history-card__buy {
  font-size: 14px;
  color: var(--van-text-color);
}
</style>
