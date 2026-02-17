<script>
import _isEqual from 'lodash/isEqual'
import moment from 'moment'

import MovieListCell from '@/components/MovieListCell.vue'
import { movieRef } from '@/plugins/firebase'

import { movieSVC } from '@/services'

export default {
  components: {
    MovieListCell,
  },
  data() {
    return {
      keyword: '',
      moviesGroupByDate: [],
    }
  },
  computed: {
    filterMoviesGroupByDate() {
      return this.moviesGroupByDate?.map((item) => {
        return {
          ...item,
          movies: item.movies.filter(m => (this.keyword ? m.name.includes(this.keyword) : true)),
        }
      })
    },
  },
  created() {
    movieRef.child('movies-next').on('value', (snapshot) => {
      const data = snapshot.val()
      if (data) {
        this.moviesGroupByDate = data.items
      }
    })

    this.getMoviesGroupBtDate()
  },
  beforeUnmount() {
    movieRef.child('movies-next').off()
  },
  methods: {
    async getMoviesGroupBtDate() {
      const ret = await movieSVC.getMovieNextList()
      if (!ret.success) {
        return
      }

      if (!_isEqual(this.moviesGroupByDate, ret.items)) {
        movieRef.child('movies-next').set({
          items: ret.items,
          dateCreated: +moment(),
        })
      }
    },
  },
}
</script>

<template>
  <div class="movie-list">
    <div class="list__container">
      <van-search v-model.trim="keyword" placeholder="請輸入關鍵字搜尋" />
      <div class="list__content padding-b-30">
        <van-cell-group v-for="(group, index) in filterMoviesGroupByDate" :key="index">
          <template #title>
            <van-tag

              type="primary"
              size="large"
              plain
            >
              {{ group.releaseDate }}
            </van-tag>
          </template>
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

<style lang="scss" scoped>
</style>
