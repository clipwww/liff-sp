<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import KomicaPostCell from '@/components/KomicaPostCell.vue'
import { komicaSVC } from '@/services'
import { lsUtil } from '@/utils'

const route = useRoute()
const router = useRouter()

const item = ref<any | null>(null)
const items = ref<any[]>(lsUtil.getObj(`${route.name}-items`) || [])
const page = shallowRef(+lsUtil.get(`${route.name}-page`) || 1)
const isLoading = shallowRef(false)
const isFinished = shallowRef(lsUtil.get(`${route.name}-finished`) === 'true')
const isRefreshing = shallowRef(false)
const showPopup = shallowRef(false)

const komicaType = route.name?.toString().includes('KomicaLive') ? 'live' : 'new'

watch(showPopup, (opened) => {
  if (!opened) {
    item.value = null
  }
})

onBeforeRouteLeave((to) => {
  if (to.name?.toString().includes('Details')) {
    lsUtil.setObj(`${route.name}-items`, items.value)
    lsUtil.set(`${route.name}-page`, page.value)
    lsUtil.set(`${route.name}-finished`, isFinished.value)
    return
  }

  lsUtil.remove(`${route.name}-items`)
  lsUtil.remove(`${route.name}-page`)
  lsUtil.remove(`${route.name}-finished`)
})

async function getList(init = false) {
  if (init) {
    items.value = []
    page.value = 1
    isFinished.value = false
    isRefreshing.value = false
  }

  isLoading.value = true
  const ret = await komicaSVC.getList(komicaType, page.value)
  isLoading.value = false
  isRefreshing.value = false
  if (!ret.success) {
    isFinished.value = true
    return
  }

  page.value += 1
  if (page.value > ret.pages?.length) {
    isFinished.value = true
  }
  items.value = items.value.concat(ret.items)
}

function openPopup(post: any) {
  item.value = post
  showPopup.value = true
}

function goDetails(post: any) {
  const name = komicaType === 'new' ? 'KomicaNewDetails' : 'KomicaLiveDetails'
  router.push({ name, params: { id: post.id }, query: { title: post.title } })
}
</script>

<template>
  <div class="list__container">
    <div class="list__content with-safe-area-inset-bottom">
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          finished-text="没有更多了"
          error-text="Oops...發生錯誤"
          offset="50"
          @load="getList"
        >
          <template #loading>
            <div>
              <van-cell v-for="n in 2" :key="n">
                <van-skeleton
                  class="padding-bt-5 padding-lr-0"
                  :row="4"
                  title
                  avatar
                  avatar-shape="square"
                  avatar-size="90"
                />
              </van-cell>
            </div>
          </template>
          <KomicaPostCell
            v-for="post in items"
            :key="post.id"
            :item="post"
            show-preview-btn
            @click="goDetails(post)"
            @click-preview="openPopup(post)"
          />
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '80%' }"
    >
      <div v-if="item" class="padding-t-15 padding-b-20">
        <KomicaPostCell :item="item" :is-details="true" />
        <KomicaPostCell
          v-for="r in item.reply"
          :key="r.id"
          :item="r"
          :is-details="true"
        />
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
</style>
