<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const komicaType = computed(() => {
  const routeName = route.name?.toString() ?? ''

  if (routeName.includes('KomicaNew')) {
    return 'new'
  }

  if (routeName.includes('KomicaLive')) {
    return 'live'
  }

  return ''
})

const isDetails = computed(() => route.name?.toString().includes('Details'))
</script>

<template>
  <div class="komica-layout app-page">
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
.komica-layout {
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
