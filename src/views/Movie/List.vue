<script setup lang="ts">
import _isEqual from 'lodash/isEqual'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import MovieListCell from '@/components/MovieListCell.vue'
import dayjs from '@/plugins/dayjs'
import { movieRef } from '@/plugins/firebase'
import { movieSVC } from '@/services'

const keyword = shallowRef('')
const movies = ref<any[]>([])
const moviesGroupByDate = ref<any[]>([])
const activeTab = shallowRef(window.localStorage.getItem('movies-activeTab') || 'list')

const filterMovies = computed(() => {
  return movies.value
    .filter(item => (keyword.value ? item.name.includes(keyword.value) : true))
    .map((movie) => {
      let otherInfo = {}
      moviesGroupByDate.value.forEach((group) => {
        group.movies?.forEach((groupMovie: any) => {
          if (groupMovie.id === movie.id) {
            otherInfo = groupMovie
          }
        })
      })

      return {
        ...movie,
        ...otherInfo,
      }
    })
})

const filterMoviesGroupByDate = computed(() => {
  return moviesGroupByDate.value
    .map((group) => {
      return {
        ...group,
        movies: group.movies
          .filter((movie: any) => (keyword.value ? movie.name.includes(keyword.value) : true))
          .map((movie: any) => {
            const otherInfo = movies.value.find(item => item.id === movie.id)
            return {
              ...movie,
              ...otherInfo,
            }
          }),
      }
    })
    .filter(group => group.movies.length)
})

const isListMode = computed(() => activeTab.value === 'list')

watch(activeTab, (value) => {
  window.localStorage.setItem('movies-activeTab', value)
})

onMounted(() => {
  movieRef.child('movies').on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      movies.value = data.items
    }
  })

  movieRef.child('movies-group-by-date').on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      moviesGroupByDate.value = data.items
    }
  })

  getMovies()
  getMoviesGroupByDate()
})

onBeforeUnmount(() => {
  movieRef.child('movies').off()
  movieRef.child('movies-group-by-date').off()
})

async function getMovies() {
  const ret = await movieSVC.getMovieList()
  if (!ret.success) {
    return
  }

  if (!_isEqual(movies.value, ret.items)) {
    movieRef.child('movies').set({
      items: ret.items,
      dateCreated: dayjs().valueOf(),
    })
  }
}

async function getMoviesGroupByDate() {
  const ret = await movieSVC.getMovieListGroupByDate()
  if (!ret.success) {
    return
  }

  if (!_isEqual(moviesGroupByDate.value, ret.items)) {
    movieRef.child('movies-group-by-date').set({
      items: ret.items,
      dateCreated: dayjs().valueOf(),
    })
  }
}
</script>

<template>
  <div class="movie-list">
    <div class="list__container">
      <van-search v-model.trim="keyword" class="movie-list__search" placeholder="請輸入關鍵字搜尋" />

      <div v-if="isListMode" class="list__content with-safe-area-inset-bottom">
        <MovieListCell :items="filterMovies" />
        <div v-show="!movies.length" class="movie-list__skeletons">
          <div
            v-for="n in 5"
            :key="n"
            class="app-surface movie-list__skeleton-card"
          >
            <van-skeleton
              class="padding-bt-5"
              :row="2"
              title
              avatar
              avatar-shape="square"
              avatar-size="80"
            />
          </div>
        </div>
      </div>
      <div v-else class="list__content with-safe-area-inset-bottom">
        <section v-for="group in filterMoviesGroupByDate" :key="group.releaseDate" class="movie-group app-section">
          <div class="movie-group__header">
            <van-tag type="primary" size="large" plain>
              {{ group.releaseDate }}
            </van-tag>
            <span class="movie-group__count">{{ group.movies.length }} 部電影</span>
          </div>
          <MovieListCell :items="group.movies" />
        </section>
        <div v-show="!moviesGroupByDate.length" class="movie-list__skeletons">
          <div
            v-for="n in 5"
            :key="n"
            class="app-surface movie-list__skeleton-card"
          >
            <van-skeleton
              class="padding-bt-5"
              :row="2"
              title
              avatar
              avatar-shape="square"
              avatar-size="80"
            />
          </div>
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
.movie-list__search {
  margin-bottom: 12px;
  border-radius: 18px;
  overflow: hidden;
}

.movie-list__skeletons {
  display: grid;
  gap: 14px;
}

.movie-list__skeleton-card {
  padding: 16px;
}

.movie-group__header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;
}

.movie-group__count {
  font-size: 13px;
  color: var(--van-text-color-2);
}
</style>
