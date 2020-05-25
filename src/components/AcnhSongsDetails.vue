<template>
  <div>
    <van-panel>
      <div slot="header" class="text-center padding-bt-10">
        <b class="fs-20">{{ item.name['name-tw'] || item.name['name-TWzh'] }}</b>
      </div>

      <van-cell title="能夠購買">
        <van-tag
          :type="item.isOrderable ? 'success' : 'danger'"
          size="medium"
        >{{ item.isOrderable ? '是' : '否' }}</van-tag>
      </van-cell>
      <van-cell title="買價">{{ item['buy-price'] | commafy }}</van-cell>
      <van-cell title="賣價">{{ item['sell-price'] | commafy }}</van-cell>

      <div class="text-center margin-bt-15">
        <van-image :src="item.image_uri" width="200"></van-image>
        <audio ref="audio" controls :key="item.id">
          <source :src="item.music_uri" type="audio/mpeg" />
        </audio>
      </div>

      <div slot="footer">
        <van-tag class="margin-a-5" v-for="name in item.name" plain :key="name">{{ name }}</van-tag>
      </div>
    </van-panel>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  watch: {
    item() {
      if (!this.$refs?.audio) {
        return;
      }
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>