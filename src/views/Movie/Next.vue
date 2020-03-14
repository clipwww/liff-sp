<template>
  <div class="movie-list">
    <div class="movie-list__container">
      <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋" />
      <div class="movie-list__list">
        <van-cell-group v-for="(group, index) in filterMoviesGroupByDate" :key="index">
          <van-tag slot="title" type="primary" size="large" plain>{{ group.releaseDate }}</van-tag>
          <MovieListCell :items="group.movies" />
        </van-cell-group>
        <div v-show="!moviesGroupByDate.length">
          <van-cell v-for="n in 10" :key="n">
            <van-skeleton :row="1" />
          </van-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';

import MovieListCell from '@/components/MovieListCell.vue';

export default {
  components: {
    MovieListCell,
  },
  data() {
    return {
      keyword: '',
      moviesGroupByDate: [],
    };
  },
  computed: {
    filterMoviesGroupByDate() {
      return this.moviesGroupByDate?.map(item => {
        return {
          ...item,
          movies: item.movies.filter(m => (this.keyword ? m.name.includes(this.keyword) : true)),
        };
      });
    },
  },
  created() {
    movieRef.child('movies-next').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.moviesGroupByDate = data.items;
      }
    });

    this.getMoviesGroupBtDate();
  },
  beforeDestroy() {
    movieRef.child('movies-next').off();
  },
  methods: {
    async getMoviesGroupBtDate() {
      const ret = await movieSVC.getMovieNextList();
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.moviesGroupByDate, ret.items)) {
        movieRef.child('movies-next').set({
          items: ret.items,
          dateCreated: +moment(),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.movie-list {
  &__container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 46px);
  }

  &__list {
    flex: 1;
    overflow: auto;
    height: 100%;
    padding-bottom: 80px;
  }
}
</style>