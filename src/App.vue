<template>
  <div id="app">
    <van-nav-bar fixed @click-left="showSidePopup = true">
      <div slot="left">
        <van-icon size="25px" name="wap-nav" />
      </div>
    </van-nav-bar>
    <div class="main-container">
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
        <van-image width="100%" height="140px" fit="cover" src="./images/tenkinoko.jpeg"></van-image>
        <div class="sidebar__pic">
          <van-image :src="pictureUrl" fit="cover" round @click="login"></van-image>
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
                class="margin-r-10"
                slot="icon"
                v-if="item.meta.icon"
                size="20"
                :name="item.meta.icon"
              ></van-icon>
              <van-image
                class="margin-r-10"
                slot="icon"
                v-if="item.meta.image"
                width="20"
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

<script>
import { mapGetters } from 'vuex';

export default {
  metaInfo() {
    return {
      title: this.$route.meta.label,
      titleTemplate: '%s | 滅茶苦茶',
    };
  },
  data() {
    return {
      showSidePopup: false,
      activeName: [],
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
      pictureUrl: 'pictureUrl',
    }),
    routes() {
      return this.$router?.options?.routes ?? [];
    },
  },
  methods: {
    login() {
      if (this.isLoggedIn) {
        this.$toast({
          message: `Hi, ${this.profile.displayName}`,
          icon: 'smile',
        });
        return;
      }

      window.liff.login({
        redirectUri: window.location.href,
      });
    },
  },
};
</script>

<style lang="scss">
.main-container {
  padding-top: 46px;
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
