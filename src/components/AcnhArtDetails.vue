<template>
  <div>
    <van-panel>
      <div slot="header" class="text-center padding-bt-10">
        <b class="fs-20">{{ item.name['name-TWzh'] }}</b>
      </div>

      <van-cell title="真名看破！">{{ art.realArtworkTitle }}</van-cell>
      <van-cell title="是否有贗品">
        <van-tag
          :type="item.hasFake ? 'danger' : 'success'"
          size="medium"
        >{{ item.hasFake ? '有' : '無' }}</van-tag>
      </van-cell>
      <van-cell title="買價">{{ item['buy-price'] | commafy }}</van-cell>
      <van-cell title="賣價" label="p.s. 贗品賣價為 0">{{ item['sell-price'] | commafy }}</van-cell>

      <van-grid :column-num="2">
        <van-grid-item v-for="item in art.variants" :key="item.filename">
          <div>{{ item.genuine ? '真品' : '贗品' }}</div>
          <van-image :src="item.image"></van-image>
        </van-grid-item>
      </van-grid>

      <div slot="footer">
        <van-tag class="margin-a-5" v-for="name in item.name" plain :key="name">{{ name }}</van-tag>
      </div>
    </van-panel>
  </div>
</template>

<script>
import arts from '@/json/arts.json';

export default {
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    art() {
      return arts.find(v => v.name === this.item['file-name']?.replace(/_/g, ' ')) || { variants: [] };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>