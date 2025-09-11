<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { momentUtil } from '@/utils'
import { useMainStore } from '@/store'

import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'

// Props
interface Props {
  groupList: any[]
  priceList: any[]
  histories: any[]
}

const props = withDefaults(defineProps<Props>(), {
  groupList: () => [],
  priceList: () => [],
  histories: () => [],
})

const router = useRouter()
const store = useMainStore()

// 響應式數據
const weekdays = momentUtil.getWeekdays()
const sellPrice: any = {}
weekdays.forEach((item) => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  }
})

const showHistory = ref(false)
const historyItem = ref(null)

// 計算屬性
const profile = computed(() => store.profile)
const filterGroupList = computed(() => {
  return props.groupList.filter(item => item.members.includes(profile.value.userId))
})
const filterHistories = computed(() => {
  return props.histories.filter((item, index) => index < 3)
})
const item = computed(() => {
  return {
    profile: profile.value,
    ...(props.priceList.find(item => item.id === profile.value.userId) || {
      buyPrice: '',
      sellPrice,
    }),
  }
})

// 方法
function goDetails(groupItem: any) {
  router.push({ name: 'TurnipGroupDetails', params: { id: groupItem.id } })
}

function openHistory(history: any) {
  console.log(history)
  historyItem.value = history
  showHistory.value = true
}

function formatWeekRange(weekId: string) {
  // 這裡需要實現格式化邏輯，根據 momentUtil 或其他工具
  return weekId
}

function formatYear(weekId: string) {
  // 這裡需要實現格式化邏輯
  return weekId
}

function formatWeek(weekId: string) {
  // 這裡需要實現格式化邏輯
  return weekId
}
</script>

<template>
  <div>
    <van-panel v-if="item">
      <template #header>
        <van-cell>
          <template #icon>
            <van-image
              v-if="item.profile.pictureUrl"
              class="margin-r-15"
              :src="item.profile.pictureUrl"
              width="50"
              height="50"
              round
              lazy-load
            />
          </template>
          <template #title>
            {{ item.profile.displayName }}
          </template>
          <template #label>
            <div class="little-text">
              買價：{{ item.buyPrice }}
            </div>
          </template>
        </van-cell>
      </template>
      <TurnipSellPrice :sell-price="item.sellPrice" />
      <div class="padding-bt-10">
        <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
      </div>
    </van-panel>
    <van-panel v-else>
      <template #header>
        <div class="text-center padding-bt-30">
          <van-icon class="fs-30" name="info" />
          <div>本週次還沒提供任何菜價唷</div>
        </div>
      </template>
    </van-panel>

    <van-cell-group title="已加入群組">
      <van-cell
        v-for="groupItem in filterGroupList"
        :key="groupItem.id"
        :title="groupItem.name"
        center
        is-link
        clickable
        @click="goDetails(groupItem)"
      >
        <template #label>
          <van-icon name="user-o" />
          <span class="margin-l-5">{{ groupItem.members.length }}</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="歷史紀錄">
      <van-cell
        v-for="hist in filterHistories"
        :key="hist.id"
        center
        is-link
        @click="openHistory(hist)"
      >
        <template #title>
          {{ formatWeekRange(hist.id) }}
        </template>
        <template #label>
          {{ formatYear(hist.id) }} 第{{ formatWeek(hist.id) }}
        </template>
      </van-cell>
      <van-cell
        v-if="props.histories.length > 3"
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
        <van-divider>{{ formatWeekRange(historyItem.id) }}</van-divider>
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
