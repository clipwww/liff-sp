<template>
  <div>
    <van-panel v-if="!movieInfo.id">
      <div slot="header" class="padding-bt-10">
        <van-skeleton title avatar avatar-shape :row="4"></van-skeleton>
      </div>
    </van-panel>
    <van-panel v-else>
      <div slot="header">
        <van-cell :title="movieInfo.name" size="large">
          <van-image slot="right-icon" width="40" fit="contain" :src="movieInfo.cerImg" />
        </van-cell>
      </div>
      <van-row class="padding-lr-15" :gutter="15">
        <van-col span="7">
          <van-image :src="posterSrc"></van-image>
        </van-col>
        <van-col span="17">
          <p class="fs-14">{{ movieInfo.description }}</p>
          <van-tag
            v-if="movieInfo.runtime"
            plain
            class="margin-r-5 margin-bt-5"
          >片長: {{ movieInfo.runtime }} 分</van-tag>
          <van-tag
            v-if="movieInfo.releaseDate"
            plain
            class="margin-bt-5"
          >上映日期: {{ movieInfo.releaseDate }}</van-tag>
        </van-col>
      </van-row>
      <div slot="footer">
        <div class="text-left">
          <van-button
            :icon="isFavorite ? 'like' : 'like-o'"
            color="#f48fb1"
            type="default"
            :plain="!isFavorite"
            size="small"
            @click="toggleFavorite"
          >{{ isFavorite ? '已收藏電影' : '收藏電影' }}</van-button>
          <van-button
            v-if="movieInfo.trailer"
            class="margin-l-10"
            type="info"
            icon="video-o"
            size="small"
            plain
            @click="watchTrailer"
          >電影預告</van-button>
        </div>
      </div>
    </van-panel>

    <van-tabs class="margin-t-10" v-model="cityId">
      <van-tab v-for="item in citys" :key="item.id" :title="item.name" :name="item.id"></van-tab>
    </van-tabs>
    <van-card v-for="item in theaterList" :key="item.id">
      <div slot="title" class="flex-between">
        <div class="fs-14" @click="goTheater(item)">{{ item.name }}</div>
        <div>
          <van-button type="info" icon="share" size="mini" plain @click="share(item)">分享</van-button>
        </div>
      </div>
      <div slot="desc">
        <div v-for="(v, i) in item.versions" :key="i">
          <van-divider content-position="left">{{ v.name || '數位' }}</van-divider>
          <van-tag
            class="margin-a-5"
            :type="isExpired(time) ? 'default' : 'success'"
            v-for="(time, n) in v.times"
            plain
            :key="n"
          >{{ time }}</van-tag>
        </div>
      </div>
    </van-card>
    <van-card v-if="!theaterList.length && !isEmpty">
      <van-skeleton slot="desc" title :row="3" />
    </van-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';
import { shareTargetPicker } from '@/plugins/liff';

