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
  watch: {
    item() {
      if (!this.$refs?.audio) {
        return
      }
      this.$refs.audio.pause()
      this.$refs.audio.currentTime = 0
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
          <b class="fs-20">{{ item.name['name-tw'] || item.name['name-TWzh'] }}</b>
        </div>
      </template>

      <template #desc>
        <van-cell title="能夠購買">
          <van-tag
            :type="item.isOrderable ? 'success' : 'danger'"
            size="medium"
          >
            {{ item.isOrderable ? '是' : '否' }}
          </van-tag>
        </van-cell>
        <van-cell title="買價">
          {{ commafy(item['buy-price']) }}
        </van-cell>
        <van-cell title="賣價">
          {{ commafy(item['sell-price']) }}
        </van-cell>

        <div class="text-center margin-bt-15">
          <van-image :src="item.image_uri" width="200" />
          <audio ref="audio" :key="item.id" controls>
            <source :src="item.music_uri" type="audio/mpeg">
          </audio>
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
  </div>
</template>

<style lang="scss" scoped>
</style>
