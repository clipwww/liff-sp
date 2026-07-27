<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from '@/plugins/vant'
import { useAppStore } from '@/store'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const { isLoggedIn, profile, pictureUrl } = storeToRefs(appStore)

const showSidePopup = shallowRef(false)

const routes = computed(() => {
  return (router.options.routes ?? []).filter(item => item.meta?.label)
})

const pageName = computed(() => {
  return route.matched.reduce((title, current, index) => {
    const label = current.meta?.label ?? ''
    if (!label) {
      return title
    }

    if (!index) {
      return label
    }

    return `${title} - ${label}`
  }, '')
})

const topbarTitle = computed(() => {
  return route.query.title?.toString() || route.meta?.label?.toString() || '滅茶苦茶'
})

const hideTopbar = computed(() => route.path.includes('turnip'))

watch(pageName, (title) => {
  document.title = title ? `${title} | 滅茶苦茶` : '滅茶苦茶'
}, { immediate: true })

function closeSidePopup() {
  showSidePopup.value = false
}

function login() {
  if (isLoggedIn.value && profile.value?.displayName) {
    Toast({
      message: `Hi, ${profile.value.displayName}`,
      icon: 'smile-o',
    })
    return
  }

  window.liff.login({
    redirectUri: window.location.href,
  })
}
</script>

<template>
  <van-config-provider theme="light">
    <div id="app" class="app-shell">
      <van-nav-bar
        v-if="!hideTopbar"
        fixed
        placeholder
        border
        :title="topbarTitle"
        @click-left="showSidePopup = true"
      >
        <template #left>
          <van-icon
            class="app-shell__nav-icon"
            size="26px"
            name="wap-nav"
          />
        </template>
      </van-nav-bar>

      <main class="main-container" :class="{ 'main-container--immersive': hideTopbar }">
        <router-view />
      </main>

      <van-popup
        v-model:show="showSidePopup"
        class="app-drawer"
        position="left"
        closeable
        close-on-popstate
        :style="{ width: '280px', height: '100%' }"
      >
        <div class="sidebar__hero">
          <van-image
            width="100%"
            height="180px"
            fit="cover"
            src="/images/tenkinoko.jpeg"
          />
          <div class="sidebar__profile">
            <van-image
              :src="pictureUrl"
              fit="cover"
              round
              @click="login"
            />
            <div class="sidebar__profile-copy">
              <div class="sidebar__title">
                {{ profile?.displayName || 'LINE 帳號' }}
              </div>
              <div class="sidebar__subtitle">
                {{ isLoggedIn ? '已登入，可使用收藏與同步功能' : '登入後可同步個人資料與收藏內容' }}
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar__content">
          <div class="sidebar__section-title">
            功能總覽
          </div>

          <van-cell-group inset>
            <van-cell
              v-for="item in routes"
              :key="item.name"
              class="sidebar__link"
              center
              clickable
              :to="{ name: item.name }"
              @click="closeSidePopup"
            >
              <template #icon>
                <van-icon
                  v-if="item.meta && item.meta.icon"
                  class="sidebar__icon"
                  size="20"
                  :name="item.meta.icon"
                />
                <van-image
                  v-if="item.meta && item.meta.image"
                  class="sidebar__icon-image"
                  width="20"
                  height="20"
                  fit="contain"
                  :src="item.meta.image"
                  alt="komica"
                />
              </template>
              <template #title>
                <span class="sidebar__label">{{ item.meta?.label }}</span>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-popup>
    </div>
  </van-config-provider>
</template>

<style lang="scss">
.app-shell {
  min-height: 100dvh;
  background:
    radial-gradient(circle at top, rgba(25, 137, 250, 0.08), transparent 32%),
    var(--van-background);
}

.app-shell__nav-icon {
  display: flex;
  align-items: center;
}

.main-container {
  min-height: 100dvh;

  &--immersive {
    min-height: 100dvh;
  }
}

.app-drawer {
  background: var(--van-background-2);

  .van-popup__close-icon {
    top: 18px;
    right: 18px;
  }
}

.sidebar {
  &__hero {
    position: relative;
    background: linear-gradient(180deg, rgba(25, 137, 250, 0.08) 0%, rgba(25, 137, 250, 0) 100%);

    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 72px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.82) 100%);
      pointer-events: none;
    }
  }

  &__profile {
    position: absolute;
    right: 18px;
    bottom: -30px;
    left: 18px;
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 10px 14px 10px 10px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.14);
    z-index: 1;

    .van-image {
      width: 72px;
      height: 72px;
      border: 3px solid rgba(255, 255, 255, 0.88);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
      flex-shrink: 0;
    }
  }

  &__content {
    padding: 52px 0 24px;
  }

  &__profile-copy {
    min-width: 0;
  }

  &__title {
    font-size: 18px;
    line-height: 1.25;
    font-weight: 700;
    color: var(--van-text-color);
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--van-gray-7);
  }

  &__section-title {
    padding: 0 24px 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--van-text-color-3);
  }

  &__link {
    min-height: 56px;
  }

  &__icon {
    margin-right: 12px;
    color: var(--van-primary-color);
  }

  &__icon-image {
    margin-right: 12px;
  }

  &__label {
    font-weight: 600;
    color: var(--van-text-color);
  }
}
</style>
