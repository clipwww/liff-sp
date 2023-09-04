<script>
import { komicaSVC } from '@/services'
import { lsUtil } from '@/utils'

import KomicaPostCell from '@/components/KomicaPostCell.vue'

export default {
  components: {
    KomicaPostCell,
  },
  beforeRouteLeave(to, from, next) {
    if (to.name.includes('Details')) {
      lsUtil.setObj(`${this.$route.name}-items`, this.items)
      lsUtil.set(`${this.$route.name}-page`, this.page)
      lsUtil.set(`${this.$route.name}-finished`, this.isFinished)
    } else {
      lsUtil.remove(`${this.$route.name}-items`)
      lsUtil.remove(`${this.$route.name}-page`)
      lsUtil.remove(`${this.$route.name}-finished`)
    }
    next()
  },
  data() {
    return {
      item: null,
      items: lsUtil.getObj(`${this.$route.name}-items`) || [],
      page: +lsUtil.get(`${this.$route.name}-page`) || 1,
      isLoading: false,
      isFinished: lsUtil.get(`${this.$route.name}-finished`) === 'true',
      isRefreshing: false,
      showPopup: false,
    }
  },
  computed: {
    komicaType() {
      switch (true) {
        case this.$route.name.includes('KomicaNew'):
          return 'new'
        case this.$route.name.includes('KomicaLive'):
          return 'live'
        default:
          return ''
      }
    },
  },
  watch: {
    showPopup(bool) {
      if (!bool) {
        this.item = null
      }
    },
  },
  methods: {
    async getList(init = false) {
      if (init) {
        this.items = []
        this.page = 1
        this.isFinished = false
        this.isRefreshing = false
      }

      this.isLoading = true
      const ret = await komicaSVC.getList(this.komicaType, this.page)
      this.isLoading = false
      this.isRefreshing = false
      if (!ret.success) {
        this.isFinished = true
        return
      }

      this.page++
      if (this.page > ret.pages.length) {
        this.isFinished = true
      }
      this.items = this.items.concat(ret.items)
    },
    openPopup(item) {
      this.item = item
      this.showPopup = true
    },
    goDetails(item) {
      const name = this.komicaType === 'new' ? 'KomicaNewDetails' : 'KomicaLiveDetails'
      this.$router.push({ name, params: { id: item.id }, query: { title: item.title } })
    },
  },
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
          <div slot="loading">
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
          <KomicaPostCell
            v-for="item in items"
            :key="item.id"
            :item="item"
            show-preview-btn
            ellipsis
            @click="goDetails(item)"
            @click-preview="openPopup(item)"
          />
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup
      v-model="showPopup"
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
