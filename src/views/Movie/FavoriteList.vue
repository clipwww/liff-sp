<template>
  <div>
    <van-panel v-show="isLoading">
      <div slot="header" class="padding-bt-10">
        <van-skeleton title avatar avatar-shape :row="4"></van-skeleton>
      </div>
    </van-panel>
    <van-panel class="margin-bt-10" v-show="!isLoading" v-for="item in favoriteList" :key="item.id">
      <div slot="header">
        <van-cell :title="item.name" size="large">
          <van-image slot="right-icon" width="49" height="20" :src="item.cerImg"  />
        </van-cell>
      </div>
      <van-row class="padding-lr-15" :gutter="15">
        <van-col span="7"><van-image :src="item.poster" @click="goMovie(item)"></van-image></van-col>
        <van-col span="17">
          <p class="fs-14">{{ item.description }}</p>
          <van-tag plain class="margin-r-5 margin-bt-5">片長: {{ item.runtime }} 分</van-tag>
          <van-tag plain class="margin-bt-5">上映日期: {{ item.releaseDate }}</van-tag>
        </van-col>
      </van-row>
      <div slot="footer">
        <div class="flex-between">
          <div class="little-text">加入收藏日期 {{ item.dateCreated | formatDate }}</div>
          <van-button icon="delete"
            type="danger" 
            size="small" 
            @click="removeFavorite(item)">刪除收藏</van-button>
        </div>
      </div>
    </van-panel>
    <van-panel v-show="!favoriteList.length && !isLoading">
      <div slot="header">
        <div class="text-center padding-bt-30">
          <van-icon class="fs-30" name="info" />
          <div>這裡還什麼都沒有</div>
        </div>
      </div>
    </van-panel>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { mapGetters } from 'vuex';

import store from '@/store';
import { movieRef } from '@/plugins/firebase';

export default {
  data() {
    return {
      favoriteList: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile'
    }),
  },
  beforeRouteEnter(to, from , next) {
    const isLoggedIn = store.state.isLoggedIn;

    if (isLoggedIn) {
      next();
    } else {
      Toast.fail('必須要登入才可以使用唷！')
      next({ name: 'MovieSearchTypeChoice' });
    }
  },
  created() {
    this.isLoading = true;
    movieRef.child(`favorite-movie-${this.profile.userId}`).on('value', snapshot => {
      const data = snapshot.val();
      console.log('List', data)
      if (data && data?.length) {
        this.favoriteList = data || [];
      }
      this.isLoading = false;
    })
  },
  beforeDestroy() {
    movieRef.child(`favorite-movie-${this.profile.userId}`).off()
  },
  methods: {
    async removeFavorite(item) {
      try {
        await this.$dialog.confirm({
          title: '確定要刪除收藏嗎？',
          cancelButtonText: '取消',
          confirmButtonText: '確認'
        });
        
        this.favoriteList = this.favoriteList.filter(f => f.id !== item.id);

        movieRef.child(`favorite-movie-${this.profile.userId}`).set(this.favoriteList);
      } catch (err) {
        console.log(err);
      }
    },
    goMovie({ id }) {
      this.$router.push({ name: 'MovieDetails', params: { id, } })
    }
  }
}
</script>

<style>

</style>