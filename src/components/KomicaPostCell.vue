<script>
import { Dialog } from 'vant'

import { toPureHtmlString, toSafeHtmlString } from '@/utils'

export default {
  beforeRouteLeave(to, from, next) {
    this.$el.querySelectorAll('a').forEach((el) => {
      el.removeEventListener('mousedown', this.onTouchStart)
      el.removeEventListener('mouseup', this.onTouchEnd)
      el.removeEventListener('touchstart', this.onTouchStart)
      el.removeEventListener('touchend', this.onTouchEnd)
    })
    next()
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isDetails: {
      ype: Boolean,
      default: false,
    },
    oItem: {
      type: Object,
    },
  },
  data() {
    return {
      showPopup: false,
      pressTimer: null,
      isLongPress: false,
    }
  },
  computed: {
    replyCount() {
      let count = 0
      const matchArr = this.item.warnText.match(/\d{1,}/g)
      if (matchArr) {
        count += +matchArr[0]
      }
      count += this.item?.reply?.length ?? 0
      return count
    },
  },
  mounted() {
    this.$el.querySelectorAll('a').forEach((el) => {
      el.addEventListener('mousedown', this.onTouchStart)
      el.addEventListener('mouseup', this.onTouchEnd)
      el.addEventListener('touchstart', this.onTouchStart)
      el.addEventListener('touchend', this.onTouchEnd)
    })
  },
  methods: {
    toSafeHtmlString,

    onTouchStart(e) {
      e.preventDefault()

      this.pressTimer = window.setTimeout(() => {
        this.isLongPress = true
        const id = e.target?.getAttribute('href')?.replace('#r', '') ?? ''
        const item = this?.oItem?.id === id ? this.oItem : this?.oItem?.reply.find(r => r.id === id)
        if (!item) {
          return
        }
        Dialog.alert({
          title: `No. ${item.id}`,
          message: `<div class="text-center">${item.sImg ? `<img src="${item.sImg}" />` : ''}</div>${toPureHtmlString(
            item.text,
          )}`.trim(),
          messageAlign: 'left',
          beforeClose(action, done) {
            clearTimeout(this.pressTimer)
            this.isLongPress = false
            done()
          },
        })
      }, 600)
    },
    onTouchEnd(e) {
      e.preventDefault()

      clearTimeout(this.pressTimer)

      if (this.isLongPress) {
        this.isLongPress = false
        return
      }

      const isQlink = e.target?.classList?.contains('qlink') ?? false
      const href = e.target?.getAttribute('href') ?? ''

      if (!isQlink) {
        window.liff.openWindow({
          url: href,
        })
        return
      }

      const id = href.replace('#r', '')
      const $targetEl = document.getElementById(`r${id}`)
      const offsetTop = $targetEl?.offsetTop
      if (Number.isNaN(offsetTop)) {
        return
      }

      window.scrollTo(0, offsetTop - 30)

      $targetEl?.classList?.add('is-active')

      setTimeout(() => {
        $targetEl?.classList?.remove('is-active')
      }, 2000)
    },
  },
}
</script>

<template>
  <div>
    <van-cell
      :id="`r${item.id}`"
      class="komica-post-cell"
      :clickable="!isDetails"
      @click="$emit('click')"
    >
      <template #title>
        <div class="flex-between is-align-start">
          <div @click="isDetails ? showPopup = true : ''">
            {{ item.title }}
          </div>
          <div v-if="!isDetails" class="margin-l-10">
            <van-button
              plain
              type="info"
              icon="eye"
              size="mini"
              @click.stop="$emit('click-preview')"
            >
              預覽
            </van-button>
          </div>
        </div>
        <div class="little-text">
          No. {{ item.id }}
        </div>
      </template>
      <template #icon>
        <div v-if="item.sImg" class="margin-r-10">
          <van-image
            :src="item.sImg"
            width="90"
            lazy-load
            @click="$emit('click-image', item)"
          />
        </div>
      </template>
      <template #label>
        <div
          class="break-word"
          :class="{ 'van-multi-ellipsis--l3': !isDetails, 'fs-14': isDetails }"
          v-html="toSafeHtmlString(item.text)"
        />
        <div class="little-text margin-t-15 text-right">
          {{ $filters.formatDate(item.dateCreated) }}
        </div>
        <div v-if="!isDetails" class="little-text text-right">
          總共 {{ replyCount }} 則回應
        </div>
      </template>
    </van-cell>
    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '50%' }"
    >
      <div class="padding-t-15 padding-b-20">
        <van-cell>
          <template #title>
            <div>No.</div>
          </template>
          <div>{{ item.id }}</div>
        </van-cell>
        <van-cell>
          <template #title>
            <div>使用者 Id</div>
          </template>
          <div>{{ item.userId }}</div>
        </van-cell>
        <van-cell>
          <template #title>
            <div>使用者名稱</div>
          </template>
          <div>{{ item.name }}</div>
        </van-cell>
        <van-cell>
          <template #title>
            <div>標題</div>
          </template>
          <div>{{ item.title }}</div>
        </van-cell>
        <van-cell>
          <template #title>
            <div>E-mail</div>
          </template>
          <div>{{ item.email }}</div>
        </van-cell>
        <van-cell>
          <template #title>
            <div>建立日期</div>
          </template>
          <div>{{ $filters.formatDate(item.dateCreated) }}</div>
        </van-cell>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.komica-post-cell {
  transition: background-color 0.3s;
  border-bottom: 1px solid #424242;
  &.is-active {
    background-color: #121212;
  }
}
</style>
