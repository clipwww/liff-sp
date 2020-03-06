<template>
  <div>
    <van-notice-bar
      left-icon="volume-o"
      :delay="0"
      scrollable
    >哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦土鳳梨酥！！！</van-notice-bar>
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <van-grid class="margin-t-10" :gutter="10" :column-num="2">
      <van-grid-item clickable icon="video-o" text="電影時刻查詢" :to="{ name: 'Movie' }" />
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
      <van-grid-item icon="photo-o" text="文字" />
    </van-grid>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss" scoped>
.my-swipe ::v-deep .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>
