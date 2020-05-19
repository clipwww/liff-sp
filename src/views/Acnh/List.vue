<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋"></van-search>
    <div ref="list" class="list__content">
      <van-list :finished="isFinished" finished-text="没有更多了" :offset="10" @load="onLoad">
        <div v-if="isLoading">
          <van-cell v-for="n in 10" :key="n">
            <van-skeleton
              class="padding-bt-5 padding-lr-0"
              :row="1"
              title
              avatar
              avatar-shape="square"
              avatar-size="65"
            ></van-skeleton>
          </van-cell>
        </div>
        <template v-if="list">
          <van-cell
            v-for="(item, i) in filterList"
            :key="item.id"
            :title="item.name['name-tw']"
            :label="item.name['name-jp']"
            is-link
            center
            @click="goDetails(item)"
          >
            <van-image
              v-if="hasIcon || hasImage"
              slot="icon"
              class="margin-r-10"
              width="65"
              :src="`http://acnhapi.com/${hasIcon ? 'icons' : 'images'}/${type}/${item.id || item['file-name']}`"
              :lazy-load="i > 0"
            />

            <div v-if="item.price" slot="right-icon">
              <span class="little-text">賣價</span>
              {{ item.price | commafy }}
            </div>

            <div v-if="item.species" slot="right-icon">{{ item.species }}</div>
          </van-cell>
        </template>
      </van-list>
    </div>
  </div>
</template>

<script>
import { acnhSVC } from '@/services';

export default {
  data() {
    return {
      keyword: '',
      list: null,
      isLoading: false,
      isFinished: false,
      page: 1,
    };
  },
  computed: {
    type() {
      switch (this.$route.name) {
        case 'AcnhFish':
          return 'fish';
        case 'AcnhBugs':
          return 'bugs';
        case 'AcnhFossils':
          return 'fossils';
        case 'AcnhVillagers':
          return 'villagers';
        case 'AcnhSongs':
          return 'songs';
        case 'AcnhArt':
          return 'art';
      }
    },
    hasIcon() {
      return ['fish', 'bugs', 'villagers', 'art'].includes(this.type);
    },
    hasImage() {
      return ['fossils', 'songs'].includes(this.type);
    },
    filterList() {
      return (
        Object.keys(this.list || {})
          ?.map(key => {
            return this.list[key];
          })
          ?.filter(item => {
            return this.keyword
              ? Object.keys(item.name).some(key => {
                  return item.name[key].includes(this.keyword);
                })
              : true;
          })
          ?.slice(0, this.page * 10) ?? []
      );
    },
  },
  watch: {
    type: {
      immediate: true,
      handler() {
        this.toTop();
        this.list = null;
        this.isFinished = false;
        this.isLoading = false;
        this.page = 1;
        this.getList();
      },
    },
    keyword() {
      this.page = 1;
      this.toTop();
    },
  },
  methods: {
    async getList() {
      this.isLoading = true;
      const ret = await acnhSVC.getList(this.type);
      this.isLoading = false;
      if (!ret) {
        return;
      }

      this.list = ret;
    },
    onLoad() {
      if (this.isFinished) {
        return;
      }
      console.log('on load');
      this.page += 1;
      if (this.filterList.length === Object.keys(this.list).length) {
        this.isFinished = true;
      }
    },
    toTop() {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = 0;
      });
    },
    goDetails() {},
  },
};
</script>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 105px);
}
</style>
