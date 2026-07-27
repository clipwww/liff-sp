<script setup lang="ts">
import _isEqual from 'lodash/isEqual'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import MovieListCell from '@/components/MovieListCell.vue'
import dayjs from '@/plugins/dayjs'
import { movieRef } from '@/plugins/firebase'
import { movieSVC } from '@/services'

const keyword = shallowRef('')
const moviesGroupByDate = ref<any[]>([])

const filterMoviesGroupByDate = computed(() => {
  return moviesGroupByDate.value
    .map((item) => {
      return {
        ...item,
        movies: item.movies.filter((movie: any) => (keyword.value ? movie.name.includes(keyword.value) : true)),
      }
    })
    .filter(item => item.movies.length)
})

onMounted(() => {
  movieRef.child('movies-next').on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      moviesGroupByDate.value = data.items
    }
  })

  getMoviesGroupByDate()
})

onBeforeUnmount(() => {
  movieRef.child('movies-next').off()
})

async function getMoviesGroupByDate() {
  const ret = await movieSVC.getMovieNextList()
  if (!ret.success) {
    return
  }

  if (!_isEqual(moviesGroupByDate.value, ret.items)) {
    movieRef.child('movies-next').set({
      items: ret.items,
      dateCreated: dayjs().valueOf(),
    })
  }
}
</script>

<template>
  <div class="movie-list">
    <div class="list__container">
      <van-search v-model.trim="keyword" class="movie-next__search" placeholder="請輸入關鍵字搜尋" />

      <div class="list__content padding-b-30">
        <section v-for="(group, index) in filterMoviesGroupByDate" :key="index" class="movie-group app-section">
          <div class="movie-group__header">
            <van-tag type="primary" size="large" plain>
              {{ group.releaseDate }}
            </van-tag>
            <span class="movie-group__count">{{ group.movies.length }} 部電影</span>
          </div>
          <MovieListCell :items="group.movies" />
        </section>
        <div v-show="!moviesGroupByDate.length" class="movie-next__skeletons">
          <div v-for="n in 10" :key="n" class="app-surface movie-next__skeleton-card">
            <van-skeleton :row="1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.movie-next__search {
  margin-bottom: 12px;
  border-radius: 18px;
  overflow: hidden;
}

.movie-next__skeletons {
  display: grid;
  gap: 14px;
}

.movie-next__skeleton-card {
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
