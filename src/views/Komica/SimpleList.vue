<script setup lang="ts">
import { computed, onMounted, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filters } from '@/plugins/vue-filter'
import { komicaSVC } from '@/services'

const route = useRoute()
const router = useRouter()

const keyword = shallowRef('')
const items = shallowRef<any[]>([])
const isRefreshing = shallowRef(false)
const isLoading = shallowRef(false)
const komicaType = shallowRef((route.query.type as string) || 'new')

const filterItems = computed(() => {
  return items.value.filter(item => (keyword.value ? item.title.includes(keyword.value) : true))
})

watch(komicaType, (value) => {
  if (value) {
    getList()
  }
}, { immediate: true })

onMounted(() => {
  if (!items.value.length) {
    getList()
  }
})

async function getList() {
  isRefreshing.value = false
  isLoading.value = true

  const ret = await komicaSVC.getAllList(komicaType.value)
  isLoading.value = false
  if (!ret.success) {
    return
  }

  items.value = ret.items
}

function goDetails(item: any) {
  const name = komicaType.value === 'new' ? 'KomicaNewDetails' : 'KomicaLiveDetails'
  router.push({ name, params: { id: item.id }, query: { title: item.title } })
}
</script>

<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" class="komica-simple__search" placeholder="請輸入關鍵字搜尋" />
    <div class="list__content with-safe-area-inset-bottom">
      <van-tabs v-model="komicaType" class="margin-bt-5" type="card">
        <van-tab title="新番捏他" name="new" />
        <van-tab title="新番實況" name="live" />
      </van-tabs>
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-cell-group>
          <template v-if="isLoading">
            <van-cell v-for="n in 20" :key="n">
              <van-skeleton class="padding-bt-5 padding-lr-0" :row="2" />
            </van-cell>
          </template>
          <van-cell
            v-for="item in filterItems"
            v-else
            :key="item.id"
            is-link
            clickable
            center
            @click="goDetails(item)"
          >
            <template #title>
              <div>
                <span>{{ item.title }}</span>
              </div>
            </template>
            <template #label>
              <div>
                <span class="margin-r-5">{{ filters.formatDate(item.dateCreated) }}</span>
              <!-- <van-tag plain size="mini">{{ item.replyCount }}</van-tag> -->
              </div>
            </template>
            <template #right-icon>
              <div>
                <van-icon name="chat-o" size="25" :info="item.replyCount" />
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.komica-simple__search {
  margin-bottom: 12px;
  border-radius: 18px;
  overflow: hidden;
}
</style>
