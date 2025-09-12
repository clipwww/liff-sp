<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import moment from 'moment'
import _isEqual from 'lodash/isEqual'
import { ref as dbRef, get, getDatabase, off, onValue, set } from 'firebase/database'

import { movieSVC } from '@/services'
import { shareTargetPicker } from '@/plugins/liff'
import { useMainStore } from '@/store'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

// 響應式數據
const movieInfo = ref({})
const theaterList = ref([])
const cacheTheaterList = ref([])
const favoriteList = ref([])
const cityId = ref(route.query.cityId || window.localStorage.getItem('cityId') || '')
const isEmpty = ref(false)

// 計算屬性
const isLoggedIn = computed(() => store.isLoggedIn)
const profile = computed(() => store.profile)
const citys = computed(() => movieInfo.value?.citys ?? [])
const movieId = computed(() => route.params.id)
const isFavorite = computed(() => !!favoriteList.value.find(item => item.id === movieInfo.value.id))
const posterSrc = computed(() => {
  return !movieInfo.value.poster || movieInfo.value.poster.includes('l10l010l3322l1')
    ? 'https://via.placeholder.com/250x370?text=404'
    : movieInfo.value.poster
})

// 監聽器
watch(citys, (arr) => {
  if (arr.length) {
    const lsCity = arr.find(item => item.id === cityId.value)
    if (!lsCity) {
      cityId.value = arr[0].id
    }
  }
})

watch(cityId, (newVal, oldVal) => {
  theaterList.value = []

  off(dbRef(getDatabase(), `movie-${movieId.value}`))
  off(dbRef(getDatabase(), `movie-${movieId.value}-${oldVal}`))
  off(dbRef(getDatabase(), `movie-${movieId.value}-${newVal}`))
  onValue(dbRef(getDatabase(), `movie-${movieId.value}${newVal ? `-${newVal}` : ''}`), (snapshot) => {
    const data = snapshot.val()
    if (data) {
      movieInfo.value = data.item
      cacheTheaterList.value = data.items || []

      if (moment().isSame(data.dateCreated, 'day')) {
        // 同一天的資料
        theaterList.value = cacheTheaterList.value
      }
    }
  })

  getMovieTimesById()
})

watch(isLoggedIn, (bool) => {
  if (bool) {
    getFavoriteMovies()
  }
}, { immediate: true })

// 生命週期
onMounted(() => {
  // 觸發 cityId 的監聽器
  const currentCityId = cityId.value
  cityId.value = currentCityId
})

onBeforeUnmount(() => {
  off(dbRef(getDatabase(), `movie-${movieId.value}`))
  off(dbRef(getDatabase(), `movie-${movieId.value}-${cityId.value}`))
})

// 方法
async function getMovieTimesById() {
  isEmpty.value = false

  const ret = await movieSVC.getMovieTimesById(movieId.value, cityId.value)
  if (!ret.success) {
    return
  }

  if (!ret.items.length) {
    isEmpty.value = true
  }

  if (!_isEqual(cacheTheaterList.value, ret.items) || !_isEqual(movieInfo.value, ret.item)) {
    set(dbRef(getDatabase(), `movie-${movieId.value}${cityId.value ? `-${cityId.value}` : ''}`), {
      item: ret.item,
      items: ret.items,
      dateCreated: +moment(),
    })
  }

  movieInfo.value = ret.item
  theaterList.value = ret.items
}

function getFavoriteMovies() {
  if (!isLoggedIn.value) {
    return
  }
  get(dbRef(getDatabase(), `favorite-movie-${profile.value.userId}`)).then((snapshot) => {
    const data = snapshot.val()
    if (data && data?.length) {
      favoriteList.value = data || []
    }
  })
}

function toggleFavorite() {
  if (!isLoggedIn.value) {
    showToast({
      message: '必須要登入才可以使用唷！',
      type: 'fail',
    })
    return
  }

  if (isFavorite.value) {
    favoriteList.value = favoriteList.value.filter(item => item.id !== movieInfo.value.id)
  } else {
    favoriteList.value.push({
      ...movieInfo.value,
      dateCreated: +moment(),
    })
  }

  set(dbRef(getDatabase(), `favorite-movie-${profile.value.userId}`), favoriteList.value)
}

