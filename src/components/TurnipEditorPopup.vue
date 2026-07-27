<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { showNotify } from 'vant'
import { nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import dayjs from '@/plugins/dayjs'
import { turnipSVC } from '@/services'
import { useAppStore } from '@/store'
import { momentUtil } from '@/utils'

const emit = defineEmits<{
  success: []
}>()

const isOpen = defineModel<boolean>({ required: true })

const weekStart = momentUtil.getWeekStart()
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

const popupRef = useTemplateRef('popup')

const appStore = useAppStore()
const { profile } = storeToRefs(appStore)

const buyPrice = shallowRef('')
const sellPrice = ref(createSellPrice())
const isLoading = shallowRef(false)
const showBtn = shallowRef(false)

watch(isOpen, async (opened) => {
  if (!opened || !profile.value?.userId) {
    return
  }

  await getTurnipPrice()
}, { immediate: true })

async function getTurnipPrice() {
  if (!profile.value?.userId) {
    return
  }

  isLoading.value = true
  const data = await turnipSVC.getPriceByUserId(profile.value.userId, weekStart)

  buyPrice.value = data?.buyPrice ?? ''
  sellPrice.value = {
    ...createSellPrice(),
    ...(data?.sellPrice ?? {}),
  }

  isLoading.value = false
  await focusField()
}

async function updateTurnipPrice() {
  if (!profile.value?.userId) {
    return
  }

  try {
    isLoading.value = true
    await Promise.all([
      turnipSVC.updatePriceByUserId(profile.value.userId, weekStart, {
        buyPrice: buyPrice.value,
        sellPrice: sellPrice.value,
      }),
      turnipSVC.updateProfileByUserId(profile.value.userId, profile.value),
    ])

    showNotify({
      type: 'success',
      message: '儲存成功',
    })
    emit('success')
    isOpen.value = false
  }
  catch (err) {
    console.log(err)
  }
  finally {
    isLoading.value = false
  }
}

async function focusField() {
  await nextTick()

  try {
    if (dayjs().isSame(weekStart, 'day')) {
      return
    }

    let offsetCount = 0

    const now = dayjs()
    const weekday = now.weekday()
    const periodKey = now.locale('en-us').format('a')

    offsetCount = weekday * 2
    if (periodKey === 'am') {
      offsetCount -= 1
    }

    popupRef.value?.$el?.scrollTo(0, 50 * offsetCount)
  }
  catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <van-popup
    ref="popup"
    v-model:show="isOpen"
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
          <template #title>
            <div class="fs-20">
              {{ buyDay }}
            </div>
          </template>
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
