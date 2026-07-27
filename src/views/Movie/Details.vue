<script setup lang="ts">
import _isEqual from 'lodash/isEqual'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from '@/plugins/dayjs'
import { movieRef } from '@/plugins/firebase'
import { shareTargetPicker } from '@/plugins/liff'
import { Toast } from '@/plugins/vant'
import { movieSVC } from '@/services'
import { useAppStore } from '@/store'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { isLoggedIn, profile } = storeToRefs(appStore)

const movieInfo = ref<any>({})
const theaterList = ref<any[]>([])
const cacheTheaterList = ref<any[]>([])
const favoriteList = ref<any[]>([])
const cityId = shallowRef(route.query.cityId?.toString() || window.localStorage.getItem('cityId') || '')
const isEmpty = shallowRef(false)

const movieId = route.params.id?.toString() ?? ''
const citys = computed(() => movieInfo.value?.citys ?? [])
const isFavorite = computed(() => favoriteList.value.some(item => item.id === movieInfo.value.id))
const posterSrc = computed(() => {
  return !movieInfo.value.poster || movieInfo.value.poster.includes('l10l010l3322l1')
    ? 'https://via.placeholder.com/250x370?text=404'
    : `https://www.atmovies.com.tw${movieInfo.value.poster}`
})

watch(citys, (items) => {
  if (!items.length) {
    return
  }

  const hasCurrent = items.find((item: any) => item.id === cityId.value)
  if (!hasCurrent) {
    cityId.value = items[0].id
  }
})

watch(cityId, (newValue, oldValue) => {
  theaterList.value = []

  movieRef.child(`movie-${movieId}`).off()
  if (oldValue) {
    movieRef.child(`movie-${movieId}-${oldValue}`).off()
  }
  if (newValue) {
    movieRef.child(`movie-${movieId}-${newValue}`).off()
  }

  movieRef.child(`movie-${movieId}${newValue ? `-${newValue}` : ''}`).on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      movieInfo.value = data.item
      cacheTheaterList.value = data.items || []

      if (dayjs().isSame(data.dateCreated, 'day')) {
        theaterList.value = cacheTheaterList.value
      }
    }
  })

  getMovieTimesById()
}, { immediate: true })

watch(isLoggedIn, (value) => {
  if (value) {
    getFavoriteMovies()
  }
}, { immediate: true })

onBeforeUnmount(() => {
  movieRef.child(`movie-${movieId}`).off()
  if (cityId.value) {
    movieRef.child(`movie-${movieId}-${cityId.value}`).off()
  }
})

async function getMovieTimesById() {
  isEmpty.value = false

  const ret = await movieSVC.getMovieTimesById(movieId, cityId.value)
  if (!ret.success) {
    return
  }

  if (!ret.items.length) {
    isEmpty.value = true
  }

  if (!_isEqual(cacheTheaterList.value, ret.items) || !_isEqual(movieInfo.value, ret.item)) {
    movieRef.child(`movie-${movieId}${cityId.value ? `-${cityId.value}` : ''}`).set({
      item: ret.item,
      items: ret.items,
      dateCreated: dayjs().valueOf(),
    })
  }

  movieInfo.value = ret.item
  theaterList.value = ret.items
}

function getFavoriteMovies() {
  if (!isLoggedIn.value || !profile.value?.userId) {
    return
  }

  movieRef.child(`favorite-movie-${profile.value.userId}`).once('value', (snapshot) => {
    const data = snapshot.val()
    if (data?.length) {
      favoriteList.value = data
    }
  })
}

function toggleFavorite() {
  if (!isLoggedIn.value || !profile.value?.userId) {
    Toast.fail('必須要登入才可以使用唷！')
    return
  }

  if (isFavorite.value) {
    favoriteList.value = favoriteList.value.filter(item => item.id !== movieInfo.value.id)
  }
  else {
    favoriteList.value.push({
      ...movieInfo.value,
      dateCreated: dayjs().valueOf(),
    })
  }

  movieRef.child(`favorite-movie-${profile.value.userId}`).set(favoriteList.value)
}

function isExpired(time: string) {
  return dayjs().isAfter(dayjs(time, 'HH：mm'))
}

function watchTrailer() {
  const url = movieInfo.value.trailer
  if (!url) {
    return
  }

  if (window.liff.isInClient()) {
    window.liff.openWindow({ url, external: true })
  }
  else {
    window.open(url)
  }
}

function goTheater(item: any) {
  router.push({ name: 'MovieTheaterDetails', params: { id: item.id }, query: { cityId: cityId.value, title: item.name } })
}

