<script setup lang="ts">
import { showImagePreview } from 'vant'
import { computed, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import KomicaPostCell from '@/components/KomicaPostCell.vue'
import { komicaSVC } from '@/services'

const route = useRoute()

const post = shallowRef<any | null>(null)
const isRefreshing = shallowRef(false)
const showPopup = shallowRef(false)

const komicaType = route.name?.toString().includes('KomicaLive') ? 'live' : 'new'
const postId = route.params.id?.toString() ?? ''

const imageObjs = computed(() => {
  const arr: any[] = []
  const replyImages = post.value?.reply?.filter((item: any) => item.sImg && item.oImg) ?? []

  if (post.value?.sImg && post.value?.oImg) {
    arr.push(post.value)
  }

  return arr.concat(replyImages)
})

const oImages = computed(() => imageObjs.value.map(item => item.oImg))

onMounted(() => {
  getDetails()
})

async function getDetails() {
  post.value = null
  isRefreshing.value = false

  const ret = await komicaSVC.getDetails(komicaType, postId)

  if (!ret.success) {
    return
  }

  post.value = ret.item
}

function onClickImage(item: any) {
  const index = oImages.value.findIndex(src => src === item.oImg) || 0

  showImagePreview({
    images: oImages.value,
    startPosition: index,
    closeable: true,
    showIndex: true,
    loop: true,
    closeOnPopstate: true,
    lazyLoad: true,
  })
}

function onTabClick(value: string | number) {
  switch (value) {
    case 'up':
      window.scrollTo(0, 0)
      break
    case 'down':
      window.scrollTo(0, document.body.clientHeight)
      break
    case 'images':
      showPopup.value = true
      break
  }
}

function openOriginPage() {
  if (!post.value?.url) {
    return
  }

  window.liff.openWindow({
    url: post.value.url,
  })
}
</script>

<template>
  <div class="with-safe-area-inset-bottom">
    <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getDetails">
      <div class="komica-details__stack">
        <van-skeleton
          class="app-surface padding-bt-15"
          title
          avatar
          avatar-shape="square"
          avatar-size="90"
          :row="4"
          :loading="!post"
        >
          <template v-if="post">
            <KomicaPostCell :item="post" :is-details="true" @click-image="onClickImage" />
            <KomicaPostCell
              v-for="item in post.reply"
              :key="item.id"
              :item="item"
              :o-item="post"
              :is-details="true"
              @click-image="onClickImage"
            />
          </template>
        </van-skeleton>
        <van-skeleton
          v-for="n in 4"
          :key="n"
          class="app-surface padding-bt-15"
          :row="4"
          title
          :loading="!post"
        />
      </div>
    </van-pull-refresh>

    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '80%' }"
    >
      <van-grid class="padding-bt-15" :column-num="4">
        <van-grid-item v-for="(item, index) in imageObjs" :key="index">
          <van-image
            :src="item.sImg"
            fit="cover"
            lazy-load
            @click="onClickImage(item)"
          />
        </van-grid-item>
      </van-grid>
    </van-popup>

    <van-tabbar
      fixed
      route
      safe-area-inset-bottom
      @change="onTabClick"
    >
      <van-tabbar-item icon="arrow-up" name="up">
        至頂
      </van-tabbar-item>
      <van-tabbar-item icon="photo" name="images">
        瀏覽圖片
      </van-tabbar-item>
      <van-tabbar-item icon="arrow-down" name="down">
        至底
      </van-tabbar-item>
    </van-tabbar>

    <van-button
      class="fixed-btn padding-lr-5"
      type="primary"
      plain
      size="mini"
      @click="openOriginPage"
    >
      開啟原頁面
    </van-button>
  </div>
</template>

<style lang="scss" scoped>
.komica-details__stack {
  display: grid;
  gap: 14px;
}

.fixed-btn {
  position: fixed;
  top: 9px;
  right: 10px;
  z-index: 1;
}
</style>
