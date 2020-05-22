<template>
  <div>
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">施工中</van-notice-bar>
    <van-grid class="margin-t-15" :gutter="10" :column-num="2">
      <van-grid-item
        v-for="item in childRoutes"
        :key="item.name"
        clickable
        :to="{ name: item.name }"
      >
        <template v-if="item.meta">
          <van-image
            v-if="item.meta.image"
            width="50"
            height="50"
            fit="contain"
            :src="item.meta.image"
            alt="komica"
          />
        </template>
        <div>{{ item.meta.label }}</div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
export default {
  props: {
    childRoutes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
</style>