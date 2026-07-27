<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { showConfirmDialog } from 'vant'
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { movieRef } from '@/plugins/firebase'
import { Toast } from '@/plugins/vant'
import { filters } from '@/plugins/vue-filter'
import { useAppStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const { isLoggedIn, profile } = storeToRefs(appStore)

const favoriteList = ref<any[]>([])
const isLoading = shallowRef(false)

onMounted(() => {
  if (!isLoggedIn.value || !profile.value?.userId) {
    Toast.fail('必須要登入才可以使用唷！')
    router.replace({ name: 'MovieSearchTypeChoice' })
    return
  }

  isLoading.value = true
  movieRef.child(`favorite-movie-${profile.value.userId}`).on('value', (snapshot) => {
    const data = snapshot.val()
    favoriteList.value = data?.length ? data : []
    isLoading.value = false
  })
})

onBeforeUnmount(() => {
  if (profile.value?.userId) {
    movieRef.child(`favorite-movie-${profile.value.userId}`).off()
  }
})

async function removeFavorite(item: any) {
  if (!profile.value?.userId) {
    return
  }

  try {
    await showConfirmDialog({
      title: '確定要刪除收藏嗎？',
    })

    favoriteList.value = favoriteList.value.filter(favorite => favorite.id !== item.id)
    movieRef.child(`favorite-movie-${profile.value.userId}`).set(favoriteList.value)
  }
  catch (err) {
    console.log(err)
  }
}

function getSrc(src = '') {
  return !src || src.includes('l10l010l3322l1')
    ? 'https://via.placeholder.com/250x370?text=404'
    : `https://www.atmovies.com.tw${src}`
}

function goMovie(item: any) {
  router.push({ name: 'MovieDetails', params: { id: item.id }, query: { title: item.name } })
}
</script>

<template>
  <div class="favorite-list">
    <div v-if="isLoading" class="movie-favorites__stack">
      <div v-for="n in 3" :key="n" class="app-surface movie-favorites__skeleton">
        <van-skeleton
          title
          avatar
          avatar-shape
          :row="4"
        />
      </div>
    </div>

    <article
      v-for="item in favoriteList"
      :key="item.id"
      class="movie-favorites__card app-surface"
    >
      <div class="movie-favorites__head">
        <div>
          <div class="movie-favorites__card-title">
            {{ item.name }}
          </div>
          <div class="little-text">
            加入收藏日期 {{ filters.formatDate(item.dateCreated) }}
          </div>
        </div>
        <van-image
          v-if="item.cerImg"
          width="40"
          fit="contain"
          :src="item.cerImg"
          lazy-load
        />
      </div>

      <div class="movie-favorites__body">
        <van-image
          class="movie-favorites__poster"
          :src="getSrc(item.poster)"
          width="92"
          height="132"
          radius="18"
          fit="cover"
          lazy-load
          @click="goMovie(item)"
        />
        <div class="movie-favorites__content">
          <p class="movie-favorites__description">
            {{ item.description || '暫無簡介。' }}
          </p>
          <div class="movie-favorites__meta">
            <van-tag plain class="margin-r-5 margin-bt-5">
              片長: {{ item.runtime }} 分
            </van-tag>
            <van-tag plain class="margin-bt-5">
              上映日期: {{ item.releaseDate }}
            </van-tag>
          </div>
        </div>
      </div>

      <div class="movie-favorites__footer">
        <van-button size="small" plain @click="goMovie(item)">
          查看電影
        </van-button>
        <div>
          <van-button
            icon="delete"
            type="danger"
            size="small"
            @click="removeFavorite(item)"
          >
            刪除收藏
          </van-button>
        </div>
      </div>
    </article>

    <section v-if="!favoriteList.length && !isLoading" class="app-surface app-empty">
      這裡還什麼都沒有
    </section>
  </div>
</template>

<style lang="scss" scoped>
.favorite-list {
  padding-bottom: calc(env(safe-area-inset-bottom) + 65px);
}

.movie-favorites__card,
.movie-favorites__skeleton {
  padding: 20px;
  margin-bottom: 14px;
}

.movie-favorites__card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.movie-favorites__head,
.movie-favorites__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.movie-favorites__body {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 16px;
  margin-top: 16px;
}

.movie-favorites__description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--van-text-color-2);
}

.movie-favorites__meta {
  margin-top: 12px;
}
</style>
