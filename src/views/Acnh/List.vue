<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
import { showDialog } from 'vant'

import { acnhSVC } from '@/services'
import { translateSpecies } from '@/utils/acnh.util'
import { logEvent } from '@/plugins/vue-analytics'

const route = useRoute()

// 將過濾器轉換為函數
function commafy(value: number) {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 響應式數據
const keyword = ref('')
const species = ref('')
const list = ref<any>(null)
const isLoading = ref(false)
const isFinished = ref(false)
const showDetails = ref(false)
const showSelect = ref(false)
const item = ref<any>(null)
const page = ref(1)

// 計算屬性
const type = computed(() => {
  switch (route.name) {
    case 'AcnhFish':
      return 'fish'
    case 'AcnhBugs':
      return 'bugs'
    case 'AcnhFossils':
      return 'fossils'
    case 'AcnhVillagers':
      return 'villagers'
    case 'AcnhSongs':
      return 'songs'
    case 'AcnhArt':
      return 'art'
    default:
      return ''
  }
})

const isVillagers = computed(() => type.value === 'villagers')

const detailsComponentName = computed(() => `${String(route.name)}Details`)

const objToList = computed(() => {
  if (!list.value) {
    return []
  }
  return Object.keys(list.value).map((key) => {
    return (list.value as any)[key]
  })
})

const filterList = computed(() => {
  return (
    objToList.value
      ?.filter((item) => {
        return keyword.value
          ? Object.keys(item.name).some((key) => {
            return (
              item.name[key]?.toLowerCase()?.includes(keyword.value?.toLowerCase())
                || (item.species
                  ? translateSpecies(item.species).includes(keyword.value) || item.species.includes(keyword.value)
                  : false)
            )
          })
          : true
      })
      ?.filter((item) => {
        return species.value ? item.species === species.value : true
      })
      ?.slice(0, page.value * 10) ?? []
  )
})

const actions = computed(() => {
  const set = new Set<string>()
  objToList.value.forEach((item: any) => {
    if (item.species) {
      set.add(item.species)
    }
  })
  return [
    { name: '全部', value: '' },
    ...Array.from(set).map(name => ({
      name: translateSpecies(name),
      value: name,
    })),
  ]
})

// 方法
async function getList() {
  isLoading.value = true
  const oldType = type.value
  const ret = await acnhSVC.getList(type.value)
  isLoading.value = false

  if (!ret || oldType !== type.value) {
    return
  }

  list.value = ret
  checkBirthday()
}

function onLoad() {
  if (isFinished.value) {
    return
  }
  console.log('on load')
  page.value += 1
  if (filterList.value.length === objToList.value.length) {
    isFinished.value = true
  }
}

function checkBirthday() {
  if (!isVillagers.value) {
    return
  }
  const hpd = objToList.value.filter((item) => {
    return moment().isSame(moment(item.birthday, 'D/M'), 'day')
  })

  const nowDay = moment().format('M/D')
  if (hpd.length && !localStorage.getItem(nowDay)) {
    try {
      showDialog({
        title: `今日 ${nowDay} 壽星`,
        message: hpd
          .map((item) => {
            return `<div class="text-center" style="white-space: initial">
                <div>${item.name['name-TWzh']}</div>
                <img src="${item.icon_uri}" width="80"/>
              </div>`
          })
          .join(', '),
        showCancelButton: true,
        confirmButtonText: '今日不再顯示',
        cancelButtonText: '關閉',
        beforeClose(action, done) {
          console.log(action)
          if (action === 'confirm') {
            localStorage.setItem(nowDay, '1')
          }
          done()
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
}

function toTop() {
  nextTick(() => {
    const listElement = document.querySelector('.list__content')
    if (listElement) {
      listElement.scrollTop = 0
    }
  })
}

function openDetails(selectedItem: any) {
  logEvent('狸端機 Lite', '開啟詳細資料', `[${type.value}] ${selectedItem?.name?.['name-TWzh']}`)
  showDetails.value = true
  item.value = selectedItem
}

function onSelect(action: any) {
  species.value = action.value
  showSelect.value = false
}

// 監聽器
watch(type, () => {
  toTop()
  keyword.value = ''
  species.value = ''
  item.value = null
  list.value = null
  isFinished.value = false
  isLoading.value = false
  showSelect.value = false
  showDetails.value = false
  page.value = 1
  getList()
}, { immediate: true })

watch(species, () => {
  page.value = 1
  toTop()
})

watch(keyword, () => {
  page.value = 1
  toTop()
})

watch(showDetails, (bool) => {
  if (!bool) {
    item.value = null
  }
})
</script>

<template>
  <div class="list__container">
    <van-search v-model.trim="keyword" :show-action="isVillagers" placeholder="請輸入關鍵字搜尋">
      <template #action>
        <van-button
          icon="arrow-down"
          size="small"
          @click="showSelect = true"
        >
          {{ species || translateSpecies('全部') }}
        </van-button>
      </template>
    </van-search>
    <van-action-sheet v-model="showSelect" :actions="actions" @select="onSelect" />

    <div ref="list" class="list__content with-safe-area-inset-bottom">
      <van-list
        :finished="isFinished"
        finished-text="没有更多了"
        :offset="10"
        @load="onLoad"
      >
        <div v-if="isLoading">
          <van-cell v-for="n in 10" :key="n">
            <van-skeleton
              class="padding-bt-5 padding-lr-0"
              :row="1"
              title
              avatar
              avatar-shape="square"
              avatar-size="65"
            />
          </van-cell>
        </div>
        <template v-if="list">
          <van-cell
            v-for="(listItem, i) in filterList"
            :key="listItem.id"
            :title="listItem.name['name-TWzh']"
            is-link
            center
            @click="openDetails(listItem)"
          >
            <template v-if="listItem.icon_uri || listItem.image_uri" #icon>
              <van-image
                class="margin-r-10"
                width="65"
                :src="listItem.icon_uri || listItem.image_uri.toLowerCase()"
                :lazy-load="i > 0"
              />
            </template>

            <template #label>
              <div>
                <template v-if="listItem.price">
                  <span class="little-text">賣價</span>
                  {{ commafy(listItem.price) }}
                </template>
                <div v-if="listItem.species">
                  {{ translateSpecies(listItem.species) }}
                </div>
              </div>
            </template>
          </van-cell>
        </template>
      </van-list>
    </div>

    <van-popup
      v-model="showDetails"
      round
      position="bottom"
      closeable
      :style="{ height: '90%' }"
    >
      <div v-if="item" class="safe-area-inset-bottom">
        <component :is="detailsComponentName" :item="item" />
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.list__container {
  height: calc(100vh - 105px);
}
</style>
