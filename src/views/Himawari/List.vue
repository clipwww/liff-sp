<script>
import { himawariSVC } from '@/services'
import { toSafeHtmlString } from '@/utils'

export default {
  data() {
    return {
      keyword: '',
      page: 1,
      items: [],
      isLoading: false,
      isFinished: false,
      isRefreshing: false,
      isError: false,
    }
  },
  methods: {
    toSafeHtmlString,

    async getList(init = false) {
      if (init) {
        this.items = []
        this.page = 1
        this.isFinished = false
        this.isRefreshing = false
      }

      this.isRefreshing = false
      this.isLoading = true
      const ret = await himawariSVC.getList({
        keyword: this.keyword,
        page: this.page,
      })
      this.isLoading = false

      if (!ret.success) {
        this.isError = true
        return
      }

      if (!ret.items.length) {
        this.isFinished = true
        return
      }

      this.isError = false
      this.page++
      this.items.push(...ret.items)
    },

    goDetails(item) {
      this.$router.push({ name: 'HimawariDetails', params: { id: item.id }, query: { title: item.title } })
    },
  },
}
</script>

<template>
  <div class="list__container">
    <van-search
      v-model.trim="keyword"
      show-action
      placeholder="請輸入關鍵字搜尋"
      @search="getList(true)"
    >
      <template #action>
<van-button
       
        type="primary"
        size="small"
        plain
        @click="getList(true)"
      >
        搜尋
      </van-button>
</template>
    </van-search>
    <div class="list__content with-safe-area-inset-bottom">
      <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getList(true)">
        <van-list
          v-model="isLoading"
          :finished="isFinished"
          v-model:error="isError"
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
                avatar-size="80"
              />
            </van-cell>
          </div>
</template>
          <!-- <van-grid :column-num="2">
            <van-grid-item v-for="item in items" width="100" :key="item.id" square :border="false">
              <template #icon>
<van-image :src="item.image" lazy-load></van-image>
</template>
              <template #text>
<div class="little-text">{{ item.title }}</div>
</template>
            </van-grid-item>
          </van-grid> -->
          <van-cell
            v-for="item in items"
            :key="item.id"
            is-link
            clickable
            center
            @click="goDetails(item)"
          >
            <template #icon>
<van-image
             
              class="margin-r-10"
              :src="item.image"
              width="80"
              fit="contain"
             />
</template>
            <template #title>
<div class="little-text">
              {{ item.title }}
            </div>
</template>
            <!-- <template #label>
<div v-html="toSafeHtmlString(item.description)"></div>
</template> -->
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
