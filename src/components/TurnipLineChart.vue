<template>
  <canvas :id="canvasId"></canvas>
</template>

<script>
import Chart from 'chart.js';

import { momentUtil } from '@/utils';

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
        return {};
      },
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  computed: {
    canvasId() {
      return `canvas-${this.id}`;
    },
    labels() {
      const tempArr = [];
      momentUtil
        .getWeekdays()
        .map(item => item.momentInstance.format('ddd'))
        .forEach(label => {
          tempArr.push(`${label} 上午`);
          tempArr.push(`${label} 下午`);
        });

      return tempArr;
    },
    datasetData() {
      const tempArr = [];
      Object.keys(this.sellPrice).forEach(key => {
        tempArr.push(this.sellPrice[key].am || 0);
        tempArr.push(this.sellPrice[key].pm || 0);
      });
      return tempArr;
    },
  },
  watch: {
    buyPrice() {
      this.initChart();
    },
    sellPrice: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.initChart();
        });
      },
    },
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const ctx = document.getElementById(this.canvasId).getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              label: '賣出價格',
              borderColor: '#00c300',
              data: this.datasetData,
            },
            {
              label: '買入價格',
              borderColor: '#ffffff',
              pointStyle: 'line',
              data: Array(12).fill(this.buyPrice),
            },
          ],
        },
        options: {
          responsive: true,
          legend: {
            display: true,
          },
          scales: {
            yAxes: [
              {
                display: true,
                ticks: {
                  min: 0,
                  stepSize: 5, // <----- This prop sets the stepSize
                },
              },
            ],
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
