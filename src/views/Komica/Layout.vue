<script>
export default {
  data() {
    return {}
  },
  computed: {
    komicaType() {
      switch (true) {
        case this.$route.name.includes('KomicaNew'):
          return 'new'
        case this.$route.name.includes('KomicaLive'):
          return 'live'
        default:
          return ''
      }
    },
    isDetails() {
      return this.$route.name.includes('Details')
    },
  },
}
</script>

<template>
  <div>
    <router-view :key="komicaType" />
    <van-tabbar
      v-show="!isDetails"
      fixed
      route
      safe-area-inset-bottom
    >
      <van-tabbar-item :to="{ name: 'KomicaNew' }">
        新番捏他
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'KomicaSimpleList', query: { type: komicaType } }">
        簡易列表
      </van-tabbar-item>
      <van-tabbar-item :to="{ name: 'KomicaLive' }">
        新番實況
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
</style>
