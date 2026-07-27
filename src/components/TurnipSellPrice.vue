<script setup lang="ts">
import { computed } from 'vue'
import { momentUtil } from '@/utils'

const props = withDefaults(defineProps<{
  sellPrice?: Record<string, { am?: string, pm?: string }>
}>(), {
  sellPrice: () => ({}),
})

const weekdays = momentUtil.getWeekdays()

const entries = computed(() => {
  return Object.keys(props.sellPrice).map((key, index) => {
    return {
      key,
      dayLabel: weekdays[index]?.momentInstance.format('ddd') ?? key,
      am: props.sellPrice?.[key]?.am || '--',
      pm: props.sellPrice?.[key]?.pm || '--',
    }
  })
})
</script>

<template>
  <div class="sell-price-grid">
    <div v-for="entry in entries" :key="entry.key" class="sell-price-grid__item">
      <div class="sell-price-grid__day">
        {{ entry.dayLabel }}
      </div>
      <div class="sell-price-grid__slot">
        <span class="little-text">AM</span>
        <strong>{{ entry.am }}</strong>
      </div>
      <div class="sell-price-grid__slot">
        <span class="little-text">PM</span>
        <strong>{{ entry.pm }}</strong>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sell-price-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  padding: 0 16px 16px;
}

.sell-price-grid__item {
  padding: 14px 10px;
  border-radius: 16px;
  background: var(--van-gray-1);
  text-align: center;
}

.sell-price-grid__day {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--van-text-color-2);
}

.sell-price-grid__slot {
  display: grid;
  gap: 4px;
}

.sell-price-grid__slot + .sell-price-grid__slot {
  margin-top: 10px;
}

@media (max-width: 640px) {
  .sell-price-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
