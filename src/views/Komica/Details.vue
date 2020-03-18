<template>
  <div class="with-safe-area-inset-bottom">
    <van-pull-refresh v-model="isRefreshing" head-height="150" @refresh="getDetails">
      <van-cell-group>
        <van-skeleton
          class="padding-bt-15"
          title
          avatar
          avatar-shape="square"
          avatar-size="90"
          :row="4"
          :loading="!post"
        >
          <template v-if="post">
            <KomicaPostCell :item="post" :isDetails="true" @click-image="onClickImage" />
            <KomicaPostCell
              v-for="item in post.reply"
              :item="item"
              :oItem="post"
              :key="item.id"
              :isDetails="true"
              @click-image="onClickImage"
            ></KomicaPostCell>
          </template>
        </van-skeleton>
        <van-skeleton class="padding-bt-15" v-for="n in 4" :row="4" title :key="n" :loading="!post"></van-skeleton>
      </van-cell-group>
    </van-pull-refresh>

    <van-popup
      v-model="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '80%' }"
    >
      <van-grid class="padding-bt-15" :column-num="4">
        <van-grid-item v-for="(item, index) in imageObjs" :key="index">
          <van-image :src="item.sImg" fit="cover" lazy-load @click="onClickImage(item)"></van-image>
        </van-grid-item>
      </van-grid>
    </van-popup>

    <van-tabbar fixed route safe-area-inset-bottom @change="onTabClick">
      <van-tabbar-item icon="arrow-up" name="up">至頂</van-tabbar-item>
      <van-tabbar-item icon="photo" name="iamges">瀏覽圖片</van-tabbar-item>
      <van-tabbar-item icon="arrow-down" name="down">至底</van-tabbar-item>
    </van-tabbar>

    <van-button
      class="fixed-btn padding-lr-5"
      type="primary"
      plain
      size="mini"
      @click="openOriginPage"
    >開啟原頁面</van-button>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

import { komicaSVC } from '@/services';

import KomicaPostCell from '@/components/KomicaPostCell.vue';

export default {
  components: {
    KomicaPostCell,
  },
  metaInfo() {
    return {
      title: this.$route.query.title || this.post?.title,
    };
  },
  data() {
    return {
      post: null,
      isRefreshing: false,
      showPopup: false,
    };
  },
  computed: {
    komicaType() {
      switch (true) {
        case this.$route.name.includes('KomicaNew'):
          return 'new';
        case this.$route.name.includes('KomicaLive'):
          return 'live';
        default:
          return '';
      }
    },
    postId() {
      return this.$route.params.id;
    },
    imageObjs() {
      const arr = [];
      const replyImages = this.post?.reply.filter(item => item.sImg && item.oImg) ?? [];

      if (this.post && this.post.sImg && this.post.oImg) {
        arr.push(this.post);
      }
      return arr.concat(replyImages);
    },
    sImages() {
      return this.imageObjs.map(item => item.sImg);
    },
    oImages() {
      return this.imageObjs.map(item => item.oImg);
    },
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      this.post = null;
      this.isRefreshing = false;

      const ret = await komicaSVC.getDetails(this.komicaType, this.postId);

      if (!ret.success) {
        return;
      }

      this.post = ret.item;
    },
    onClickImage(item) {
      const index = this.oImages.findIndex(src => src === item.oImg) || 0;

      ImagePreview({
        images: this.oImages,
        startPosition: index,
        closeable: true,
        showIndex: true,
        // showIndicators: true,
        loop: true,
        closeOnPopstate: true,
        lazyLoad: true,
      });
    },
    onTabClick(val) {
      switch (val) {
        case 'up':
          window.scrollTo(0, 0);
          break;
        case 'down':
          window.scrollTo(0, document.body.clientHeight);
          break;
        case 'iamges':
          this.showPopup = true;
          break;
      }
    },
    openOriginPage() {
      window.liff.openWindow({
        url: this.post.url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.fixed-btn {
  position: fixed;
  top: 9px;
  right: 10px;
  z-index: 1;
}
</style>
