<script>
import moment from 'moment'
import _isEqual from 'lodash/isEqual'
import { ref as dbRef, getDatabase, off, onValue, remove, set } from 'firebase/database'

import { movieSVC } from '@/services'

export default {
  metaInfo() {
    return {
      title: this.$route.query.title || this.theaterInfo.name,
    }
  },
  data() {
    return {
      theaterInfo: {},
      movies: [],
      date: moment(),
      showCalendar: false,
      isEmpty: false,
    }
  },
  computed: {
    theaterId() {
      return this.$route.params.id
    },
    cityId() {
      return this.$route.query.cityId
    },
    formatDate() {
      return this.date.format('YYYYMMDD')
    },
    maxDate() {
      return new Date(moment().add(7, 'day'))
    },
    isToday() {
      return moment().isSame(this.date, 'day')
    },
  },
  watch: {
    formatDate: {
      immediate: true,
      handler(newVal, oldVal) {
        this.movies = []

        off(dbRef(getDatabase(), `theater-${this.theaterId}-${oldVal}`))
        off(dbRef(getDatabase(), `theater-${this.theaterId}-${newVal}`))
        onValue(dbRef(getDatabase(), `theater-${this.theaterId}-${this.formatDate}`), (snapshot) => {
          const data = snapshot.val()
          if (data) {
            this.theaterInfo = data.item
            this.movies = data.items
          }
        })
      },
    },
    showCalendar: {
      immediate: true,
      handler(bool) {
        if (!bool) {
          document.body?.classList?.remove('van-overflow-hidden')
        }
      },
    },
  },
  created() {
    onValue(dbRef(getDatabase(), '/movie/'), (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const keys = Object.keys(data)
        keys
          .filter(key => key.includes('theater-'))
          .forEach((key) => {
            const itemData = data[key]
            if (moment().isAfter(itemData.dateCreated, 'day')) {
              console.log('key', key)
              remove(dbRef(getDatabase(), `movie/${key}`))
            }
          })
      }
    })

    this.getTheaterById()
  },
  beforeUnmount() {
    off(dbRef(getDatabase(), `theater-${this.theaterId}-${this.formatDate}`))
    off(dbRef(getDatabase(), '/movie/'))
  },
  methods: {
    async getTheaterById() {
      this.isEmpty = false
      const ret = await movieSVC.getTheaterById(this.theaterId, this.cityId, this.formatDate)
      if (!ret.success) {
        return
      }

      if (!ret.items.length) {
        this.isEmpty = true
      }

      if (!_isEqual(this.movies, ret.items)) {
        set(dbRef(getDatabase(), `theater-${this.theaterId}-${this.formatDate}`), {
          item: ret.item,
          items: ret.items,
          dateCreated: +moment(),
        })
      }
    },
    onDateChange(value) {
      this.date = moment(value)
      this.showCalendar = false
      this.getTheaterById()
    },
    isExpired(time) {
      return moment().isAfter(moment(time, 'HH：mm'))
    },
    goMovie({ id }) {
      this.$router.push({ name: 'MovieDetails', params: { id } })
    },
  },
}
</script>

<template>
  <div>
    <van-card>
      <template #title>
        <div>{{ theaterInfo.name }}</div>
      </template>
      <template #desc>
        <div>{{ theaterInfo.address }}</div>
        <div class="margin-t-10">
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
      </template>
    </van-card>

    <van-cell
      class="margin-t-5"
      :value="formatDate"
      is-link
      @click="showCalendar = true"
    />
    <van-calendar
      v-model="showCalendar"
      :show-confirm="false"
      :max-date="maxDate"
      close-on-popstate
      @confirm="onDateChange"
    />

    <van-card
      v-for="item in movies"
      :key="item.id"
      :title="item.title"
      @click-thumb="goMovie(item)"
    >
      <div slot="thumb">
        <van-image
          height="88"
          fit="cover"
          :src="item.image"
          lazy-load
        />
        <div class="margin-t-5">
          <van-image
            class="square"
            width="35"
            fit="contain"
            :src="item.cerImg"
            lazy-load
          />
        </div>
      </div>

      <div slot="desc">
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
    </van-card>
    <template v-if="!movies.length && !isEmpty">
      <van-card v-for="n in 3" :key="n">
        <van-skeleton
          slot="desc"
          title
          avatar
          avatar-size="88px"
          avatar-shape="square"
          :row="3"
        />
      </van-card>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.square {
  :deep(img) {
    border-radius: 0;
  }
}
</style>
