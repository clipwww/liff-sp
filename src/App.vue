<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$route.meta.label,
      titleTemplate: '%s | 滅茶苦茶',
    };
  },
};
</script>

<style lang="scss"></style>
