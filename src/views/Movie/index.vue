<template>
  <div class="margin-bt-10">
    <van-grid :gutter="10" :column-num="1">
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
      <van-grid-item clickable :to="{ name: 'MovieFavoriteList' }">
        <div class="text-center">
          <van-icon class="fs-30" name="like" />
          <div>收藏的電影</div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
    }),
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
</style>