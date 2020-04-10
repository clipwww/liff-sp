<template>
  <div class="editor">
    <van-cell-group>
      <div slot="title" class="fs-20">{{ buyDay }}</div>
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
        type="digit"
        v-model="sellPrice[item.id].am"
        label="上午賣價"
        :placeholder="`請輸入 ${item.label} 上午賣價`"
        :disabled="isLoading"
      />
      <van-field
        type="digit"
        v-model="sellPrice[item.id].pm"
        label="下午賣價"
        :placeholder="`請輸入 ${item.label} 下午賣價`"
        :disabled="isLoading"
      />
    </van-cell-group>

    <div class="fixed-btn">
      <van-button type="primary" round block @click="updateTurnipPrice">送出</van-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import { Toast } from 'vant';

import store from '@/store';
import { turnipRef } from '@/plugins/firebase';
import { turnipSVC } from '@/services';
import { momentUtil } from '@/utils';

const weekStart = momentUtil.getWeekStart();
const weekdays = momentUtil.getWeekdays();

const sellPrice = {};
weekdays.forEach(item => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  };
});

export default {
  data() {
    return {
      buyDay: weekStart.format('M/D (ddd)'),
      weekdays,
      sellPrice,
      buyPrice: '',
      islandName: '',
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
  },
  created() {
    this.getTurnipPrice();
  },
  methods: {
    async getTurnipPrice() {
      this.isLoading = true;
      const data = await turnipSVC.getPriceByUserId(this.profile.userId, weekStart);

      if (data) {
        const { buyPrice, sellPrice } = data;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
      }
      this.isLoading = false;
    },
    async updateTurnipPrice() {
      try {
        await Promise.all([
          turnipSVC.updatePriceByUserId(this.profile.userId, weekStart, {
            buyPrice: this.buyPrice,
            sellPrice: this.sellPrice,
          }),
          this.updateProfileByUserId(),
        ]);

        this.$notify({
          type: 'success',
          message: '儲存成功',
        });
        this.$emit('success');
      } catch (err) {
        console.log(err);
      }
    },
    async updateProfileByUserId() {
      try {
        await turnipSVC.updateProfileByUserId(this.profile.userId, this.profile);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  padding-bottom: calc(#{$paddingBottom} + 15px);
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