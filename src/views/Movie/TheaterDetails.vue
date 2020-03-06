<template>
  <div>
    <van-panel :title="theaterInfo.name" :desc="theaterInfo.address">
      <div slot="footer">
        <van-tag plain class="margin-r-5 margin-bt-5">營業時間 {{ theaterInfo.openingHours }}</van-tag>
        <van-tag plain class="margin-r-5 margin-bt-5">電話 {{ theaterInfo.telephone }}</van-tag>
        <a :href="theaterInfo.url" class="margin-bt-5" target="_blank">
          <van-tag plain>網站</van-tag>
        </a>
      </div>
    </van-panel>
    <van-card v-for="item in movies" :key="item.id" :title="item.title" :thumb="item.image">
      <div slot="desc">
        <div v-for="(v, i) in item.versions" :key="i">
          <van-divider>{{ v.name || '數位' }}</van-divider>
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
    <template v-if="!movies.length">
      <van-card v-for="n in 3" :key="n">
        <van-skeleton slot="desc" title avatar avatar-size="88px" avatar-shape="square" :row="3" />
      </van-card>
    </template>
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
      title: this.theaterInfo.name
    }
  },
  data() {
    return {
      theaterInfo: {},
      movies: [],
      date: moment(),
    };
  },
  computed: {
    theaterId() {
      return this.$route.params.id;
    },
    cityId() {
      return this.$route.query.cityId;
    },
    formatDate() {
      return this.date.format('YYYYMMDD');
    },
  },
  created() {
    movieRef.child(`theater-${this.theaterId}-${this.formatDate}`).on('value', snapshot => {
      const data = snapshot.val();
      console.log('value', data);
      if (data) {
        this.theaterInfo = data.item;
        this.movies = data.items;
      }
    });
    this.getTheaterById();
  },
  beforeDestroy() {
    movieRef.child(`theater-${this.theaterId}`).off();
  },
  methods: {
    async getTheaterById() {
      const ret = await movieSVC.getTheaterById(this.theaterId, this.cityId);
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.movies, ret.items)) {
        console.log('new');
        movieRef.child(`theater-${this.theaterId}-${this.formatDate}`).set({
          item: ret.item,
          items: ret.items,
          dateCreated: +moment(),
        });
      }
    },
    isExpired(time) {
      return moment().isAfter(moment(time, 'HH：mm'));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>