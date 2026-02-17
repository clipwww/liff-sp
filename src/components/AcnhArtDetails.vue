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
}
</script>

<template>
  <div>
    <van-panel>
      <template #header>
<div class="text-center padding-bt-10">
        <b class="fs-20">{{ item.name['name-TWzh'] }}</b>
      </div>
</template>

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
        {{ $filters.commafy(item['buy-price']) }}
      </van-cell>
      <van-cell title="賣價" label="p.s. 贗品賣價為 0">
        {{ $filters.commafy(item['sell-price']) }}
      </van-cell>

      <van-grid :column-num="2">
        <van-grid-item v-for="item in art.variants" :key="item.filename">
          <div>{{ item.genuine ? '真品' : '贗品' }}</div>
          <van-image :src="item.image" />
        </van-grid-item>
      </van-grid>

      <template #footer>
<div>
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
    </van-panel>
  </div>
</template>

<style lang="scss" scoped>
</style>
