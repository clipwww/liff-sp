<script>
import { mapGetters } from 'vuex'
import { movieRef } from '@/plugins/firebase'

import { Toast } from '@/plugins/vant'
import store from '@/store'

export default {
  beforeRouteEnter(to, from, next) {
    const isLoggedIn = store.state.isLoggedIn

    if (isLoggedIn) {
      next()
    }
    else {
      Toast.fail('必須要登入才可以使用唷！')
      next({ name: 'MovieSearchTypeChoice' })
    }
  },
  data() {
    return {
      favoriteList: [],
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
  },

  created() {
    this.isLoading = true
    movieRef.child(`favorite-movie-${this.profile.userId}`).on('value', (snapshot) => {
      const data = snapshot.val()

      if (data && data?.length) {
        this.favoriteList = data || []
      }
      this.isLoading = false
    })
  },
  beforeUnmount() {
    movieRef.child(`favorite-movie-${this.profile.userId}`).off()
  },
  methods: {
    async removeFavorite(item) {
      try {
        await this.$dialog.confirm({
          title: '確定要刪除收藏嗎？',
        })

        this.favoriteList = this.favoriteList.filter(f => f.id !== item.id)

        movieRef.child(`favorite-movie-${this.profile.userId}`).set(this.favoriteList)
      }
      catch (err) {
        console.log(err)
      }
    },
    getSrc(src = '') {
      return !src || src.includes('l10l010l3322l1') ? 'https://via.placeholder.com/250x370?text=404' : src
    },
    goMovie({ id }) {
      this.$router.push({ name: 'MovieDetails', params: { id } })
    },
  },
}
</script>

<template>
  <div class="favorite-list">
    <van-panel v-show="isLoading">
      <div slot="header" class="padding-bt-10">
        <van-skeleton
          title
          avatar
          avatar-shape
          :row="4"
        />
      </div>
    </van-panel>
    <van-panel
      v-for="item in favoriteList"
      v-show="!isLoading"
      :key="item.id"
      class="margin-bt-10"
    >
      <div slot="header">
        <van-cell :title="item.name" size="large">
          <van-image
            slot="right-icon"
            width="40"
            fit="contain"
            :src="item.cerImg"
            lazy-load
          />
        </van-cell>
      </div>
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
      <div slot="footer">
        <div class="flex-between">
          <div class="little-text">
            加入收藏日期 {{ $filters.formatDate(item.dateCreated) }}
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
      </div>
    </van-panel>
    <van-panel v-show="!favoriteList.length && !isLoading">
      <div slot="header">
        <div class="text-center padding-bt-30">
          <van-icon class="fs-30" name="info" />
          <div>這裡還什麼都沒有</div>
        </div>
      </div>
    </van-panel>
  </div>
</template>

<style lang="scss" scoped>
.favorite-list {
  padding-bottom: calc(env(safe-area-inset-bottom) + 65px);
}
</style>
