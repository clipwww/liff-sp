<script setup lang="ts">
import _isEqual from 'lodash/isEqual'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from '@/plugins/dayjs'
import { movieRef } from '@/plugins/firebase'
import { movieSVC } from '@/services'

const route = useRoute()
const router = useRouter()

const theaterInfo = ref<any>({})
const movies = ref<any[]>([])
const date = ref(dayjs())
const showCalendar = shallowRef(false)
const isEmpty = shallowRef(false)

const theaterId = route.params.id?.toString() ?? ''
const cityId = route.query.cityId?.toString() ?? ''
const formatDate = computed(() => date.value.format('YYYYMMDD'))
const maxDate = computed(() => dayjs().add(7, 'day').toDate())

watch(formatDate, (newValue, oldValue) => {
  movies.value = []

  movieRef.child(`theater-${theaterId}-${oldValue}`).off()
  movieRef.child(`theater-${theaterId}-${newValue}`).off()
  movieRef.child(`theater-${theaterId}-${formatDate.value}`).on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      theaterInfo.value = data.item
      movies.value = data.items
    }
  })

  getTheaterById()
}, { immediate: true })

watch(showCalendar, (opened) => {
  if (!opened) {
    document.body?.classList?.remove('van-overflow-hidden')
  }
})

onMounted(() => {
  movieRef.on('value', (snapshot) => {
    const value = snapshot.val()
    if (!value || typeof value !== 'object') {
      return
    }

    Object.keys(value)
      .filter(key => key.includes('theater-'))
      .forEach((key) => {
        const data = snapshot.child(key).val()
        if (data?.dateCreated && dayjs().isAfter(data.dateCreated, 'day')) {
          movieRef.child(key).remove()
        }
      })
  })
})

onBeforeUnmount(() => {
  movieRef.child(`theater-${theaterId}-${formatDate.value}`).off()
  movieRef.off()
})

async function getTheaterById() {
  isEmpty.value = false
  const ret = await movieSVC.getTheaterById(theaterId, cityId, formatDate.value)
  if (!ret.success) {
    return
  }

  if (!ret.items.length) {
    isEmpty.value = true
  }

  if (!_isEqual(movies.value, ret.items)) {
    movieRef.child(`theater-${theaterId}-${formatDate.value}`).set({ item: ret.item, items: ret.items, dateCreated: dayjs().valueOf() })
  }
}

function onDateChange(value: Date) {
  date.value = dayjs(value)
  showCalendar.value = false
}

function isExpired(time: string) {
  return dayjs().isAfter(dayjs(time, 'HH：mm'))
}

function goMovie(item: any) {
  router.push({ name: 'MovieDetails', params: { id: item.id }, query: { title: item.title } })
}
</script>

<template>
  <div>
    <section class="movie-theater-details__hero app-surface">
      <div class="movie-theater-details__title">
        {{ theaterInfo.name || '影城資訊' }}
      </div>
      <div class="movie-theater-details__address">
        {{ theaterInfo.address }}
      </div>
      <div class="movie-theater-details__meta">
        <van-tag plain class="margin-r-5 margin-bt-5">
          營業時間 {{ theaterInfo.openingHours }}
        </van-tag>
        <van-tag plain class="margin-r-5 margin-bt-5">
          電話 {{ theaterInfo.telephone }}
        </van-tag>
        <a :href="theaterInfo.url" class="margin-bt-5" target="_blank">
          <van-tag plain>網站</van-tag>
        </a>
      </div>
    </section>

    <van-cell
      class="margin-t-5"
      :value="formatDate"
      is-link
      @click="showCalendar = true"
    />
    <van-calendar
      v-model:show="showCalendar"
      :show-confirm="false"
      :max-date="maxDate"
      close-on-popstate
      @confirm="onDateChange"
    />

    <article
      v-for="item in movies"
      :key="item.id"
      class="movie-theater-details__card app-surface"
    >
      <div class="movie-theater-details__card-head">
        <div class="movie-theater-details__card-title">
          {{ item.title }}
        </div>
        <van-button size="small" plain @click="goMovie(item)">
          查看電影
        </van-button>
      </div>

      <div class="movie-theater-details__card-body">
        <van-image
          class="movie-theater-details__thumb"
          height="88"
          width="88"
          fit="cover"
          :src="item.image"
          lazy-load
        />
        <div class="movie-theater-details__content">
          <van-image
            v-if="item.cerImg"
            class="margin-b-10 square"
            width="35"
            fit="contain"
            :src="item.cerImg"
            lazy-load
          />
          <div>片長: {{ item.runtime }} 分</div>
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
      </div>
    </article>
    <template v-if="!movies.length && !isEmpty">
      <div v-for="n in 3" :key="n" class="app-surface movie-theater-details__skeleton">
        <van-skeleton
          title
          avatar
          avatar-size="88px"
          avatar-shape="square"
          :row="3"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.movie-theater-details__hero,
.movie-theater-details__card,
.movie-theater-details__skeleton {
  padding: 20px;
  margin-bottom: 14px;
}

.movie-theater-details__title,
.movie-theater-details__card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.movie-theater-details__address {
  margin-top: 6px;
  font-size: 14px;
  color: var(--van-text-color-2);
}

.movie-theater-details__meta {
  margin-top: 12px;
}

.movie-theater-details__card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.movie-theater-details__card-body {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 16px;
  margin-top: 16px;
}

.square {
  :deep(img) {
    border-radius: 0;
  }
}
</style>
