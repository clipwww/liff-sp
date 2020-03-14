<template>
  <div>
    <!-- <van-notice-bar
      left-icon="volume-o"
      :delay="0"
      scrollable
    >哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦土鳳梨酥！！！</van-notice-bar>-->
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="n in 5" :key="n">
        <van-image src="./images/howhow.jpg" width="100%" height="150" fit="cover"></van-image>
      </van-swipe-item>
    </van-swipe>
    <van-grid class="margin-t-10" :gutter="10" :column-num="2">
      <van-grid-item clickable dot :to="{ name: 'Movie' }">
        <van-icon class="fs-28 margin-b-5" name="video-o"></van-icon>
        <div>電影時刻查詢</div>
      </van-grid-item>
      <van-grid-item clickable dot :to="{ name: 'Komica' }">
        <van-image class="icon-img margin-b-5" src="./images/komica.png" alt="komica" />
        <div>糟糕島</div>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="施工中" />
      <van-grid-item icon="photo-o" text="How Ger 好帥ㄛ" />
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
  // color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: center;
  // background-color: #39a9ed;
}

.icon-img {
  width: 28px;
}
</style>
