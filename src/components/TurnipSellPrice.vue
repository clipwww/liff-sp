<script>
import { momentUtil } from '@/utils'

const weekdays = momentUtil.getWeekdays()

export default {
  props: {
    sellPrice: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      weekdays,
    }
  },
}
</script>

<template>
  <van-grid :column-num="6">
    <van-grid-item v-for="(key, index) in Object.keys(sellPrice)" :key="key">
      <div class="little-text">
        {{ weekdays[index].momentInstance.format('ddd') }}
      </div>
      <div class="margin-bt-10">
        {{ sellPrice[key].am || '--' }}
      </div>
      <div>{{ sellPrice[key].pm || '--' }}</div>
    </van-grid-item>
  </van-grid>
</template>

<style lang="scss" scoped>
</style>
