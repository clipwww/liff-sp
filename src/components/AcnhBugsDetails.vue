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
    availability() {
      return this.item?.availability
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
      <van-cell title="賣價 (龍克斯)">
        {{ $filters.commafy(item['price-flick']) }}
      </van-cell>
      <van-cell title="出沒地點">
        {{ availability.location }}
      </van-cell>
      <van-cell
        title="出沒月份 (北半球)"
      >
        {{ availability.isAllYear ? '全年' : availability['month-northern'] }}
      </van-cell>
      <van-cell
        title="出沒月份 (南半球)"
      >
        {{ availability.isAllYear ? '全年' : availability['month-southern'] }}
      </van-cell>
      <van-cell title="出沒時間">
        {{ availability.isAllDay ? '全天' : availability.time }}
      </van-cell>

      <van-grid :column-num="2">
        <van-grid-item>
          <van-image :src="item.icon_uri" width="50" />
        </van-grid-item>
        <van-grid-item>
          <van-image :src=" item.image_uri" fit="fill" />
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
