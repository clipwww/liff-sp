<script>
import arts from '@/json/arts.json'

export default {
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    art() {
      return arts.find(v => v.name === this.item['file-name']?.replace(/_/g, ' ')) || { variants: [] }
    },
  },
  methods: {
    commafy(value) {
      if (!value) {
        return '0'
      }
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>

<template>
  <div>
    <van-card>
      <template #title>
        <div class="text-center padding-bt-10">
          <b class="fs-20">{{ item.name['name-TWzh'] }}</b>
        </div>
      </template>

      <template #desc>
        <van-cell title="真名看破！">
          {{ art.realArtworkTitle }}
        </van-cell>
        <van-cell title="是否有贗品">
          <van-tag
            :type="item.hasFake ? 'danger' : 'success'"
            size="medium"
          >
            {{ item.hasFake ? '有' : '無' }}
          </van-tag>
        </van-cell>
        <van-cell title="買價">
          {{ commafy(item['buy-price']) }}
        </van-cell>
        <van-cell title="賣價" label="p.s. 贗品賣價為 0">
          {{ commafy(item['sell-price']) }}
        </van-cell>

        <van-grid :column-num="2">
          <van-grid-item v-for="variant in art.variants" :key="variant.filename">
            <div>{{ variant.genuine ? '真品' : '贗品' }}</div>
            <van-image :src="variant.image" />
          </van-grid-item>
        </van-grid>

        <div class="padding-t-10">
          <van-tag
            v-for="name in item.name"
            :key="name"
            class="margin-a-5"
            plain
          >
            {{ name }}
          </van-tag>
        </div>
      </template>
    </van-card>
  </div>
</template>

<style lang="scss" scoped>
</style>
