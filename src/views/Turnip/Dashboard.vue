<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'
import { filters } from '@/plugins/vue-filter'
import { useAppStore } from '@/store'
import { momentUtil } from '@/utils'

const props = withDefaults(defineProps<{
  groupList?: any[]
  priceList?: any[]
  histories?: any[]
}>(), {
  groupList: () => [],
  priceList: () => [],
  histories: () => [],
})

const weekdays = momentUtil.getWeekdays()

function createSellPrice() {
  return weekdays.reduce<Record<string, { am: string, pm: string }>>((result, item) => {
    result[item.id] = {
      am: '',
      pm: '',
    }
    return result
  }, {})
}

const router = useRouter()
const appStore = useAppStore()
const { profile } = storeToRefs(appStore)

const showHistory = shallowRef(false)
const historyItem = ref<any | null>(null)

const filterGroupList = computed(() => {
  return props.groupList.filter(item => item.members.includes(profile.value?.userId))
})

const filterHistories = computed(() => {
  return props.histories.filter((item, index) => index < 3)
})

const item = computed(() => {
  return {
    profile: profile.value,
    ...(props.priceList.find(entry => entry.id === profile.value?.userId) || {
      buyPrice: '',
      sellPrice: createSellPrice(),
    }),
  }
})

function goDetails(group: any) {
  router.push({ name: 'TurnipGroupDetails', params: { id: group.id } })
}

function openHistory(history: any) {
  historyItem.value = history
  showHistory.value = true
}
</script>

<template>
  <div class="turnip-dashboard">
    <section v-if="item.profile" class="app-surface app-section turnip-dashboard__profile-card">
      <div class="turnip-dashboard__profile-head">
        <div class="turnip-dashboard__profile-main">
          <van-image
            v-if="item.profile.pictureUrl"
            class="turnip-dashboard__avatar"
            :src="item.profile.pictureUrl"
            width="56"
            height="56"
            round
            lazy-load
          />
          <div>
            <div class="turnip-dashboard__profile-name">
              {{ item.profile.displayName }}
            </div>
            <div class="little-text">
              買價：{{ item.buyPrice || '--' }}
            </div>
          </div>
        </div>
      </div>
      <TurnipSellPrice :sell-price="item.sellPrice" />
      <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
    </section>

    <section v-else class="app-surface app-empty app-section">
      本週次還沒提供任何菜價唷
    </section>

    <section class="app-section">
      <div class="turnip-dashboard__section-head">
        <div class="app-section-title">
          已加入群組
        </div>
        <div class="little-text">
          {{ filterGroupList.length }} 個群組
        </div>
      </div>

      <div class="turnip-dashboard__group-list">
        <button
          v-for="group in filterGroupList"
          :key="group.id"
          type="button"
          class="turnip-dashboard__group-card app-surface"
          @click="goDetails(group)"
        >
          <div class="turnip-dashboard__group-name">
            {{ group.name }}
          </div>
          <div class="little-text">
            {{ group.members.length }} 位成員
          </div>
        </button>
      </div>
    </section>

    <section class="app-section">
      <div class="turnip-dashboard__section-head">
        <div class="app-section-title">
          歷史紀錄
        </div>
        <router-link v-if="histories.length > 3" class="turnip-dashboard__history-link" :to="{ name: 'TurnipHistories' }">
          查看更多
        </router-link>
      </div>

      <div class="turnip-dashboard__history-list">
        <button
          v-for="history in filterHistories"
          :key="history.id"
          type="button"
          class="turnip-dashboard__history-card app-surface"
          @click="openHistory(history)"
        >
          <div class="turnip-dashboard__history-title">
            {{ filters.formatWeekRange(history.id) }}
          </div>
          <div class="little-text">
            {{ filters.formatYear(history.id) }} 第{{ filters.formatWeek(history.id) }}
          </div>
          <div class="turnip-dashboard__history-buy">
            買價 {{ history.buyPrice || '--' }}
          </div>
        </button>
      </div>
    </section>

    <van-popup
      v-model:show="showHistory"
      position="bottom"
      closeable
      :style="{ height: '70%' }"
    >
      <div v-if="historyItem">
        <van-divider>{{ filters.formatWeekRange(historyItem.id) }}</van-divider>
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
.turnip-dashboard__profile-card {
  padding: 20px;
}

.turnip-dashboard__profile-head {
  margin-bottom: 14px;
}

.turnip-dashboard__profile-main {
  display: flex;
  gap: 14px;
  align-items: center;
}

.turnip-dashboard__profile-name,
.turnip-dashboard__group-name,
.turnip-dashboard__history-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--van-text-color);
}

.turnip-dashboard__section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.turnip-dashboard__group-list,
.turnip-dashboard__history-list {
  display: grid;
  gap: 12px;
}

.turnip-dashboard__group-card,
.turnip-dashboard__history-card {
  width: 100%;
  padding: 16px 18px;
  border: 0;
  text-align: left;
}

.turnip-dashboard__history-buy {
  margin-top: 10px;
  font-size: 14px;
  color: var(--van-text-color);
}

.turnip-dashboard__history-link {
  color: var(--van-primary-color);
}
</style>
