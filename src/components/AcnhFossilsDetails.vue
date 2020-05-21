<template>
  <div>
    <van-panel>
      <div slot="header" class="text-center padding-bt-10">
        <b class="fs-20">{{ item.name['name-tw'] }}</b>
      </div>

      <van-cell title="賣價">{{ item.price | commafy }}</van-cell>

      <div class="text-center">
        <van-image :src="`http://acnhapi.com/images/fossils/${fileName}`"></van-image>
      </div>

      <div slot="footer">
        <van-tag class="margin-a-5" v-for="name in item.name" plain :key="name">{{ name }}</van-tag>
      </div>
    </van-panel>

    <pre>{{ item }}</pre>
  </div>
</template>

<script>
import { acnhSVC } from '@/services';

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
    fileName() {
      return this.item?.['file-name']?.toLowerCase();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>