<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" :show-action="isVillagers" placeholder="請輸入關鍵字搜尋">
      <van-button
        slot="action"
        icon="arrow-down"
        size="small"
        @click="showSelect = true"
      >{{ species || '全部' | translateSpecies }}</van-button>
    </van-search>
    <van-action-sheet v-model="showSelect" :actions="actions" @select="onSelect" />

    <div ref="list" class="list__content with-safe-area-inset-bottom">
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
            :title="item.name['name-TWzh']"
            is-link
            center
            @click="openDetails(item)"
          >
            <van-image
              v-if="item.icon_uri || item.image_uri"
              slot="icon"
              class="margin-r-10"
              width="65"
              :src="item.icon_uri || item.image_uri.toLowerCase()"
              :lazy-load="i > 0"
            />

            <div slot="label">
              <template v-if="item.price">
                <span class="little-text">賣價</span>
                {{ item.price | commafy }}
              </template>
              <div v-if="item.species">{{ item.species | translateSpecies }}</div>
            </div>
          </van-cell>
        </template>
      </van-list>
    </div>

    <van-popup v-model="showDetails" round position="bottom" closeable :style="{ height: '90%' }">
      <div v-if="item" class="safe-area-inset-bottom">
        <component :is="detailsComponentName" :item="item" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment';

import { acnhSVC } from '@/services';
import { translateSpecies } from '@/utils/acnh.util';
import { logEvent } from '@/plugins/vue-analytics';

export default {
  filters: {
    translateSpecies,
  },
  components: {
    AcnhFishDetails: () => import('../../components/AcnhFishDetails.vue'),
    AcnhBugsDetails: () => import('../../components/AcnhBugsDetails.vue'),
    AcnhFossilsDetails: () => import('../../components/AcnhFossilsDetails.vue'),
    AcnhVillagersDetails: () => import('../../components/AcnhVillagersDetails.vue'),
    AcnhArtDetails: () => import('../../components/AcnhArtDetails.vue'),
    AcnhSongsDetails: () => import('../../components/AcnhSongsDetails.vue'),
  },
  data() {
    return {
      keyword: '',
      species: '',
      list: null,
      isLoading: false,
      isFinished: false,
      showDetails: false,
      showSelect: false,
      item: null,
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
    isVillagers() {
      return this.type === 'villagers';
    },
    detailsComponentName() {
      return `${this.$route.name}Details`;
    },
    objToList() {
      return Object.keys(this.list || {}).map(key => {
        return this.list[key];
      });
    },
    filterList() {
      return (
        this.objToList
          ?.filter(item => {
            return this.keyword
              ? Object.keys(item.name).some(key => {
                  return (
                    item.name[key]?.toLowerCase()?.includes(this.keyword?.toLowerCase()) ||
                    (item.species
                      ? translateSpecies(item.species).includes(this.keyword) || item.species.includes(this.keyword)
                      : false)
                  );
                })
              : true;
          })
          ?.filter(item => {
            return this.species ? item.species === this.species : true;
          })
          ?.slice(0, this.page * 10) ?? []
      );
    },
    actions() {
      const set = new Set();
      this.objToList.forEach(item => {
        set.add(item.species);
      });
      return [
        { name: '全部', value: '' },
        ...Array.from(set).map(name => ({
          name: translateSpecies(name),
          value: name,
        })),
      ];
    },
  },
  watch: {
    type: {
      immediate: true,
      handler() {
        this.toTop();
        this.keyword = '';
        this.species = '';
        this.item = null;
        this.list = null;
        this.isFinished = false;
        this.isLoading = false;
        this.showSelect = false;
        this.showDetails = false;
        this.page = 1;
        this.getList();
      },
    },
    species() {
      this.page = 1;
      this.toTop();
    },
    keyword() {
      this.page = 1;
      this.toTop();
    },
    showDetails(bool) {
      if (!bool) this.item = null;
    },
  },
  methods: {
    async getList() {
      this.isLoading = true;
      const oldType = this.type;
      const ret = await acnhSVC.getList(this.type);
      this.isLoading = false;
      // console.log(oldType, this.type);
      if (!ret || oldType !== this.type) {
        return;
      }

      this.list = ret;

      this.checkBirthday();
    },
    onLoad() {
      if (this.isFinished) {
        return;
      }
      console.log('on load');
      this.page += 1;
      if (this.filterList.length === this.objToList.length) {
        this.isFinished = true;
      }
    },
    checkBirthday() {
      if (!this.isVillagers) {
        return;
      }
      const hpd = this.objToList.filter(item => {
        return moment().isSame(moment(item.birthday, 'D/M'), 'day');
      });

      const nowDay = moment().format('M/D');
      if (hpd.length && !localStorage.getItem(nowDay)) {
        try {
          this.$dialog({
            title: `今日 ${nowDay} 壽星`,
            message: hpd
              .map(item => {
                return `<div class="text-center" style="white-space: initial">
                    <div>${item.name['name-TWzh']}</div>
                    <img src="${item.icon_uri}" width="80"/>
                  </div>`;
              })
              .join(', '),
            showCancelButton: true,
            confirmButtonText: '今日不再顯示',
            cancelButtonText: '關閉',
            beforeClose(action, done) {
              console.log(action);
              if (action === 'confirm') {
                localStorage.setItem(nowDay, 1);
              }

              done();
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
    toTop() {
      this.$nextTick(() => {
        this.$refs.list.scrollTop = 0;
      });
    },
    openDetails(item) {
      logEvent('狸端機 Lite', '開啟詳細資料', `[${this.type}] ${item?.name?.['name-TWzh']}`);
      this.showDetails = true;
      this.item = item;
    },
    onSelect(action) {
      this.species = action.value;
      this.showSelect = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 105px);
}
</style>
