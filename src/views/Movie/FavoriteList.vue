<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import moment from 'moment'
import { useMainStore } from '@/store'
import { movieRef } from '@/plugins/firebase'

const router = useRouter()
const store = useMainStore()

// 響應式數據
const favoriteList = ref<any[]>([])
const isLoading = ref(false)

// 計算屬性
const isLoggedIn = () => store.isLoggedIn
const profile = () => store.profile

// 路由守衛邏輯
function checkAuth() {
  if (!isLoggedIn()) {
    showToast({
      message: '必須要登入才可以使用唷！',
      type: 'fail',
    })
    router.push({ name: 'MovieSearchTypeChoice' })
    return false
  }
  return true
}

// 生命週期
onMounted(() => {
  if (!checkAuth()) {
    return
  }

  isLoading.value = true
  movieRef.child(`favorite-movie-${profile().userId}`).on('value', (snapshot: any) => {
    const data = snapshot.val()

    if (data && data?.length) {
      favoriteList.value = data || []
    }
    isLoading.value = false
  })
})

onBeforeUnmount(() => {
  if (profile()?.userId) {
    movieRef.child(`favorite-movie-${profile().userId}`).off()
  }
})

// 方法
async function removeFavorite(item: any) {
  try {
    await showDialog({
      title: '確定要刪除收藏嗎？',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    })

    favoriteList.value = favoriteList.value.filter((f: any) => f.id !== item.id)

    movieRef.child(`favorite-movie-${profile().userId}`).set(favoriteList.value)
  } catch (err) {
    console.log(err)
  }
}

function getSrc(src = '') {
  return !src || src.includes('l10l010l3322l1') ? 'https://via.placeholder.com/250x370?text=404' : src
}

function goMovie({ id }: any) {
  router.push({ name: 'MovieDetails', params: { id } })
}

function formatDate(date: string) {
  return moment(date).format('YYYY/MM/DD')
}
</script>

<template>
  <div class="favorite-list">
    <van-panel v-show="isLoading">
      <template #header>
        <div class="padding-bt-10">
          <van-skeleton
            title
            avatar
            :row="4"
          />
        </div>
      </template>
    </van-panel>
    <van-panel
      v-for="item in favoriteList"
      v-show="!isLoading"
      :key="item.id"
      class="margin-bt-10"
    >
      <template #header>
        <van-cell :title="item.name" size="large">
          <template #right-icon>
            <van-image
              width="40"
              fit="contain"
              :src="item.cerImg"
              lazy-load
            />
          </template>
        </van-cell>
      </template>
      <van-row class="padding-lr-15" :gutter="15">
        <van-col span="7">
          <van-image
            :src="getSrc(item.poster)"
            width="100%"
            lazy-load
            @click="goMovie(item)"
          />
        </van-col>
        <van-col span="17">
          <p class="fs-14">
            {{ item.description }}
          </p>
          <van-tag plain class="margin-r-5 margin-bt-5">
            片長: {{ item.runtime }} 分
          </van-tag>
          <van-tag plain class="margin-bt-5">
            上映日期: {{ item.releaseDate }}
          </van-tag>
        </van-col>
      </van-row>
      <template #footer>
        <div class="flex-between">
          <div class="little-text">
            加入收藏日期 {{ formatDate(item.dateCreated) }}
          </div>
          <van-button
            icon="delete"
            type="danger"
            size="small"
            @click="removeFavorite(item)"
          >
            刪除收藏
          </van-button>
        </div>
      </template>
    </van-panel>
    <van-panel v-show="!favoriteList.length && !isLoading">
      <template #header>
        <div class="text-center padding-bt-30">
          <van-icon class="fs-30" name="info" />
          <div>這裡還什麼都沒有</div>
        </div>
      </template>
    </van-panel>
  </div>
</template>

<style lang="scss" scoped>
.favorite-list {
  padding-bottom: calc(env(safe-area-inset-bottom) + 65px);
}
</style>
