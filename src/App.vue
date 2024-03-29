<script>
import { mapGetters } from 'vuex'

export default {
  metaInfo() {
    return {
      title: this.pageName,
      titleTemplate: '%s | 滅茶苦茶',
    }
  },
  data() {
    return {
      showSidePopup: false,
      activeName: [],
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
      pictureUrl: 'pictureUrl',
    }),
    routes() {
      return this.$router?.options?.routes ?? []
    },
    hideTopbar() {
      return ['turnip'].some(str => this.$route.path.includes(str))
    },
    pageName() {
      return this.$route.matched.reduce((pre, cur, i) => {
        const label = cur.meta?.label ?? ''
        if (i === 0) {
          return label
        }
        return pre + (label ? ` - ${label}` : '')
      }, '')
    },
  },
  methods: {
    login() {
      if (this.isLoggedIn) {
        this.$toast({
          message: `Hi, ${this.profile.displayName}`,
          icon: 'smile',
        })
        return
      }

      window.liff.login({
        redirectUri: window.location.href,
      })
    },
  },
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
