<template>
  <div>
    <router-view></router-view>
    <van-tabbar v-show="!isDetails" fixed route safe-area-inset-bottom>
      <van-tabbar-item :to="{ name: 'HimawariList' }">動畫列表</van-tabbar-item>
      <van-tabbar-item :to="{ name: 'HimawariDanmaku' }">彈幕下載</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    isDetails() {
      return this.$route.name.includes('Details');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>