function isExpired(time) {
  return moment().isAfter(moment(time, 'HH：mm'))
}

function watchTrailer() {
  const url = movieInfo.value.trailer
  if (window.liff.isInClient()) {
    window.liff.openWindow({
      url,
      external: true,
    })
  } else {
    window.open(url)
  }
}

function goTheater(item) {
  router.push({
    name: 'MovieTheaterDetails',
    params: { id: item.id },
    query: { cityId: cityId.value },
  })
}

async function share(item) {
  if (!isLoggedIn.value) {
    showToast({
      message: '必須要登入才可以使用唷！',
      type: 'fail',
    })
    return
  }

  const contents = []
  item.versions.forEach((v) => {
    const timeArr = v.times.map(t => t.replace('：', ':'))
    const colmunNum = Math.ceil(timeArr.length / 5)

    contents.push({
      type: 'text',
      text: v.name,
      weight: 'bold',
      size: 'sm',
      margin: 'md',
    })

    contents.push({
      type: 'box',
      layout: 'horizontal',
      margin: 'md',
      contents: Array(colmunNum)
        .fill('')
        .map((s, i) => {
          return {
            type: 'box',
            layout: 'vertical',
            contents: timeArr
              .filter((t, index) => index < (i + 1) * 5 && index >= i * 5)
              .map((t) => {
                return {
                  type: 'text',
                  text: t,
                  size: 'xs',
                  margin: 'sm',
                }
              }),
          }
        }),
    })

    contents.push({
      type: 'separator',
      margin: 'md',
    })
  })
  const message = [
    {
      type: 'flex',
      altText: '這是一個Flex Message',
      size: 'giga',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: movieInfo.value.name,
              size: 'md',
              weight: 'bold',
            },
            {
              type: 'text',
              text: item.name,
              size: 'sm',
              margin: 'sm',
            },
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
    },
  ]
  console.log(message)
  const isOk = await shareTargetPicker(message)

  if (isOk) {
    showToast('分享成功！')
  }
}
</script>

<template>
  <div class="padding-b-30">
    <van-card v-if="!movieInfo.id">
      <template #desc>
        <div class="padding-bt-10">
          <van-skeleton
            title
            avatar
            avatar-shape
            avatar-size="80"
            :row="4"
          />
        </div>
      </template>
    </van-card>
    <van-card v-else>
      <template #title>
        <van-cell :title="movieInfo.name" size="large">
          <template #right-icon>
            <van-image
              class="margin-l-5"
              width="40"
              fit="contain"
              :src="movieInfo.cerImg"
            />
          </template>
        </van-cell>
      </template>
      <template #desc>
        <van-row class="padding-lr-15" :gutter="15">
          <van-col span="7">
            <van-image :src="posterSrc" />
          </van-col>
          <van-col span="17">
            <p class="fs-14">
              {{ movieInfo.description }}
            </p>
            <van-tag
              v-if="movieInfo.runtime"
              plain
              class="margin-r-5 margin-bt-5"
            >
              片長: {{ movieInfo.runtime }} 分
            </van-tag>
            <van-tag
              v-if="movieInfo.releaseDate"
              plain
              class="margin-bt-5"
            >
              上映日期: {{ movieInfo.releaseDate }}
            </van-tag>
          </van-col>
        </van-row>
      </template>
      <template #footer>
        <div class="text-left">
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
      </template>
    </van-card>

    <van-tabs v-model="cityId" class="margin-t-10">
      <van-tab
        v-for="item in citys"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      />
    </van-tabs>
    <van-card v-for="item in theaterList" :key="item.id">
      <template #title>
        <div class="flex-between">
          <div class="fs-14" @click="goTheater(item)">
            {{ item.name }}
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
      </template>
      <template #desc>
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
      </template>
    </van-card>
    <van-card v-if="!theaterList.length && !isEmpty">
      <template #desc>
        <van-skeleton title :row="3" />
      </template>
    </van-card>
  </div>
</template>

<style lang="scss">
</style>
