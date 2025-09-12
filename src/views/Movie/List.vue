<script>
import moment from 'moment'
import _isEqual from 'lodash/isEqual'
import { ref as dbRef, getDatabase, off, onValue, set } from 'firebase/database'

import { movieSVC } from '@/services'

import MovieListCell from '@/components/MovieListCell.vue'

export default {
  components: {
    MovieListCell,
  },
  data() {
    return {
      keyword: '',
      movies: [],
      moviesGroupByDate: [],
      activeTab: window.localStorage.getItem('movies-activeTab') || 'list',
    }
  },
  computed: {
    filterMovies() {
      return this.movies
        ?.filter(item => (this.keyword ? item.name.includes(this.keyword) : true))
        .map((movie) => {
          let otherInfo = {}
          this.moviesGroupByDate?.forEach((item) => {
            item.movies?.forEach((m) => {
              if (m.id === movie.id) {
                otherInfo = m
              }
            })
          })

          return {
            ...movie,
            ...otherInfo,
          }
        })
    },
    filterMoviesGroupByDate() {
      return this.moviesGroupByDate?.map((item) => {
        return {
          ...item,
          movies: item.movies
            .filter(m => (this.keyword ? m.name.includes(this.keyword) : true))
            .map((movie) => {
              const otherInfo = this.movies?.find(m => m.id === movie.id)
              return {
                ...movie,
                ...otherInfo,
              }
            }),
        }
      })
    },
    isListMode() {
      return this.activeTab === 'list'
    },
    isGroupByDateMode() {
      return this.activeTab === 'date'
    },
  },
  watch: {
    activeTab(val) {
      window.localStorage.setItem('movies-activeTab', val)
    },
  },
  created() {
    onValue(dbRef(getDatabase(), 'movies'), (snapshot) => {
      const data = snapshot.val()
      if (data) {
        this.movies = data.items
      }
    })
    onValue(dbRef(getDatabase(), 'movies-group-by-date'), (snapshot) => {
      const data = snapshot.val()
      if (data) {
        this.moviesGroupByDate = data.items
      }
    })
    this.getMovies()
    this.getMoviesGroupBtDate()
  },
  beforeUnmount() {
    off(dbRef(getDatabase(), 'movies'))
    off(dbRef(getDatabase(), 'movies-group-by-date'))
  },
  methods: {
    async getMovies() {
      const ret = await movieSVC.getMovieList()
      if (!ret.success) {
        return
      }

      if (!_isEqual(this.movies, ret.items)) {
        set(dbRef(getDatabase(), 'movies'), {
          items: ret.items,
          dateCreated: +moment(),
        })
      }
    },
    async getMoviesGroupBtDate() {
      const ret = await movieSVC.getMovieListGroupByDate()
      if (!ret.success) {
        return
      }

      if (!_isEqual(this.moviesGroupByDate, ret.items)) {
        set(dbRef(getDatabase(), 'movies-group-by-date'), {
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
      <div v-if="isListMode" class="list__content with-safe-area-inset-bottom">
        <MovieListCell :items="filterMovies" />
        <div v-show="!movies.length">
          <van-cell
            v-for="n in 5"
            :key="n"
          >
            <van-skeleton
              class="padding-bt-5 padding-lr-0"
              :row="2"
              title
              avatar
              avatar-shape="square"
              avatar-size="80"
            />
          </van-cell>
        </div>
      </div>
      <div v-if="isGroupByDateMode" class="list__content with-safe-area-inset-bottom">
        <van-cell-group v-for="group in filterMoviesGroupByDate" :key="group.releaseDate">
          <van-tag
            v-if="group.movies.length"
            slot="title"
            type="primary"
            size="large"
            plain
          >
            {{ group.releaseDate }}
          </van-tag>
          <MovieListCell :items="group.movies" />
        </van-cell-group>
        <div v-show="!moviesGroupByDate.length">
          <van-cell
            v-for="n in 5"
            :key="n"
          >
            <van-skeleton
              class="padding-bt-5 padding-lr-0"
              :row="2"
              title
              avatar
              avatar-shape="square"
              avatar-size="80"
            />
          </van-cell>
        </div>
      </div>
    </div>

    <van-tabbar v-model="activeTab" fixed safe-area-inset-bottom>
      <van-tabbar-item icon="orders-o" name="list">
        快速瀏覽
      </van-tabbar-item>
      <van-tabbar-item icon="calender-o" name="date">
        依照上映日
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
</style>
