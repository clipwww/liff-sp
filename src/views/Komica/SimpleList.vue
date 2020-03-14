<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋"></van-search>
    <div class="list__content">
      <van-tabs class="margin-bt-5" v-model="komicaType" type="card">
        <van-tab title="新番捏他" name="new"></van-tab>
        <van-tab title="新番實況" name="live"></van-tab>
      </van-tabs>
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-cell-group>
          <template v-if="isLoading">
            <van-skeleton v-for="n in 20" :key="n" class="padding-bt-15" :row="2"></van-skeleton>
          </template>
          <van-cell
            v-else
            v-for="item in filterItems"
            :key="item.id"
            is-link
            clickable
            center
            @click="goDetails(item)"
          >
            <div slot="title">
              <span>{{ item.title }}</span>
            </div>
            <div slot="label">
              <span class="margin-r-5">{{ item.dateCreated | formatDate }}</span>
              <!-- <van-tag plain size="mini">{{ item.replyCount }}</van-tag> -->
            </div>
            <div slot="right-icon">
              <van-icon name="chat-o" size="25" :info="item.replyCount"></van-icon>
            </div>
          </van-cell>
        </van-cell-group>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { komicaSVC } from '@/services';

export default {
  metaInfo() {
    return {
      title: this.komicaType === 'new' ? '新番捏他' : '新番實況',
    };
  },
  data() {
    return {
      keyword: '',
      items: [],
      isRefreshing: false,
      isLoading: false,
      komicaType: this.$route.query.type || 'new',
    };
  },
  computed: {
    filterItems() {
      return this.items.filter(item => (this.keyword ? item.title.includes(this.keyword) : true));
    },
  },
  watch: {
    komicaType: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getList();
        }
      },
    },
  },
  methods: {
    async getList() {
      this.isRefreshing = false;
      this.isLoading = true;

      const ret = await komicaSVC.getAllList(this.komicaType);
      this.isLoading = false;
      if (!ret.success) {
        return;
      }

      this.items = ret.items;
    },
    goDetails(item) {
      const name = this.komicaType === 'new' ? 'KomicaNewDetails' : 'KomicaLiveDetails';
      this.$router.push({ name, params: { id: item.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>