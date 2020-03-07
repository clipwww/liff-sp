<template>
  <div id="app">
    <router-view />
    <div class="fixed-control">
      <van-image :src="pictureUrl" fit="cover" round></van-image>
    </div>
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
  computed: {
    ...mapGetters({
      profile: 'profile',
      pictureUrl: 'pictureUrl'
    })
  }
};
</script>

<style lang="scss">

.fixed-control {
  position: fixed;
  right: 5px;
  bottom: 15px;
  width: 50px;
  height: 50px;
  z-index: 1;
}
</style>
