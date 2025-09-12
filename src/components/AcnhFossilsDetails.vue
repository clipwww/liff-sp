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
        <van-cell title="賣價">
          {{ commafy(item.price) }}
        </van-cell>

        <div class="text-center">
          <van-image :src="imageUrl" />
        </div>

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

    <!-- <pre>{{ item }}</pre> -->
  </div>
</template>

<style lang="scss" scoped>
</style>
