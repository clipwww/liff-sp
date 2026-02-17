<script>
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
    imageUrl() {
      return this.item?.image_uri?.toLowerCase()
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

      <van-cell title="賣價">
        {{ $filters.commafy(item.price) }}
      </van-cell>

      <div class="text-center">
        <van-image :src="imageUrl" />
      </div>

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

    <!-- <pre>{{ item }}</pre> -->
  </div>
</template>

<style lang="scss" scoped>
</style>
