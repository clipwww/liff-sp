<template>
  <div class="movie-list">
    <div class="movie-list__container">
      <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋" />
      <div class="movie-list__list">
        <van-cell v-for="item in filterMovies" 
          :key="item.id"
          :title="item.name"
          :label="item.description"
          @click="goDetails(item)">
          <van-image slot="right-icon" width="49" height="20" :src="item.cerImg" />
        </van-cell>
        <div v-show="!movies.length">
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
import { movieRef } from '@/plugins/firebase'

export default {
  data() {
    return {
      keyword: '',
      movies: []
    }
  },
  computed: {
    filterMovies() {
      return this.movies?.filter(item => this.keyword ? item.name.includes(this.keyword) : true);
    }
  },
  created() {
    movieRef.child('movies').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.movies = data.items;
      }
    });
    this.getMovies();
  },
  methods: {
    async getMovies() {
      const ret = await movieSVC.getMovieList();
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.movies, ret.items)) {
        console.log('new!');
        movieRef.child('movies').set({
          items: ret.items,
          dateCreated: +moment(),
        });
      }
    },
    goDetails(item) {
      this.$router.push({ name: 'MovieDetails', params: { id: item.id } });
    }
  }
}
</script>

<style lang="scss" scoped>
.movie-list {
  &__container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  &__list {
      flex: 1;
      overflow: auto;
      height: 100%;
    }
}
</style>