async function share(item: any) {
  if (!isLoggedIn.value) {
    Toast.fail('必須要登入才可以使用唷！')
    return
  }

  const contents: any[] = []
  item.versions.forEach((version: any) => {
    const timeArr = version.times.map((time: string) => time.replace('：', ':'))
    const columnNum = Math.ceil(timeArr.length / 5)

    contents.push({ type: 'text', text: version.name, weight: 'bold', size: 'sm', margin: 'md' })
    contents.push({
      type: 'box',
      layout: 'horizontal',
      margin: 'md',
      contents: new Array(columnNum).fill('').map((_, index) => ({
        type: 'box',
        layout: 'vertical',
        contents: timeArr
          .filter((time: string, timeIndex: number) => timeIndex < (index + 1) * 5 && timeIndex >= index * 5)
          .map((time: string) => ({ type: 'text', text: time, size: 'xs', margin: 'sm' })),
      })),
    })
    contents.push({ type: 'separator', margin: 'md' })
  })

  const message = [{
    type: 'flex',
    altText: '這是一個Flex Message',
    size: 'giga',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: movieInfo.value.name, size: 'md', weight: 'bold' },
          { type: 'text', text: item.name, size: 'sm', margin: 'sm' },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents,
      },
      action: {
        type: 'uri',
        uri: `${window.location.href}?cityId=${cityId.value}`,
      },
    },
  }]

  const isOk = await shareTargetPicker(message)
  if (isOk) {
    Toast('分享成功！')
  }
}
</script>

<template>
  <div class="movie-details padding-b-30">
    <section v-if="!movieInfo.id" class="movie-details__hero app-surface">
      <div class="padding-bt-10">
        <van-skeleton
          title
          avatar
          avatar-shape
          avatar-size="80"
          :row="4"
        />
      </div>
    </section>

    <section v-else class="movie-details__hero app-surface">
      <div class="movie-details__hero-head">
        <van-image
          class="movie-details__poster"
          :src="posterSrc"
          width="128"
          height="184"
          radius="20"
          fit="cover"
        />
        <div class="movie-details__hero-copy">
          <div class="movie-details__title-row">
            <div>
              <div class="movie-details__title">
                {{ movieInfo.name }}
              </div>
              <div class="movie-details__description">
                {{ movieInfo.description }}
              </div>
            </div>
            <van-image
              v-if="movieInfo.cerImg"
              class="movie-details__badge"
              width="40"
              fit="contain"
              :src="movieInfo.cerImg"
            />
          </div>

          <div class="movie-details__meta">
            <van-tag v-if="movieInfo.runtime" plain class="margin-r-5 margin-bt-5">
              片長: {{ movieInfo.runtime }} 分
            </van-tag>
            <van-tag v-if="movieInfo.releaseDate" plain class="margin-bt-5">
              上映日期: {{ movieInfo.releaseDate }}
            </van-tag>
          </div>

          <div class="movie-details__actions text-left">
            <van-button
              :icon="isFavorite ? 'like' : 'like-o'"
              color="#f48fb1"
              type="default"
              :plain="!isFavorite"
              size="small"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '已收藏電影' : '收藏電影' }}
            </van-button>
            <van-button
              v-if="movieInfo.trailer"
              class="margin-l-10"
              type="info"
              icon="video-o"
              size="small"
              plain
              @click="watchTrailer"
            >
              電影預告
            </van-button>
          </div>
        </div>
      </div>
    </section>

    <van-tabs v-if="citys.length" v-model="cityId" class="movie-details__tabs margin-t-10">
      <van-tab
        v-for="item in citys"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      />
    </van-tabs>

    <section v-for="item in theaterList" :key="item.id" class="movie-details__theater app-surface">
      <div class="movie-details__theater-head">
        <div>
          <div class="movie-details__theater-name" @click="goTheater(item)">
            {{ item.name }}
          </div>
          <div class="little-text">
            {{ item.versions?.length || 0 }} 種版本
          </div>
        </div>
        <div>
          <van-button
            type="info"
            icon="share"
            size="mini"
            plain
            @click="share(item)"
          >
            分享
          </van-button>
        </div>
      </div>

      <div class="movie-details__theater-body">
        <div v-for="(v, i) in item.versions" :key="i">
          <van-divider content-position="left">
            {{ v.name || '數位' }}
          </van-divider>
          <van-tag
            v-for="(time, n) in v.times"
            :key="n"
            class="margin-a-5"
            :type="isExpired(time) ? 'default' : 'success'"
            plain
          >
            {{ time }}
          </van-tag>
        </div>
      </div>
    </section>

    <section v-if="!theaterList.length && !isEmpty" class="movie-details__skeleton app-surface">
      <van-skeleton title :row="3" />
    </section>

    <section v-if="isEmpty" class="app-surface app-empty">
      目前沒有可用場次資訊
    </section>
  </div>
</template>

<style lang="scss" scoped>
.movie-details__hero,
.movie-details__theater,
.movie-details__skeleton {
  padding: 20px;
  margin-bottom: 14px;
}

.movie-details__hero-head {
  display: grid;
  grid-template-columns: 128px 1fr;
  gap: 18px;
}

.movie-details__title,
.movie-details__theater-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--van-text-color);
}

.movie-details__description {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--van-text-color-2);
}

.movie-details__title-row,
.movie-details__theater-head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.movie-details__meta,
.movie-details__actions {
  margin-top: 14px;
}

.movie-details__theater-body {
  margin-top: 14px;
}

@media (max-width: 640px) {
  .movie-details__hero-head {
    grid-template-columns: 1fr;
  }
}
</style>
