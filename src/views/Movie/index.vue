<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const movieLinks = [
  {
    icon: 'wap-home',
    label: '電影院查詢',
    routeName: 'MovieTheaterList',
  },
  {
    icon: 'video',
    label: '上映中電影查詢',
    routeName: 'MovieList',
  },
  {
    icon: 'new',
    label: '近期上映',
    routeName: 'MovieNext',
  },
  {
    icon: 'play-circle-o',
    label: '威秀時刻表',
    routeName: 'MovieVieshow',
  },
  {
    icon: 'like-o',
    label: '收藏的電影',
    routeName: 'MovieFavoriteList',
  },
]

function goFeature(routeName: string) {
  router.push({ name: routeName })
}
</script>

<template>
  <div class="movie-home">
    <section class="app-section movie-home__grid">
      <button
        v-for="item in movieLinks"
        :key="item.routeName"
        type="button"
        class="movie-home__card app-surface"
        @click="goFeature(item.routeName)"
      >
        <div class="movie-home__card-icon">
          <van-icon :name="item.icon" size="28" />
        </div>
        <div class="movie-home__card-title">
          {{ item.label }}
        </div>
      </button>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.movie-home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.movie-home__card {
  width: 100%;
  padding: 20px;
  border: 0;
  text-align: left;
}

.movie-home__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  background: rgba(25, 137, 250, 0.08);
  color: var(--van-primary-color);
}

.movie-home__card-title {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 700;
  color: var(--van-text-color);
}
</style>
