<template>
  <div class="with-safe-area-inset-bottom">
    <router-view></router-view>

    <van-tabbar fixed route safe-area-inset-bottom>
      <van-tabbar-item replace :to="{ name: 'TurnipDashboard' }" icon="chart-trending-o">儀表板</van-tabbar-item>
      <van-tabbar-item replace :to="{ name: 'TurnipEditor' }" icon="edit">紀錄本週價格</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>