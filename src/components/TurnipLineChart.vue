<script>
import Chart from 'chart.js/auto'
import _zip from 'lodash/zip'

import { momentUtil } from '@/utils'
import {
  averageReducer,
  minWeekReducer,
  patternMapping,
  patternReducer,
  possiblePatterns,
} from '@/utils/predictions.js'

export default {
  props: {
    id: {
      type: String,
      default: `${+new Date()}`,
    },
    buyPrice: {
      type: [Number, String],
      default: 0,
    },
    sellPrice: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      chartInstance: null,
    }
  },
  computed: {
    canvasId() {
      return `canvas-${this.id}`
    },
    labels() {
      const tempArr = []
      momentUtil
        .getWeekdays()
        .map(item => item.momentInstance.format('ddd'))
        .forEach((label) => {
          tempArr.push(`${label} 上午`)
          tempArr.push(`${label} 下午`)
        })

      return tempArr
    },
    datasetData() {
      const tempArr = []
      Object.keys(this.sellPrice).forEach((key) => {
        tempArr.push(+this.sellPrice[key].am || 0)
        tempArr.push(+this.sellPrice[key].pm || 0)
      })
      return tempArr.map(num => num || undefined)
    },
    possibilities() {
      const buyPrice = +this.buyPrice
      const filter = [buyPrice || undefined, ...this.datasetData]
      console.log(filter)

      let patterns = possiblePatterns(filter)
      const patternCount = patterns.reduce((acc, cur) => acc + cur.length, 0)
      if (patternCount === 0) {
        patterns = possiblePatterns([0, ...filter.slice(1)])
      }

      const minMaxPattern = patternReducer(patterns)
      const minMaxData = _zip(...minMaxPattern)
      const avgPattern = patternReducer(patterns, averageReducer)
      const avgData = _zip(...avgPattern)
      const [minWeekValue] = patternReducer(patterns, minWeekReducer)

      return {
        patterns,
        minMaxData,
        minWeekValue,
      }
    },
    patternsPercentage() {
      const { patterns } = this.possibilities

      const total = patterns.reduce((pre, cur) => (pre += cur.length), 0)

      return patterns
        .map((p, i) => {
          return {
            id: i,
            label: patternMapping[i],
            percentage: p.length ? Math.round((p.length / total) * 100) : 0,
          }
        })
        .filter(item => item.percentage)
    },
    isShort() {
      return this.datasetData.filter(v => v > 0).length < 2
    },
    noSellPrice() {
      return !this.datasetData.filter(v => v > 0).length
    },
  },
  watch: {
    buyPrice() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    sellPrice: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.initChart()
        })
      },
    },
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      if (this.noSellPrice) {
        // 無賣價 尚無法預測
        return
      }

      if (this.chartInstance) {
        this.chartInstance.destroy()
      }

      const ctx = document.getElementById(this.canvasId).getContext('2d')
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: '買入價格',
              borderColor: '#ffffff',
              data: Array.from({ length: 12 }).fill(this.buyPrice),
              pointRadius: 0,
              pointHoverRadius: 0,
              borderDash: [2, 5],
            },
            // {
            //   label: '保證價格',
            //   data: new Array(12).fill(this.possibilities?.minWeekValue || null),
            //   fill: true,
            //   borderColor: '#007D75',
            //   pointRadius: 0,
            //   pointHoverRadius: 0,
            //   borderDash: [3, 6],
            // },
            {
              label: '每日賣價',
              borderColor: '#EF8341',
              // backgroundColor: '#EF8341',
              data: this.datasetData,
            },
            {
              label: '預測最高賣價',
              borderColor: '#A5D5A5',
              backgroundColor: '#A5D5A5',
              data: this.possibilities?.minMaxData[1] ?? [],
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: 3,
            },
            {
              label: '預測最低賣價',
              borderColor: '#88C9A1',
              backgroundColor: '#88C9A1',
              data: this.possibilities?.minMaxData[0] ?? [],
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
                color: '#fff',
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
                color: '#fff',
                stepSize: 50,
              },
              grid: {
                color: '#666',
              },
            },
            x: {
              display: true,
              ticks: {
                color: '#fff',
              },
              grid: {
                color: '#666',
              },
            },
          },
        },
      })
    },
  },
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
      <canvas :id="canvasId" />
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
}
</style>
