<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" show-action placeholder="請輸入關鍵字搜尋" @search="getList(true)">
      <van-button type="primary" size="small" slot="action" plain @click="getList(true)">搜尋</van-button>
    </van-search>
    <div class="list__content with-safe-area-inset-bottom">
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          :error.sync="isError"
          :immediate-check="false"
          finished-text="没有更多了"
          error-text="Oops...發生錯誤"
          offset="50"
          @load="getList"
        >
          <div slot="loading">
            <van-cell v-for="n in 2" :key="n">
              <van-skeleton
                class="padding-bt-5 padding-lr-0"
                :row="4"
                title
                avatar
                avatar-shape="square"
                avatar-size="80"
              ></van-skeleton>
            </van-cell>
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
            center
            :border="false"
            :url="`${BASE_URL}/himawari/${item.group_id}/danmaku?mode=download&group=1&filename=${item.title}`"
            :href="`${BASE_URL}/himawari/${item.group_id}/danmaku?mode=download&group=1&filename=${item.title}`"
          >
            <div slot="title">{{ item.title }}</div>
            <div slot="label" class="little-text">彈幕量: {{ item.count }}</div>
            <!-- <div slot="label" v-html="toSafeHtmlString(item.description)"></div> -->
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { himawariSVC } from '@/services';

export default {
  data() {
    return {
      BASE_URL: process.env.VUE_APP_API_URL,

      keyword: '',
      page: 1,
      items: [],
      isLoading: false,
      isFinished: false,
      isRefreshing: false,
      isError: false,
    };
  },
  methods: {
    async getList(init = false) {
      if (!this.keyword) {
        return;
      }

      if (init) {
        this.items = [];
        this.page = 1;
        this.isFinished = false;
        this.isRefreshing = false;
      }

      this.isRefreshing = false;
      this.isLoading = true;
      const ret = await himawariSVC.getDanmakuList(this.keyword, this.page);
      this.isLoading = false;

      if (!ret.success) {
        this.isError = true;
        return;
      }

      if (this.page >= ret.page.pageAmount || ret.page.dataAmount === 0) {
        this.isFinished = true;
        return;
      }

      this.isError = false;
      this.page++;
      this.items.push(...ret.items);
    },
  },
};
</script>

<style lang="scss" scoped>
.list__content {
  .van-cell {
    &:nth-child(odd) {
      background-color: #333;
    }
  }
}
</style>