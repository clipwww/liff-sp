<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  items?: any[]
}>(), {
  items: () => [],
})

const router = useRouter()

function getPosterSrc(src = '') {
  return !src || src.includes('l10l010l3322l1')
    ? 'https://via.placeholder.com/250x370?text=404'
    : `https://www.atmovies.com.tw${src}`
}

function goDetails(item: any) {
  router.push({
    name: 'MovieDetails',
    params: { id: item.id },
    query: { title: item.name },
  })
}
</script>

<template>
  <div class="movie-cards">
    <article
      v-for="(item, index) in props.items"
      :key="item.id"
      class="movie-card app-surface"
      @click="goDetails(item)"
    >
      <van-image
        class="movie-card__poster"
        width="92"
        height="132"
        fit="cover"
        radius="18"
        :src="getPosterSrc(item.poster)"
        :lazy-load="index > 0"
      />

      <div class="movie-card__body">
        <div class="movie-card__header">
          <div>
            <h3 class="movie-card__title">
              {{ item.name }}
            </h3>
            <p class="movie-card__description">
              {{ item.description || '暫無簡介，點擊查看完整場次與更多資訊。' }}
            </p>
          </div>

          <van-image
            v-if="item.cerImg"
            class="movie-card__badge"
            width="34"
            height="34"
            fit="contain"
            :src="item.cerImg"
            :lazy-load="index > 0"
          />
        </div>

        <div class="movie-card__meta">
          <van-tag v-if="item.releaseDate" plain type="primary">
            {{ item.releaseDate }}
          </van-tag>
          <van-tag v-if="item.runtime" plain>
            {{ item.runtime }} 分鐘
          </van-tag>
        </div>
      </div>
    </article>
  </div>
</template>

<style lang="scss" scoped>
.movie-cards {
  display: grid;
  gap: 14px;
}

.movie-card {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 16px;
  padding: 16px;
}

.movie-card__poster {
  overflow: hidden;
}

.movie-card__body {
  min-width: 0;
}

.movie-card__header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.movie-card__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
  color: var(--van-text-color);
}

.movie-card__description {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--van-text-color-2);
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.movie-card__badge {
  flex-shrink: 0;
}

.movie-card__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

@media (max-width: 640px) {
  .movie-card {
    grid-template-columns: 80px minmax(0, 1fr);
    gap: 14px;
  }
}
</style>
