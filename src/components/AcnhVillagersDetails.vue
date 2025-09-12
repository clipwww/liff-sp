<script setup lang="ts">
import moment from 'moment'
import { computed } from 'vue'

import villagers from '@/json/villagers.json'
import { translateSpecies } from '@/utils/acnh.util'

interface Props {
  item: any
}

const props = defineProps<Props>()

// 將過濾器轉換為計算屬性或方法
function formatBirthday(val: string) {
  return moment(val, 'D/M').format('M月D日')
}

const villager = computed(() => {
  return villagers.find(v => v.filename === props.item['file-name'])
})
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
        <van-cell title="性別">
          {{ item.gender === 'Male' ? '男孩 ♂' : '女孩 ♀' }}
        </van-cell>
        <van-cell title="種族">
          {{ translateSpecies(item.species) }}
        </van-cell>
        <van-cell title="個性">
          {{ item.personality }}
        </van-cell>
        <van-cell title="生日">
          {{ formatBirthday(item.birthday) }}
        </van-cell>
        <van-cell title="喜歡的歌曲">
          {{ villager?.favoriteSong }}
        </van-cell>
        <van-cell title="興趣">
          {{ villager?.hobby }}
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
        <van-image :src="villager?.houseImage" lazy />

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
