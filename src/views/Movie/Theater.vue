<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import moment from 'moment'
import _isEqual from 'lodash/isEqual'
import { ref as dbRef, get, getDatabase, off, onValue, set } from 'firebase/database'

import { movieSVC } from '@/services'
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

// 響應式數據
const cityId = ref<string>(window.localStorage.getItem('cityId') || '')
const citys = ref<any[]>([])
const theaters = ref<any[]>([])
const favoriteList = ref<any[]>([])
const activeTab = ref<string>(window.localStorage.getItem('theaters-activeTab') || 'search')
const keyword = ref<string>('')
const isEmpty = ref<boolean>(false)

// 計算屬性
const isLoggedIn = computed(() => store.isLoggedIn)
const profile = computed(() => store.profile)
const isFavorteMode = computed(() => activeTab.value === 'favorite')
const filterList = computed(() => {
  return (isFavorteMode.value ? favoriteList.value : theaters.value).filter(item =>
    keyword.value ? item.name.includes(keyword.value) : true,
  )
})
const cityOptions = computed(() => {
  return citys.value.map((item: any) => {
    return {
      text: item.name,
      value: item.id,
    }
  })
})

// 監聽器
watch(cityId, (val) => {
  getTheaterList()
  window.localStorage.setItem('cityId', val)
}, { immediate: true })

watch(activeTab, (val) => {
  window.localStorage.setItem('theaters-activeTab', val)
})

watch(isLoggedIn, (bool) => {
  if (bool) {
    getFavoriteTheaters()
  }
}, { immediate: true })

// 生命週期
onMounted(() => {
  onValue(dbRef(getDatabase(), 'citys'), (snapshot: any) => {
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
  off(dbRef(getDatabase(), 'citys'))
})

// 方法
async function getCityList() {
  const ret = await movieSVC.getCityList()
  if (!ret.success) {
    return
  }

  if (!_isEqual(citys.value, ret.items)) {
    set(dbRef(getDatabase(), 'citys'), {
      items: ret.items,
      dateCreated: +moment(),
    })
  }
}

async function getTheaterList() {
  if (!cityId.value) {
    return
  }

  const snapshot = await get(dbRef(getDatabase(), `theaters-${cityId.value}`))
  const data = snapshot.val()
  if (data) {
    theaters.value = data.items
  }

  const ret = await movieSVC.getTheaterList(cityId.value)
  if (!ret.success) {
    return
  }

  if (!_isEqual(theaters.value, ret.items)) {
    set(dbRef(getDatabase(), `theaters-${cityId.value}`), {
      items: ret.items,
      dateCreated: +moment(),
    })
  }
  theaters.value = ret.items
}

function getFavoriteTheaters() {
  if (!isLoggedIn.value) {
    return
  }

  isEmpty.value = false
  get(dbRef(getDatabase(), `favorite-theaters-${profile.value.userId}`)).then((snapshot: any) => {
    const data = snapshot.val()
    if (data && data?.length) {
      favoriteList.value = data || []
    }

    if (!filterList.value.length) {
      isEmpty.value = true
    }
  })
}

async function toggleFavorite(item: any) {
  if (!isLoggedIn.value) {
    showToast({
      message: '必須要登入才可以使用唷！',
      type: 'fail',
    })
    return
  }

  if (!favoriteList.value.find(f => f.id === item.id)) {
    favoriteList.value.push(item)
  } else {
    favoriteList.value = favoriteList.value.filter(f => f.id !== item.id)
  }

  await set(dbRef(getDatabase(), `favorite-theaters-${profile.value.userId}`), favoriteList.value)
  getFavoriteTheaters()
}

function isFavorite(item: any) {
  return !!favoriteList.value.find(f => f.id === item.id)
}

function goDetails(item: any) {
  router.push({
    name: 'MovieTheaterDetails',
    params: { id: item.id },
    query: { cityId: cityId.value, title: item.name },
  })
}
</script>

<template>
  <div class="list__container">
    <van-dropdown-menu v-show="!isFavorteMode" class="dropdown">
      <van-dropdown-item v-model="cityId" :options="cityOptions" placeholder="安安" />
    </van-dropdown-menu>
    <van-search v-model.trim="keyword" placeholder="請輸入關鍵字篩選" />
    <div class="list__content with-safe-area-inset-bottom">
      <van-cell
        v-for="item in filterList"
        :key="item.id"
        is-link
        @click="goDetails(item)"
      >
        <template #icon>
          <van-icon
            class="lh-inherit margin-r-10"
            :name="isFavorite(item) ? 'like' : 'like-o'"
            color="#f48fb1"
            @click.stop="toggleFavorite(item)"
          />
        </template>
        {{ item.name }}
      </van-cell>
      <div v-show="!theaters.length && cityId">
        <van-cell v-for="n in 10" :key="n">
          <van-skeleton title :row="0" />
        </van-cell>
      </div>
      <van-cell v-show="isFavorteMode && !isLoggedIn">
        <div class="text-center">
          <van-icon class="fs-30" name="warning" />
          <div>必須要登入才可以使用「我的最愛」唷！</div>
        </div>
      </van-cell>
      <van-cell v-show="isFavorteMode && isEmpty">
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
.dropdown {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>
