<template>
  <div class="movie-list">
    <div class="movie-list__container">
      <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋" />
      <div v-if="isListMode" class="movie-list__list">
        <van-cell v-for="item in filterMovies" 
          :key="item.id"
          :title="item.name"
          :label="item.description"
          @click="goDetails(item)">
          <van-image slot="icon" class="margin-r-10" width="40" :src="item.poster" lazy-load />
          <van-image slot="right-icon" class="margin-l-5" width="40" fit="contain" :src="item.cerImg" lazy-load />
        </van-cell>
        <div v-show="!movies.length">
          <van-cell v-for="n in 10" :key="n">
            <van-skeleton :row="1" />
          </van-cell>
        </div>
      </div>
      <div v-if="isGroupByDateMode" class="movie-list__list">
        <van-cell-group v-for="(group, index) in filterMoviesGroupByDate"
          :key="index">
          <van-tag slot="title" type="primary" size="large" plain>{{ group.releaseDate }}</van-tag>
          <van-cell v-for="item in group.movies" 
            :key="item.id"
            :title="item.name"
            :label="item.description"
            @click="goDetails(item)">
            <van-image slot="icon" class="margin-r-10" width="40" :src="item.poster" lazy-load />
            <van-image slot="right-icon" class="margin-l-5" width="40" fit="contain" :src="item.cerImg" lazy-load />
          </van-cell>
        </van-cell-group>
        <div v-show="!moviesGroupByDate.length">
          <van-cell v-for="n in 10" :key="n">
            <van-skeleton :row="1" />
          </van-cell>
        </div>
      </div>
    </div>
    
    <van-tabbar fixed v-model="activeTab" safe-area-inset-bottom	>
      <van-tabbar-item icon="orders-o"  name="list">快速瀏覽</van-tabbar-item>
      <van-tabbar-item icon="calender-o" name="date">依照上映日</van-tabbar-item>
    </van-tabbar>
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
      movies: [],
      moviesGroupByDate: [],
      activeTab: window.localStorage.getItem('movies-activeTab') || 'list'
    }
  },
  computed: {
    filterMovies() {
      return this.movies?.filter(item => this.keyword ? item.name.includes(this.keyword) : true)
        .map(movie => {
          let otherInfo = {};
          this.moviesGroupByDate?.forEach(item => {
            item.movies?.forEach(m => {
              if (m.id === movie.id) {
                otherInfo = m;
              }
            })
          });

          return {
            ...movie,
            ...otherInfo
          }
        });
    },
    filterMoviesGroupByDate() {
      return  this.moviesGroupByDate?.map(item => {
        return {
          ...item,
          movies: item.movies.filter(m => this.keyword ? m.name.includes(this.keyword) : true)
            .map(movie => {
              const otherInfo = this.movies?.find(m => m.id === movie.id);
              return {
                ...movie,
                ...otherInfo
              }
            })
        }
      });
    },
    isListMode() {
      return this.activeTab === 'list';
    },
    isGroupByDateMode() {
      return this.activeTab === 'date';
    }
  },
  watch: {
    activeTab(val) {
      window.localStorage.setItem('movies-activeTab', val);
    },
  },
  created() {
    movieRef.child('movies').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.movies = data.items;
      }
    });
    movieRef.child('movies-group-by-date').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.moviesGroupByDate = data.items;
      }
    });
    this.getMovies();
    this.getMoviesGroupBtDate();
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
    async getMoviesGroupBtDate() {
      const ret = await movieSVC.getMovieListGroupByDate();
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.moviesGroupByDate, ret.items)) {
        console.log('new!');
        movieRef.child('movies-group-by-date').set({
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
    padding-bottom: 80px;
  }
}
</style>