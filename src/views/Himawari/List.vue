<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" show-action placeholder="請輸入關鍵字搜尋" @search="getList(true)">
      <van-button type="primary" size="small" slot="action" plain @click="getList(true)">搜尋</van-button>
    </van-search>
    <div class="list__content">
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          :error.sync="isError"
          finished-text="没有更多了"
          error-text="Oops...發生錯誤"
          offset="50"
          @load="getList"
        >
          <div slot="loading">
            <van-cell-group>
              <van-skeleton
                class="padding-bt-15"
                :row="4"
                title
                avatar
                avatar-shape="square"
                avatar-size="80"
                v-for="n in 2"
                :key="n"
              ></van-skeleton>
            </van-cell-group>
          </div>
          <!-- <van-grid :column-num="2">
            <van-grid-item v-for="item in items" width="100" :key="item.id" square :border="false">
              <van-image slot="icon" :src="item.image" lazy-load></van-image>
              <div slot="text" class="little-text">{{ item.title }}</div>
            </van-grid-item>
          </van-grid>-->
          <van-cell
            v-for="item in items"
            :key="item.id"
            is-link
            clickable
            center
            @click="goDetails(item)"
          >
            <van-image slot="icon" class="margin-r-10" :src="item.image" width="80" fit="contain"></van-image>
            <div slot="title" class="little-text">{{ item.title }}</div>
            <!-- <div slot="label" v-html="toSafeHtmlString(item.description)"></div> -->
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { himawariSVC } from '@/services';
import { toSafeHtmlString, toPureHtmlString } from '@/utils';

export default {
  data() {
    return {
      keyword: '',
      page: 1,
      items: [],
      isLoading: false,
      isFinished: false,
      isRefreshing: false,
      isError: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    toSafeHtmlString,

    async getList(init = false) {
      if (init) {
        this.items = [];
        this.page = 1;
      }

      this.isRefreshing = false;
      this.isLoading = true;
      const ret = await himawariSVC.getList({
        keyword: this.keyword,
        page: this.page,
      });
      this.isLoading = false;

      if (!ret.success) {
        this.isError = true;
        return;
      }

      if (!ret.items.length) {
        this.isFinished = true;
        return;
      }

      this.page++;
      this.items.push(...ret.items);
    },

    goDetails(item) {
      this.$router.push({ name: 'HimawariDetails', params: { id: item.id }, query: { title: item.title } });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>