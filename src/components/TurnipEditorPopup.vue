<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import moment from 'moment'
import { showNotify } from 'vant'
import { useMainStore } from '@/store'

import { turnipSVC } from '@/services'
import { momentUtil } from '@/utils'

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const store = useMainStore()

// Props
interface Props {
  value: boolean
}

// 計算屬性
const isLoggedIn = computed(() => store.isLoggedIn)
const profile = computed(() => store.profile)

const isOpen = computed({
  get: () => props.value,
  set: (value: boolean) => emit('update:modelValue', value),
})

// 響應式數據
const weekStart = momentUtil.getWeekStart()
const weekdays = momentUtil.getWeekdays()

const sellPrice = ref<Record<string, { am: string; pm: string }>>({})
const buyPrice = ref('')
const islandName = ref('')
const isLoading = ref(false)
const showBtn = ref(false)
const buyDay = ref(weekStart.format('M/D (ddd)'))

// 初始化 sellPrice
weekdays.forEach((item) => {
  sellPrice.value[item.id] = {
    am: '',
    pm: '',
  }
})

// Watch
watch(isOpen, (bool) => {
  if (bool) {
    getTurnipPrice()
  }
}, { immediate: true })

// Methods
async function getTurnipPrice() {
  isLoading.value = true
  const data = await turnipSVC.getPriceByUserId(profile.value.userId, weekStart)

  if (data) {
    const { buyPrice: buyPriceData, sellPrice: sellPriceData } = data
    buyPrice.value = buyPriceData
    Object.assign(sellPrice.value, sellPriceData)
  }
  isLoading.value = false
  focusField()
}

async function updateTurnipPrice() {
  try {
    isLoading.value = true
    await Promise.all([
      turnipSVC.updatePriceByUserId(profile.value.userId, weekStart, {
        buyPrice: buyPrice.value,
        sellPrice: sellPrice.value,
      }),
      updateProfileByUserId(),
    ])

    showNotify({
      type: 'success',
      message: '儲存成功',
    })
    emit('success')
    isOpen.value = false
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}

async function updateProfileByUserId() {
  try {
    await turnipSVC.updateProfileByUserId(profile.value.userId, profile.value)
  } catch (err) {
    console.log(err)
  }
}

function focusField() {
  nextTick(() => {
    try {
      if (moment().isSame(weekStart, 'day')) {
        return
      }

      let offsetCount = 0

      const now = moment()
      const w = now.weekday()
      const key = now.locale('en-us').format('a')
      console.log('[key]', key)

      offsetCount = w * 2
      if (key === 'am') {
        offsetCount -= 1
      }

      // TODO: 需要實現 focus 邏輯
      // const popupElement = document.querySelector('.van-popup')
      // if (popupElement) {
      //   popupElement.scrollTo(0, 50 * offsetCount)
      // }
    } catch (err) {
      console.log(err)
    }
  })
}
</script>

<template>
  <van-popup
    ref="popup"
    v-model="isOpen"
    position="bottom"
    closeable
    lazy-render
    :style="{ height: '90%' }"
    @opened="showBtn = true"
    @close="showBtn = false"
  >
    <div class="padding-t-30">
      <div class="editor">
        <van-cell-group>
          <div slot="title" class="fs-20">
            {{ buyDay }}
          </div>
          <van-field
            v-model="buyPrice"
            type="digit"
            label="買入價格"
            placeholder="請輸入週日買入價格"
            :disabled="isLoading"
          />
        </van-cell-group>

        <van-cell-group v-for="(item) in weekdays" :key="item.id" :title="item.label">
          <van-field
            :ref="`${item.id}am`"
            v-model="sellPrice[item.id].am"
            type="digit"
            label="上午賣價"
            :placeholder="`請輸入 ${item.label} 上午賣價`"
            :disabled="isLoading"
          />
          <van-field
            :ref="`${item.id}pm`"
            v-model="sellPrice[item.id].pm"
            type="digit"
            label="下午賣價"
            :placeholder="`請輸入 ${item.label} 下午賣價`"
            :disabled="isLoading"
          />
        </van-cell-group>

        <div class="fixed-btn">
          <van-button
            v-show="showBtn"
            button
            type="primary"
            round
            block
            :disabled="isLoading"
            @click="updateTurnipPrice"
          >
            送出
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.editor {
  position: relative;
  padding-bottom: calc(env(safe-area-inset-bottom) + 95px);
}
.fixed-btn {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 15px);
  left: 15px;
  right: 15px;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>
