<template>
  <div>
    <van-skeleton class="padding-bt-15" title avatar avatar-shape :row="5" :loading="!item"></van-skeleton>
    <template v-if="item">
      <van-panel :desc="item.sub_title">
        <div slot="header">
          <van-cell>
            <div slot="title" class="margin-b-10">
              {{ item.title }}
              <van-tag
                class="margin-l-5"
                slot="right-icon"
                type="primary"
                size="mini"
                plain
              >{{ item.number }}</van-tag>
            </div>
            <div slot="label">{{ item.sub_title }}</div>
          </van-cell>
        </div>
        <div class="padding-a-10">
          <div v-if="imgSrc" class="text-center margin-b-10">
            <van-image :src="imgSrc"></van-image>
          </div>
          <span class="little-text">{{ item.author_comment }}</span>
          <van-divider></van-divider>
          <span class="little-text">{{ item.user_comment }}</span>
        </div>

        <div slot="footer" class="flex-between">
          <div>
            <van-tag type="default">類別: {{ item.author_tag }}</van-tag>
            <van-tag type="default" class="margin-l-10">長度: {{ formatTime }}</van-tag>
          </div>
          <van-button type="info" size="small" plain @click="goHimawari">前往原頁面</van-button>
        </div>
      </van-panel>
      <van-cell is-link center clickable @click="openUrl(item)">
        <div slot="title">{{ item.movie_width }}x{{ item.movie_height }}</div>
        <div slot="label">{{ item.add_date | formatDate }}</div>
      </van-cell>
      <van-cell
        v-for="s in item.add_source"
        :key="s.source_id"
        is-link
        center
        clickable
        @click="openUrl(s)"
      >
        <div slot="title">
          {{ s.movie_width }}x{{ s.movie_height }}
          <van-tag
            v-if="typeof s.memo === 'string'"
            class="margin-l-5"
            type="success"
            size="mini"
            plain
          >{{ s.memo }}</van-tag>
        </div>
        <div slot="label">{{ s.adddate | formatDate }}</div>
      </van-cell>
    </template>
  </div>
</template>

<script>
import moment from 'moment';

import { himawariSVC } from '@/services';

export default {
  data() {
    return {
      item: null,
    };
  },
  computed: {
    imgSrc() {
      let src = this.item?.img_big_url;
      if (typeof src !== 'string') {
        src = this.item?.img_small_url;
      }
      return typeof src !== 'string' ? '' : src;
    },
    dougaId() {
      return this.$route.params.id;
    },
    formatTime() {
      return moment()
        .startOf('day')
        .add(this.item.movie_time, 'second')
        .format('HH:mm:ss');
    },
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      const ret = await himawariSVC.getDetails(this.dougaId);
      if (!ret.success) {
        return;
      }

      this.item = ret.item;
    },
    openUrl(item) {
      window.liff.openWindow({
        url: item.movie_url,
        external: true,
      });
    },
    goHimawari() {
      window.liff.openWindow({
        url: `http://himado.in/${this.dougaId}`,
        external: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>