<script setup lang="ts">
import Chart from 'chart.js/auto'
import _zip from 'lodash/zip'
import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { momentUtil } from '@/utils'
import {
  averageReducer,
  minWeekReducer,
  patternMapping,
  patternReducer,
  possiblePatterns,
} from '@/utils/predictions.js'

const props = withDefaults(defineProps<{
  id?: string
  buyPrice?: number | string
  sellPrice?: Record<string, { am?: string, pm?: string }>
}>(), {
  id: () => `${Date.now()}`,
  buyPrice: 0,
  sellPrice: () => ({}),
})

const canvasRef = useTemplateRef('canvas')
let chartInstance: Chart | null = null

const labels = computed(() => {
  const result: string[] = []
  momentUtil
    .getWeekdays()
    .map(item => item.momentInstance.format('ddd'))
    .forEach((label) => {
      result.push(`${label} 上午`)
      result.push(`${label} 下午`)
    })

  return result
})

const datasetData = computed(() => {
  const result: Array<number | undefined> = []
  Object.keys(props.sellPrice).forEach((key) => {
    result.push(+props.sellPrice[key].am! || 0)
    result.push(+props.sellPrice[key].pm! || 0)
  })

  return result.map(num => num || undefined)
})

const possibilities = computed(() => {
  const buyPrice = +props.buyPrice
  const filter = [buyPrice || undefined, ...datasetData.value]

  let patterns = possiblePatterns(filter)
  const patternCount = patterns.reduce((acc, cur) => acc + cur.length, 0)
  if (patternCount === 0) {
    patterns = possiblePatterns([0, ...filter.slice(1)])
  }

  const minMaxPattern = patternReducer(patterns)
  const minMaxData = _zip(...minMaxPattern)
  patternReducer(patterns, averageReducer)
  patternReducer(patterns, minWeekReducer)

  return {
    patterns,
    minMaxData,
  }
})

const patternsPercentage = computed(() => {
  const total = possibilities.value.patterns.reduce((sum, current) => sum + current.length, 0)

  return possibilities.value.patterns
    .map((pattern, index) => {
      return {
        id: index,
        label: patternMapping[index],
        percentage: pattern.length ? Math.round((pattern.length / total) * 100) : 0,
      }
    })
    .filter(item => item.percentage)
})

const isShort = computed(() => datasetData.value.filter(value => value && value > 0).length < 2)
const noSellPrice = computed(() => !datasetData.value.some(value => value && value > 0))

watch(() => props.buyPrice, initChart)
watch(() => props.sellPrice, initChart, { deep: true })

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  chartInstance?.destroy()
})

function initChart() {
  if (noSellPrice.value) {
    chartInstance?.destroy()
    chartInstance = null
    return
  }

  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  chartInstance?.destroy()

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: '買入價格',
          borderColor: '#1989fa',
          data: Array.from({ length: 12 }).fill(props.buyPrice),
          pointRadius: 0,
          pointHoverRadius: 0,
          borderDash: [2, 5],
        },
        {
          label: '每日賣價',
          borderColor: '#f97316',
          backgroundColor: '#f97316',
          data: datasetData.value,
        },
        {
          label: '預測最高賣價',
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.16)',
          data: possibilities.value.minMaxData[1] ?? [],
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: 3,
        },
        {
          label: '預測最低賣價',
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.08)',
          data: possibilities.value.minMaxData[0] ?? [],
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#4b5563',
          },
        },
        tooltip: {
          intersect: false,
          mode: 'index',
        },
      },
      scales: {
        y: {
          display: true,
          min: 0,
          ticks: {
            color: '#6b7280',
            stepSize: 50,
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.25)',
          },
        },
        x: {
          display: true,
          ticks: {
            color: '#6b7280',
          },
          grid: {
            color: 'rgba(148, 163, 184, 0.18)',
          },
        },
      },
    },
  })
}
</script>

<template>
  <div class="chart">
    <template v-if="!noSellPrice">
      <div class="text-center margin-bt-5">
        <span v-for="item in patternsPercentage" :key="item.id" class="margin-lr-5">
          <span>{{ item.label }}</span>
          <span class="little-text">{{ item.percentage }}%</span>
        </span>
      </div>
      <div v-if="isShort" class="text-center little-text margin-b-5">
        預測結果僅供參考
      </div>
      <canvas ref="canvas" />
    </template>
    <div v-else class="text-center little-text">
      尚無提供賣價，無法預測
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px 16px;
}
</style>
