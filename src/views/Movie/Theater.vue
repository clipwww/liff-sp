<template>
  <div class="theater__container">
    <van-dropdown-menu v-show="!isFavorteMode" class="dropdown">
      <van-dropdown-item v-model="cityId" :options="cityOptions" placeholder="安安" />
    </van-dropdown-menu>
    <van-search v-model.trim="keyword" placeholder="請輸入關鍵字篩選" />
    <div class="theater__list">
      <van-cell v-for="item in filterList" :key="item.id" is-link @click="goDetails(item)">
        <van-icon
          slot="icon"
          class="lh-inherit margin-r-10"
          :name="isFavorite(item) ? 'like' : 'like-o'"
          color="#f48fb1"
          @click.stop="toggleFavorite(item)"
        />
        {{ item.name }}
      </van-cell>
      <div v-show="!theaters.length && cityId">
        <van-cell v-for="n in 10" :key="n">
          <van-skeleton title :row="0" />
        </van-cell>
      </div>
      <van-cell v-show="isFavorteMode && !isLoggedIn">
        <div class="text-center">
          <van-icon class="fs-30" name="warning" />
          <div>必須要登入才可以使用「我的最愛」唷！</div>
        </div>
      </van-cell>
      <van-cell v-show="isFavorteMode && isEmpty">
        <div class="text-center">
          <van-icon class="fs-30" name="info" />
          <div>這裡還什麼都沒有</div>
        </div>
      </van-cell>
    </div>

    <van-tabbar fixed v-model="activeTab" safe-area-inset-bottom>
      <van-tabbar-item icon="search" name="search">地區搜尋</van-tabbar-item>
      <van-tabbar-item icon="like" name="favorite">我的最愛</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';

export default {
  data() {
    return {
      cityId: window.localStorage.getItem('cityId') || '',
      citys: [],
      theaters: [],
      favoriteList: [],
      activeTab: window.localStorage.getItem('theaters-activeTab') || 'search',
      keyword: '',
      isEmpty: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    filterList() {
      return (this.isFavorteMode ? this.favoriteList : this.theaters).filter(item =>
        this.keyword ? item.name.includes(this.keyword) : true
      );
    },
    cityOptions() {
      return this.citys.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
    },
    isFavorteMode() {
      return this.activeTab === 'favorite';
    },
  },
  watch: {
    cityId: {
      immediate: true,
      handler(val) {
        this.getTheaterList();
        window.localStorage.setItem('cityId', val);
      },
    },
    activeTab(val) {
      window.localStorage.setItem('theaters-activeTab', val);
    },
    isLoggedIn: {
      immediate: true,
      handler(bool) {
        if (bool) {
          this.getFavoriteTheaters();
        }
      },
    },
  },
  created() {
    movieRef.child('citys').on('value', snapshot => {
      const data = snapshot.val();
      if (data && data.items?.length) {
        this.citys = data.items;
        if (!this.cityId) {
          this.cityId = this.citys[0].id;
        }
      }
    });
    this.getCityList();
  },
  beforeDestroy() {
    movieRef.child('citys').off();
  },
  methods: {
    async getCityList() {
      const ret = await movieSVC.getCityList();
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.citys, ret.items)) {
        movieRef.child('citys').set({
          items: ret.items,
          dateCreated: +moment(),
        });
      }
    },
    async getTheaterList() {
      if (!this.cityId) {
        return;
      }

      await movieRef.child(`theaters-${this.cityId}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          this.theaters = data.items;
        }
      });

      const ret = await movieSVC.getTheaterList(this.cityId);
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.theaters, ret.items)) {
        movieRef.child(`theaters-${this.cityId}`).set({
          items: ret.items,
          dateCreated: +moment(),
        });
      }
      this.theaters = ret.items;
    },
    getFavoriteTheaters() {
      if (!this.isLoggedIn) {
        return;
      }

      this.isEmpty = false;
      movieRef.child(`favorite-theaters-${this.profile.userId}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data && data?.length) {
          this.favoriteList = data || [];
        }

        if (!this.filterList.length) {
          this.isEmpty = true;
        }
      });
    },
    async toggleFavorite(item) {
      if (!this.isLoggedIn) {
        this.$toast.fail('必須要登入才可以使用唷！');
        return;
      }

      if (!this.favoriteList.find(f => f.id === item.id)) {
        this.favoriteList.push(item);
      } else {
        this.favoriteList = this.favoriteList.filter(f => f.id !== item.id);
      }

      await movieRef.child(`favorite-theaters-${this.profile.userId}`).set(this.favoriteList);
      this.getFavoriteTheaters();
    },
    isFavorite(item) {
      return !!this.favoriteList.find(f => f.id === item.id);
    },
    goDetails(item) {
      this.$router.push({ name: 'MovieTheaterDetails', params: { id: item.id }, query: { cityId: this.cityId } });
    },
  },
};
</script>

<style lang="scss" scoped>
.theater {
  &__container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 0px);
  }

  &__list {
    flex: 1;
    overflow: auto;
    height: 100%;
    padding-bottom: $paddingBottom;
  }
}

.dropdown {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>