export default {
  metaInfo() {
    return {
      title: this.movieInfo.name,
    };
  },
  data() {
    return {
      movieInfo: {},
      theaterList: [],
      cacheTheaterList: [],
      favoriteList: [],
      cityId: this.$route.query.cityId || window.localStorage.getItem('cityId') || '',
      isEmpty: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    citys() {
      return this.movieInfo?.citys ?? [];
    },
    movieId() {
      return this.$route.params.id;
    },
    isFavorite() {
      return !!this.favoriteList.find(item => item.id === this.movieInfo.id);
    },
    posterSrc() {
      return !this.movieInfo.poster || this.movieInfo.poster.includes('l10l010l3322l1')
        ? 'https://via.placeholder.com/250x370?text=404'
        : this.movieInfo.poster;
    },
  },
  watch: {
    citys(arr) {
      if (arr.length) {
        const lsCity = arr.find(item => item.id === this.cityId);
        if (!lsCity) {
          this.cityId = arr[0].id;
        }
      }
    },
    cityId: {
      immediate: true,
      handler(newVal, oldVal) {
        this.theaterList = [];

        movieRef.child(`movie-${this.movieId}`).off();
        movieRef.child(`movie-${this.movieId}-${oldVal}`).off();
        movieRef.child(`movie-${this.movieId}-${newVal}`).off();
        movieRef.child(`movie-${this.movieId}${newVal ? `-${newVal}` : ''}`).on('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            this.movieInfo = data.item;
            this.cacheTheaterList = data.items || [];

            if (moment().isSame(data.dateCreated, 'day')) {
              // 同一天的資料
              this.theaterList = this.cacheTheaterList;
            }
          }
        });

        this.getMovieTimesById();
        // window.localStorage.setItem('cityId', val)
      },
    },
    isLoggedIn: {
      immediate: true,
      handler(bool) {
        if (bool) {
          this.getFavoriteMovies();
        }
      },
    },
  },
  beforeDestroy() {
    movieRef.child(`movie-${this.movieId}`).off();
    movieRef.child(`movie-${this.movieId}-${this.cityId}`).off();
  },
  methods: {
    async getMovieTimesById() {
      this.isEmpty = false;

      const ret = await movieSVC.getMovieTimesById(this.movieId, this.cityId);
      if (!ret.success) {
        return;
      }

      if (!ret.items.length) {
        this.isEmpty = true;
      }

      if (!_isEqual(this.cacheTheaterList, ret.items) || !_isEqual(this.movieInfo, ret.item)) {
        movieRef.child(`movie-${this.movieId}${this.cityId ? `-${this.cityId}` : ''}`).set({
          item: ret.item,
          items: ret.items,
          dateCreated: +moment(),
        });
      }

      this.movieInfo = ret.item;
      this.theaterList = ret.items;
    },
    getFavoriteMovies() {
      if (!this.isLoggedIn) {
        return;
      }
      movieRef.child(`favorite-movie-${this.profile.userId}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data && data?.length) {
          this.favoriteList = data || [];
        }
      });
    },
    toggleFavorite() {
      if (!this.isLoggedIn) {
        this.$toast.fail('必須要登入才可以使用唷！');
        return;
      }

      if (this.isFavorite) {
        this.favoriteList = this.favoriteList.filter(item => item.id !== this.movieInfo.id);
      } else {
        this.favoriteList.push({
          ...this.movieInfo,
          dateCreated: +moment(),
        });
      }

      movieRef.child(`favorite-movie-${this.profile.userId}`).set(this.favoriteList);
    },
    isExpired(time) {
      return moment().isAfter(moment(time, 'HH：mm'));
    },
    watchTrailer() {
      const url = this.movieInfo.trailer;
      if (window.liff.isInClient()) {
        window.liff.openWindow({
          url,
          external: true,
        });
      } else {
        window.open(url);
      }
    },
    goTheater(item) {
      this.$router.push({
        name: 'MovieTheaterDetails',
        params: { id: item.id },
        query: { cityId: this.cityId },
      });
    },
    async share(item) {
      if (!this.isLoggedIn) {
        this.$toast.fail('必須要登入才可以使用唷！');
        return;
      }

      const contents = [];
      item.versions.forEach(v => {
        const timeArr = v.times.map(t => t.replace('：', ':'));
        const colmunNum = Math.ceil(timeArr.length / 5);

        contents.push({
          type: 'text',
          text: v.name,
          weight: 'bold',
          size: 'sm',
          margin: 'md',
        });

        contents.push({
          type: 'box',
          layout: 'horizontal',
          margin: 'md',
          contents: Array(colmunNum)
            .fill('')
            .map((s, i) => {
              return {
                type: 'box',
                layout: 'vertical',
                contents: timeArr
                  .filter((t, index) => index < (i + 1) * 5 && index >= i * 5)
                  .map(t => {
                    return {
                      type: 'text',
                      text: t,
                      size: 'xs',
                      margin: 'sm',
                    };
                  }),
              };
            }),
        });

        contents.push({
          type: 'separator',
          margin: 'md',
        });
      });
      const message = [
        {
          type: 'flex',
          altText: `這是一個Flex Message`,
          size: 'giga',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: this.movieInfo.name,
                  size: 'md',
                  weight: 'bold',
                },
                {
                  type: 'text',
                  text: item.name,
                  size: 'sm',
                  margin: 'sm',
                },
              ],
            },
            // hero: {
            //   type: 'image',
            //   url: 'https://i.pinimg.com/originals/16/f1/20/16f1200d1201b6b664d83cf90e4073e2.png',
            //   size: 'full',
            //   aspectRatio: '20:13',
            //   aspectMode: 'cover',
            // },
            body: {
              type: 'box',
              layout: 'vertical',
              contents,
            },
            action: {
              type: 'uri',
              uri: window.location.href + `?cityId=${this.cityId}`,
            },
          },
        },
      ];
      console.log(message);
      const isOk = await shareTargetPicker(message);

      if (isOk) {
        this.$toast('分享成功！');
      }
    },
  },
};
</script>

<style lang="scss">
</style>