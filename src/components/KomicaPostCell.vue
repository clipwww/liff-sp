<template>
  <div>
    <van-cell
      :id="`r${item.id}`"
      class="komica-post-cell"
      :clickable="!isDetails"
      @click="$emit('click')"
    >
      <div slot="title">
        <div class="flex-between is-align-start">
          <div @click="isDetails ? showPopup = true : ''">{{ item.title }}</div>
          <div v-if="!isDetails" class="margin-l-10">
            <van-button
              plain
              type="info"
              icon="eye"
              size="mini"
              @click.stop="$emit('click-preview')"
            >預覽</van-button>
          </div>
        </div>
        <div class="little-text">No. {{ item.id }}</div>
      </div>
      <div v-if="item.sImg" slot="icon" class="margin-r-10">
        <van-image :src="item.sImg" width="90" lazy-load @click="$emit('click-image', item)"></van-image>
      </div>
      <div slot="label">
        <div
          class="break-word"
          :class="{ 'van-multi-ellipsis--l3': !isDetails, 'fs-14': isDetails }"
          v-html="toSafeHtmlString(item.text)"
        ></div>
        <div class="little-text margin-t-15 text-right">{{ item.dateCreated | formatDate }}</div>
        <div v-if="!isDetails" class="little-text text-right">總共 {{ replyCount }} 則回應</div>
        <div slot="right-icon">
          <div></div>
        </div>
      </div>
    </van-cell>
    <van-popup
      v-model="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '50%' }"
    >
      <div class="padding-t-15 padding-b-20">
        <van-cell>
          <div slot="title">No.</div>
          <div>{{ item.id }}</div>
        </van-cell>
        <van-cell>
          <div slot="title">使用者 Id</div>
          <div>{{ item.userId }}</div>
        </van-cell>
        <van-cell>
          <div slot="title">使用者名稱</div>
          <div>{{ item.name }}</div>
        </van-cell>
        <van-cell>
          <div slot="title">標題</div>
          <div>{{ item.title }}</div>
        </van-cell>
        <van-cell>
          <div slot="title">E-mail</div>
          <div>{{ item.email }}</div>
        </van-cell>
        <van-cell>
          <div slot="title">建立日期</div>
          <div>{{ item.dateCreated | formatDate }}</div>
        </van-cell>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Dialog } from 'vant';

import { toSafeHtmlString, toPureHtmlString } from '@/utils';

export default {
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
    };
  },
  computed: {
    replyCount() {
      let count = 0;
      const matchArr = this.item.warnText.match(/\d{1,}/g);
      if (matchArr) {
        count += +matchArr[0];
      }
      count += this.item?.reply?.length ?? 0;
      return count;
    },
  },
  mounted() {
    this.$el.querySelectorAll(`a`).forEach(el => {
      el.addEventListener('mousedown', this.onTouchStart);
      el.addEventListener('mouseup', this.onTouchEnd);
      el.addEventListener('touchstart', this.onTouchStart);
      el.addEventListener('touchend', this.onTouchEnd);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$el.querySelectorAll(`a`).forEach(el => {
      el.removeEventListener('mousedown', this.onTouchStart);
      el.removeEventListener('mouseup', this.onTouchEnd);
      el.removeEventListener('touchstart', this.onTouchStart);
      el.removeEventListener('touchend', this.onTouchEnd);
    });
    next();
  },
  methods: {
    toSafeHtmlString,

    onTouchStart(e) {
      e.preventDefault();

      this.pressTimer = window.setTimeout(() => {
        this.isLongPress = true;
        const id = e.target?.getAttribute('href')?.replace('#r', '') ?? '';
        const item = this?.oItem?.id === id ? this.oItem : this?.oItem?.reply.find(r => r.id === id);
        if (!item) {
          return;
        }
        Dialog.alert({
          title: `No. ${item.id}`,
          message: `<div class="text-center">${item.sImg ? `<img src="${item.sImg}" />` : ''}</div>${toPureHtmlString(
            item.text
          )}`.trim(),
          messageAlign: 'left',
          beforeClose(action, done) {
            clearTimeout(this.pressTimer);
            this.isLongPress = false;
            done();
          },
        });
      }, 600);
    },
    onTouchEnd(e) {
      e.preventDefault();

      clearTimeout(this.pressTimer);

      if (this.isLongPress) {
        this.isLongPress = false;
        return;
      }

      const isQlink = e.target?.classList?.contains('qlink') ?? false;
      const href = e.target?.getAttribute('href') ?? '';

      if (!isQlink) {
        window.liff.openWindow({
          url: href,
        });
        return;
      }

      const id = href.replace('#r', '');
      const $targetEl = document.getElementById(`r${id}`);
      const offsetTop = $targetEl?.offsetTop;
      if (Number.isNaN(offsetTop)) {
        return;
      }

      window.scrollTo(0, offsetTop - 30);

      $targetEl?.classList?.add('is-active');

      setTimeout(() => {
        $targetEl?.classList?.remove('is-active');
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.komica-post-cell {
  transition: background-color 0.3s;
  border-bottom: 1px solid #424242;
  &.is-active {
    background-color: #121212;
  }
}
</style>