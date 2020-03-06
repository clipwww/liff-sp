<template>
  <div>
    <van-nav-bar
      v-show="!showSearch"
      :title="$route.meta.label"
      left-text="返回"
      fixed
      left-arrow
      @click-left="onClickLeft"
    >
      <van-icon name="search" slot="right" @click="showSearch = true" />
    </van-nav-bar>
    <van-search
      class="search-bar"
      v-show="showSearch"
      v-model="keyword"
      show-action
      placeholder="請輸入關鍵字"
      @input="onInput"
      @cancel="showSearch = false"
    />
    <div class="movie-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      showSearch: false,
    };
  },
  methods: {
    onClickLeft() {
      window.history.go(-1);
    },
    onInput() {},
    onCancel() {},
  },
};
</script>

<style lang="scss" scoped>
.movie-container {
  padding-top: 46px;
}

.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 46px;
}
</style>