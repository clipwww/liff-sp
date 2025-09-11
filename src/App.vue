<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { showToast } from 'vant'
import { useMainStore } from '@/store'

const route = useRoute()
const store = useMainStore()

const showSidePopup = ref(false)
const activeName = ref([])

const isLoggedIn = computed(() => store.isLoggedIn)
const profile = computed(() => store.profile)
const pictureUrl = computed(() => store.pictureUrl)

const routes = ref<any[]>([])

const hideTopbar = computed(() => ['turnip'].some(str => route.path.includes(str)))

const pageName = computed(() => {
  return route.matched.reduce((pre: string, cur, i) => {
    const label = cur.meta?.label as string ?? ''
    if (i === 0) {
      return label
    }
    return pre + (label ? ` - ${label}` : '')
  }, '' as string)
})

// 使用 vueuse/head 設定 meta 資訊
useHead({
  title: computed(() => pageName.value),
  titleTemplate: '%s | 滅茶苦茶',
})

function login() {
  if (isLoggedIn.value) {
    showToast({
      message: `Hi, ${profile.value.displayName}`,
      icon: 'smile',
    })
    return
  }

  window.liff.login({
    redirectUri: window.location.href,
  })
}
</script>

<template>
  <div id="app">
    <van-nav-bar v-if="!hideTopbar" fixed @click-left="showSidePopup = true">
      <van-icon
        slot="left"
        class="padding-b-5"
        size="26px"
        name="wap-nav"
      />
    </van-nav-bar>
    <div class="main-container" :class="{ 'hide-top-bar': hideTopbar }">
      <router-view />
    </div>

    <van-popup
      v-model="showSidePopup"
      :lazy-render="false"
      position="left"
      close-icon="close"
      close-on-popstate
      :style="{ width: '250px', height: '100%' }"
    >
      <div class="sidebar__top">
        <van-image
          width="100%"
          height="140px"
          fit="cover"
          src="./images/tenkinoko.jpeg"
        />
        <div class="sidebar__pic">
          <van-image
            :src="pictureUrl"
            fit="cover"
            round
            @click="login"
          />
        </div>
      </div>
      <div class="sidebar__content">
        <van-cell-group>
          <van-cell
            v-for="item in routes"
            :key="item.name"
            center
            clickable
            :to="{ name: item.name }"
            @click="showSidePopup = false"
          >
            <template v-if="item.meta">
              <van-icon
                v-if="item.meta.icon"
                slot="icon"
                class="margin-r-10"
                size="20"
                :name="item.meta.icon"
              />
              <van-image
                v-if="item.meta.image"
                slot="icon"
                class="margin-r-10"
                width="20"
                height="20"
                fit="contain"
                :src="item.meta.image"
                alt="komica"
              />
            </template>
            <span slot="title">{{ item.meta.label }}</span>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss">
.main-container {
  padding-top: 40px;

  &.hide-top-bar {
    padding-top: 0;
  }
}

.sidebar {
  &__top {
    position: relative;
  }

  &__pic {
    position: absolute;
    width: 70px;
    height: 70px;
    bottom: -20px;
    left: 10px;
    z-index: 1;
  }

  &__content {
    padding-top: 30px;
  }
}
</style>
