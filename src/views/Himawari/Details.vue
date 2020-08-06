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
          <div id="js-video-container" class="video-wrapper">
            <video
              id="js-video"
              :src="videoSrc"
              :poster="imgSrc"
              controls
              playsinline
              webkit-playsinline
              @error="onError"
            ></video>
          </div>
          <!-- <div v-if="imgSrc" class="text-center margin-b-10">
            <van-image :src="imgSrc"></van-image>
          </div>-->
          <div class="little-text margin-t-10">{{ item.author_comment }}</div>
          <div class="margin-t-10">
            <van-tag type="default">類別: {{ item.author_tag }}</van-tag>
            <van-tag type="default" class="margin-l-10">長度: {{ formatTime }}</van-tag>
          </div>
          <!-- <van-divider></van-divider>
          <span class="little-text">{{ item.user_comment }}</span>-->
        </div>

        <div slot="footer">
          <div class="text-right">
            <van-button
              class="padding-lr-5 margin-r-5"
              type="primary"
              size="mini"
              plain
              @click="showPopup = true"
            >彈幕列表</van-button>
            <van-button class="padding-lr-5" type="info" size="mini" plain @click="goHimawari">前往原頁面</van-button>
          </div>
        </div>
      </van-panel>

      <van-dropdown-menu direction="up">
        <van-dropdown-item v-model="playUrl" :options="sourceOptions" />
      </van-dropdown-menu>

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

      <van-popup
        v-model="showPopup"
        round
        position="bottom"
        close-on-popstate
        :style="{ height: '87%' }"
      >
        <!-- <table class="danmaku-table">
          <tbody>
             <tr v-for="item in comments" :key="item.no">
                <td class="little-text">{{ item.digital_time }}</td>
                <td>{{ item.msg }}</td>
                <td class="little-text">{{ item.id }}</td>
              </tr>
            
          </tbody>
        </table>-->
        <DynamicScroller class="scroller" :items="comments" key-field="no" :min-item-size="33">
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[
                item.msg,
              ]"
              :data-index="index"
            >
              <div class="scroller__item">
                <div class="little-text">{{ item.digital_time }}</div>
                <div class="scroller__item__msg">{{ item.msg }}</div>
                <!-- <div class="little-text">{{ item.id }}</div> -->
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </van-popup>
    </template>
  </div>
</template>

<script>
import moment from 'moment';
import Danmaku from 'danmaku';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { himawariSVC } from '@/services';

export default {
  components: {
    DynamicScroller,
    DynamicScrollerItem,
  },
  metaInfo() {
    return {
      title: this.$route.query.title || this.post?.title,
    };
  },
  data() {
    return {
      item: null,
      damaku: null,
      comments: [],
      playUrl: '',
      showPopup: false,
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
    videoSrc() {
      return this.playUrl.slice(0, this.playUrl.indexOf('&movie_url_id='));
    },
    sourceOptions() {
      return [
        {
          text: `${this.item?.movie_width}x${this.item?.movie_height}`,
          value: this.item?.movie_url,
        },
      ].concat(
        this.item?.add_source?.map(item => {
          return {
            text: `${item.movie_width}x${item.movie_height}`,
            value: item.movie_url,
          };
        }) ?? []
      );
    },
  },
  created() {
    this.getDetails();
    this.getDanmaku();
  },
  beforeDestroy() {
    this.danmaku?.destroy();
  },
  methods: {
    async getDetails() {
      const ret = await himawariSVC.getDetails(this.dougaId);
      if (!ret.success) {
        return;
      }

      this.item = ret.item;
      this.playUrl = this.item?.movie_url ?? '';
    },
    async getDanmaku() {
      const ret = await himawariSVC.getDanmaku(this.dougaId);
      if (!ret.success) {
        return;
      }

      this.comments = ret.items;

      const newComments = this.comments.map(item => {
        return {
          text: item.msg,
          time: item.vpos_master / 100,
          // style: {
          //   fontSize: '16px',
          //   color: '#ffffff',
          //   textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000',
          // },
          style: {
            font: '16px sans-serif',
            textAlign: 'start',
            textBaseline: 'bottom',
            direction: 'inherit',
            fillStyle: '#fff',
            strokeStyle: '#fff',
            lineWidth: 1.0,
          },
        };
      });
      if (!this.danmaku) {
        this.$nextTick(() => {
          this.danmaku = new Danmaku({
            engine: 'canvas',
            // engine: 'dom',
            container: document.getElementById('js-video-container'),
            media: document.getElementById('js-video'),
            comments: newComments,
          });
        });
      } else {
        this.danmaku.comments = newComments;
      }
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
    onError(err) {
      console.log(err);
      this.$toast.fail(err.message);
    },
  },
};
</script>

<style lang="scss" scoped>
.danmaku-table {
  margin: 30px 0;
  height: 100%;
  overflow: hidden;
  tbody {
    border-top: 1px solid #ddd;
    tr {
      td {
        border-bottom: 1px solid #ddd;
        padding: 5px;
      }
    }
  }
}

.scroller {
  height: 100%;

  &__item {
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #ddd;

    > div {
      padding: 5px;
    }

    &__msg {
      flex: 1;
      line-height: 1.3;
      font-size: 14px;
    }
  }
}
</style>