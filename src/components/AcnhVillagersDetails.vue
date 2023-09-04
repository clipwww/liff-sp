<script>
import moment from 'moment'

import villagers from '@/json/villagers.json'
import { translateSpecies } from '@/utils/acnh.util'

export default {
  filters: {
    formatBirthday(val) {
      return moment(val, 'D/M').format('M月D日')
    },
    translateSpecies,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data() {
    return {}
  },
  computed: {
    villager() {
      return villagers.find(v => v.filename === this.item['file-name'])
    },
  },
}
</script>

<template>
  <div>
    <van-panel>
      <div slot="header" class="text-center padding-bt-10">
        <b class="fs-20">{{ item.name['name-TWzh'] }}</b>
      </div>

      <van-cell title="性別">
        {{ item.gender === 'Male' ? '男孩 ♂' : '女孩 ♀' }}
      </van-cell>
      <van-cell title="種族">
        {{ item.species | translateSpecies }}
      </van-cell>
      <van-cell title="個性">
        {{ item.personality }}
      </van-cell>
      <van-cell title="生日">
        {{ item.birthday | formatBirthday }}
      </van-cell>
      <van-cell title="喜歡的歌曲">
        {{ villager.favoriteSong }}
      </van-cell>
      <van-cell title="興趣">
        {{ villager.hobby }}
      </van-cell>
      <van-cell title="口頭禪">
        {{ item['catch-phrase'] }}
      </van-cell>

      <van-grid :column-num="2">
        <van-grid-item>
          <van-image :src="item.icon_uri" width="60" />
        </van-grid-item>
        <van-grid-item>
          <van-image :src="item.image_uri" width="120" fit="fill" />
        </van-grid-item>
      </van-grid>
      <van-image :src="villager.houseImage" lazy />

      <div slot="footer">
        <van-tag
          v-for="name in item.name"
          :key="name"
          class="margin-a-5"
          plain
        >
          {{ name }}
        </van-tag>
      </div>
    </van-panel>
  </div>
</template>

<style lang="scss" scoped>
</style>
