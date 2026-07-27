<script setup lang="ts">
import _isEqual from 'lodash/isEqual'
import { storeToRefs } from 'pinia'
import { showFailToast } from 'vant'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from '@/plugins/dayjs'
import { movieRef } from '@/plugins/firebase'
import { movieSVC } from '@/services'
import { useAppStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()
const { isLoggedIn, profile } = storeToRefs(appStore)

const cityId = shallowRef(window.localStorage.getItem('cityId') || '')
const citys = ref<any[]>([])
const theaters = ref<any[]>([])
const favoriteList = ref<any[]>([])
const activeTab = shallowRef(window.localStorage.getItem('theaters-activeTab') || 'search')
const keyword = shallowRef('')
const isEmpty = shallowRef(false)

const filterList = computed(() => {
  const source = isFavoriteMode.value ? favoriteList.value : theaters.value
  return source.filter(item => (keyword.value ? item.name.includes(keyword.value) : true))
})

const cityOptions = computed(() => citys.value.map(item => ({ text: item.name, value: item.id })))
const isFavoriteMode = computed(() => activeTab.value === 'favorite')

watch(cityId, (value) => {
  getTheaterList()
  window.localStorage.setItem('cityId', value)
}, { immediate: true })

watch(activeTab, (value) => {
  window.localStorage.setItem('theaters-activeTab', value)
})

watch(isLoggedIn, (value) => {
  if (value) {
    getFavoriteTheaters()
  }
}, { immediate: true })

onMounted(() => {
  movieRef.child('citys').on('value', (snapshot) => {
    const data = snapshot.val()
    if (data && data.items?.length) {
      citys.value = data.items
      if (!cityId.value) {
        cityId.value = citys.value[0].id
      }
    }
  })

  getCityList()
})

onBeforeUnmount(() => {
  movieRef.child('citys').off()
})

async function getCityList() {
  const ret = await movieSVC.getCityList()
  if (!ret.success) {
    return
  }

  if (!_isEqual(citys.value, ret.items)) {
    movieRef.child('citys').set({ items: ret.items, dateCreated: dayjs().valueOf() })
  }
}

async function getTheaterList() {
  if (!cityId.value) {
    return
  }

  await movieRef.child(`theaters-${cityId.value}`).once('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      theaters.value = data.items
    }
  })

  const ret = await movieSVC.getTheaterList(cityId.value)
  if (!ret.success) {
    return
  }

  if (!_isEqual(theaters.value, ret.items)) {
    movieRef.child(`theaters-${cityId.value}`).set({ items: ret.items, dateCreated: dayjs().valueOf() })
  }

  theaters.value = ret.items
}

function getFavoriteTheaters() {
  if (!isLoggedIn.value || !profile.value?.userId) {
    return
  }

  isEmpty.value = false
  movieRef.child(`favorite-theaters-${profile.value.userId}`).once('value', (snapshot) => {
    const data = snapshot.val()
    favoriteList.value = data?.length ? data : []
    if (!filterList.value.length) {
      isEmpty.value = true
    }
  })
}

async function toggleFavorite(item: any) {
  if (!isLoggedIn.value || !profile.value?.userId) {
    showFailToast('必須要登入才可以使用唷！')
    return
  }

  if (!favoriteList.value.some(favorite => favorite.id === item.id)) {
    favoriteList.value.push(item)
  }
  else {
    favoriteList.value = favoriteList.value.filter(favorite => favorite.id !== item.id)
  }

  await movieRef.child(`favorite-theaters-${profile.value.userId}`).set(favoriteList.value)
  getFavoriteTheaters()
}

function isFavorite(item: any) {
  return favoriteList.value.some(favorite => favorite.id === item.id)
}

function goDetails(item: any) {
  router.push({ name: 'MovieTheaterDetails', params: { id: item.id }, query: { cityId: cityId.value, title: item.name } })
}
</script>

<template>
  <div class="list__container">
    <van-dropdown-menu v-show="!isFavoriteMode" class="dropdown">
      <van-dropdown-item v-model="cityId" :options="cityOptions" placeholder="安安" />
    </van-dropdown-menu>
    <van-search v-model.trim="keyword" placeholder="請輸入關鍵字篩選" />
    <div class="list__content with-safe-area-inset-bottom">
      <button
        v-for="item in filterList"
        :key="item.id"
        type="button"
        class="movie-theater__card app-surface"
        @click="goDetails(item)"
      >
        <div class="movie-theater__card-head">
          <div class="movie-theater__card-title">
            {{ item.name }}
          </div>
          <van-icon
            class="movie-theater__favorite"
            :name="isFavorite(item) ? 'like' : 'like-o'"
            color="#ec4899"
            @click.stop="toggleFavorite(item)"
          />
        </div>
        <div class="movie-theater__card-foot">
          <span class="little-text">點擊查看場次與上映電影</span>
        </div>
      </button>
      <div v-show="!theaters.length && cityId">
        <van-cell v-for="n in 10" :key="n">
          <van-skeleton title :row="0" />
        </van-cell>
      </div>
      <van-cell v-show="isFavoriteMode && !isLoggedIn">
        <div class="text-center">
          <van-icon class="fs-30" name="warning" />
          <div>必須要登入才可以使用「我的最愛」唷！</div>
        </div>
      </van-cell>
      <van-cell v-show="isFavoriteMode && isEmpty">
        <div class="text-center">
          <van-icon class="fs-30" name="info" />
          <div>這裡還什麼都沒有</div>
        </div>
      </van-cell>
    </div>

    <van-tabbar v-model="activeTab" fixed safe-area-inset-bottom>
      <van-tabbar-item icon="search" name="search">
        地區搜尋
      </van-tabbar-item>
      <van-tabbar-item icon="like" name="favorite">
        我的最愛
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.movie-theater__card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.dropdown {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.movie-theater__card {
  width: 100%;
  padding: 18px;
  border: 0;
  text-align: left;
}

.movie-theater__card + .movie-theater__card {
  margin-top: 12px;
}

.movie-theater__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.movie-theater__favorite {
  font-size: 22px;
}

.movie-theater__card-foot {
  margin-top: 10px;
}
</style>
