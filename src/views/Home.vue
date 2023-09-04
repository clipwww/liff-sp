<script>
export default {
  components: {},
  computed: {
    routes() {
      return (this.$router?.options?.routes ?? []).filter(item => item.path !== '/')
    },
  },
}
</script>

<template>
  <div>
    <!-- <van-notice-bar
      left-icon="volume-o"
      :delay="0"
      scrollable
    >哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦哦土鳳梨酥！！！</van-notice-bar> -->
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="n in 5" :key="n">
        <van-image
          src="./images/howhow.jpg"
          width="100%"
          height="150"
          fit="cover"
        />
      </van-swipe-item>
    </van-swipe>
    <van-grid class="margin-t-10" :gutter="10" :column-num="2">
      <van-grid-item
        v-for="item in routes"
        :key="item.name"
        clickable
        :to="{ name: item.name }"
      >
        <template v-if="item.meta">
          <van-icon
            v-if="item.meta.icon"
            class="margin-b-5"
            size="28"
            :name="item.meta.icon"
          />
          <van-image
            v-if="item.meta.image"
            class="margin-b-5"
            width="28"
            height="28"
            fit="contain"
            :src="item.meta.image"
            alt="komica"
          />
        </template>
        <div>{{ item.meta.label }}</div>
      </van-grid-item>
      <van-grid-item icon="photo-o" text="How Ger 好帥ㄛ" />
    </van-grid>
  </div>
</template>

<style lang="scss" scoped>
.my-swipe ::v-deep .van-swipe-item {
  // color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: center;
  // background-color: #39a9ed;
}
</style>
