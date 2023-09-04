<script>
export default {
  data() {
    return {}
  },
  computed: {
    childRoutes() {
      return (
        this.$router.options.routes.find(r => r.name === 'Acnh')?.children?.filter(r => r.name !== 'AcnhCategory') ?? []
      )
    },
    hideTabbar() {
      return this.$route.name === 'AcnhCategory'
    },
  },
}
</script>

<template>
  <div class="with-safe-area-inset-bottom">
    <router-view :child-routes="childRoutes" />

    <van-tabbar
      v-show="!hideTabbar"
      fixed
      route
      safe-area-inset-bottom
    >
      <van-tabbar-item v-for="item in childRoutes" :key="item.name" :to="{ name: item.name }">
        <div class="text-center">
          <van-image
            v-if="item.meta.image"
            width="25"
            height="25"
            fit="contain"
            :src="item.meta.image"
          />
          <div>{{ item.meta.label }}</div>
        </div>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
</style>
