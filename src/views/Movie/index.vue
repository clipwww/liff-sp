<template>
  <div class="margin-bt-10">
    <van-grid :gutter="10" :column-num="1">
      <van-grid-item clickable :to="{ name: 'MovieTheaterList' }">
        <div class="text-center">
          <van-icon class="fs-30" name="wap-home" />
          <div>電影院查詢</div>
        </div>
      </van-grid-item>
      <van-grid-item clickable @click="onClick">
        <div class="text-center">
          <van-icon class="fs-30" name="video" />
          <div>上映中電影查詢</div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$toast('施工中');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>