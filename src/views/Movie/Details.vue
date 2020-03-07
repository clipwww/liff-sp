<template>
  <div>
    <van-panel v-if="!movieInfo.id">
      <div class="padding-b-15">
        <van-skeleton title avatar avatar-shape :row="4"></van-skeleton>
      </div>
    </van-panel>
    <van-panel v-else>
      <div slot="header">
        <van-cell :title="movieInfo.name" size="large">
          <van-image slot="right-icon" width="49" height="20" :src="movieInfo.cerImg" />
        </van-cell>
      </div>
      <van-row class="padding-lr-15" :gutter="15">
        <van-col span="7"><van-image :src="movieInfo.poster"></van-image></van-col>
        <van-col span="17">
          <p class="fs-14">{{ movieInfo.description }}</p>
        </van-col>
      </van-row>
      <div slot="footer">
        <van-tag plain class="margin-r-5 margin-bt-5">片長: {{ movieInfo.runtime }} 分</van-tag>
        <van-tag plain class="margin-bt-5">上映日期: {{ movieInfo.releaseDate }}</van-tag>
      </div>
    </van-panel>
      
    <van-tabs class="margin-t-10" v-model="cityId">
      <van-tab v-for="item in citys" :key="item.id" :title="item.name" :name="item.id"></van-tab>
    </van-tabs>
    <van-card v-for="item in theaterList" :key="item.id" :title="item.name">
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
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';

export default {
  metaInfo() {
    return {
      title: this.movieInfo.name
    }
  },
  data() {
    return {
      movieInfo: {},
      theaterList: [],
      cacheTheaterList: [],
      cityId: window.localStorage.getItem('cityId') || '',
      isEmpty: false,
    }
  },
  computed: {
    citys() {
      return this.movieInfo?.citys ?? []
    },
    movieId() {
      return this.$route.params.id;
    }
  },
  watch: {
    citys(arr) {
      if (arr.length) {
        const lsCity = arr.find(item => item.id === this.cityId);
        if (!lsCity) {
          this.cityId = arr[0].id
        }
      }
    },
    cityId: {
      immediate: true,
      handler(val, oldVal) {
        console.log(val, oldVal);
        this.theaterList = [];
        this.getMovieTimesById();
        // window.localStorage.setItem('cityId', val)
      }
    }
  },
  created() {
    movieRef.child(`movie-${this.movieId}`).on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.movieInfo = data.item;
        this.cacheTheaterList = data.items;
      }
    });
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
        console.log('new')
        movieRef.child(`movie-${this.movieId}`).set({
          item: ret.item,
          items: ret.items,
          dateCreated: +moment(),
        });
      }

      this.movieInfo = ret.item;
      this.theaterList = ret.items;
    },
    isExpired(time) {
      return moment().isAfter(moment(time, 'HH：mm'));
    },
  }
}
</script>

<style lang="scss">

</style>