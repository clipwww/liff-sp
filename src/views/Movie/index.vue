<script setup lang="ts">
// No script needed for this component
</script>

<template>
  <div class="margin-bt-10">
    <van-grid :gutter="10" :column-num="2">
      <van-grid-item clickable :to="{ name: 'MovieTheaterList' }">
        <div class="text-center">
          <van-icon class="fs-30" name="wap-home" />
          <div>電影院查詢</div>
        </div>
      </van-grid-item>
      <van-grid-item clickable :to="{ name: 'MovieList' }">
        <div class="text-center">
          <van-icon class="fs-30" name="video" />
          <div>上映中電影查詢</div>
        </div>
      </van-grid-item>
      <van-grid-item clickable :to="{ name: 'MovieNext' }">
        <div class="text-center">
          <van-icon class="fs-30" name="new" />
          <div>近期上映</div>
        </div>
      </van-grid-item>
      <van-grid-item clickable :to="{ name: 'MovieVieshow' }">
        <div class="text-center">
          <van-icon class="fs-30" name="video" />
          <div>威秀時刻表</div>
        </div>
      </van-grid-item>
      <van-grid-item clickable :to="{ name: 'MovieFavoriteList' }">
        <div class="text-center">
          <van-icon class="fs-30" name="like" />
          <div>收藏的電影</div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<style lang="scss" scoped>
</style>
