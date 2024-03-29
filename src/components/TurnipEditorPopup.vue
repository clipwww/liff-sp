<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

import { turnipSVC } from '@/services'
import { momentUtil } from '@/utils'

const weekStart = momentUtil.getWeekStart()
const weekdays = momentUtil.getWeekdays()

const sellPrice = {}
weekdays.forEach((item) => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  }
})

export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      buyDay: weekStart.format('M/D (ddd)'),
      weekdays,
      sellPrice,
      buyPrice: '',
      islandName: '',
      isLoading: false,
      showBtn: false,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    isOpen: {
      get() {
        return this.value
      },
      set(bool) {
        this.$emit('input', bool)
      },
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(bool) {
        if (bool) {
          this.getTurnipPrice()
        }
      },
    },
  },
  methods: {
    async getTurnipPrice() {
      this.isLoading = true
      const data = await turnipSVC.getPriceByUserId(this.profile.userId, weekStart)

      if (data) {
        const { buyPrice, sellPrice } = data
        this.buyPrice = buyPrice
        this.sellPrice = sellPrice
      }
      this.isLoading = false
      this.focusField()
    },
    async updateTurnipPrice() {
      try {
        this.isLoading = true
        await Promise.all([
          turnipSVC.updatePriceByUserId(this.profile.userId, weekStart, {
            buyPrice: this.buyPrice,
            sellPrice: this.sellPrice,
          }),
          this.updateProfileByUserId(),
        ])

        this.$notify({
          type: 'success',
          message: '儲存成功',
        })
        this.$emit('success')
        this.isOpen = false
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async updateProfileByUserId() {
      try {
        await turnipSVC.updateProfileByUserId(this.profile.userId, this.profile)
      } catch (err) {
        console.log(err)
      }
    },
    focusField() {
      this.$nextTick(() => {
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
          // this.$refs[`w${w}${key}`]?.[0].focus();

          this.$refs.popup?.$el?.scrollTo(0, 50 * offsetCount)
        } catch (err) {
          console.log(err)
        }
      })
    },
  },
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
  padding-bottom: calc(#{$paddingBottom} + 30px);
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
