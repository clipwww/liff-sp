<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { movieSVC } from '@/services'

const CinemaCodeMapping = {
  TP: '台北信義威秀影城',
  MU: 'MUVIE CINEMAS 台北松仁',
  MUC: 'MUVIE CINEMAS 台北松仁 (MUCROWN)',
  QS: '台北京站威秀影城',
  TX: '台北西門威秀影城',
  BQ: '板橋大遠百威秀影城',
  GM: '中和環球威秀影城',
  HU: '新店裕隆城威秀影城',
  LK: '林口MITSUI OUTLET PARK威秀影城',
  LKMP: '林口MITSUI OUTLET PARK威秀影城 (Mappa)',
  TY: '桃園統領威秀影城',
  TG: '桃園桃知道威秀影城',
  HS: '新竹大遠百威秀影城',
  HSGC: '新竹大遠百威秀影城 (GC)',
  BC: '新竹巨城威秀影城',
  TF: '頭份尚順威秀影城',
  TZ: '台中大遠百威秀影城',
  TT01: 'MUVIE CINEMAS 台中TIGER CITY',
  TT02: 'MUVIE CINEMAS 台中TIGER CITY (GC)',
  MM: '台中大魯閣新時代威秀影城',
  TN: '台南大遠百威秀影城',
  FC: '台南FOCUS威秀影城',
  NF: '台南南紡威秀影城',
  NFGC: '台南南紡威秀影城 (GC)',
  KS: '高雄大遠百威秀影城',
  KSGC: '高雄大遠百威秀影城 (GC)',
  HL: '花蓮新天堂樂園威秀影城',
}

const keyword = ref('')

const cinemaCode = ref('LK')

const cinemaOptions = computed(() => Object.entries(CinemaCodeMapping).map(([value, text]) => ({
  text,
  value,
})))

const activeName = ref([])

const movies = ref<{
  id: string
  name: string
  nameEN: string
  showTimes: { date: string; times: string[] }[]
}[]>([])

const filteredMovies = computed(() => movies.value.filter(item => keyword.value ? item.name.includes(keyword.value) || item.nameEN.includes(keyword.value) : true))

onBeforeMount(() => {
  fetchData()
})

watch(cinemaCode, fetchData)

async function fetchData() {
  const html = await movieSVC.getMovieVieshowShowTimes(cinemaCode.value)

  const div = document.createElement('div')
  div.id = 'wrap'
  div.innerHTML = html as string
  const list = div.querySelectorAll('#wrap > .col-xs-12')

  movies.value = (Array.from(list)).map((el) => {
    const name = el.querySelector('.LangTW.MovieName')?.textContent?.trim() || ''
    const nameEN = el.querySelector('.LangEN.MovieName')?.textContent?.trim() || ''
    const dates = Array.from(el.querySelectorAll('.LangTW.RealShowDate')).map(el => el.textContent?.trim() || '')
    const times = Array.from(el.querySelectorAll('.SessionTimeInfo')).map((el) => {
      return Array.from(el.querySelectorAll('div')).map(el2 => el2.textContent?.trim() || '')
    })

    return {
      id: btoa(nameEN),
      name,
      nameEN,
      showTimes: times.map((arr, idx) => {
        return {
          date: dates[idx],
          times: arr,
        }
      }),
    }
  })
}

function isExpired(_time: string) {
  return false
  // return moment().isAfter(moment(_time, 'MM月DD日 DDD HH：mm'))
}
</script>

<template>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item v-model="cinemaCode" :options="cinemaOptions" />
    </van-dropdown-menu>
    <van-search v-model="keyword" placeholder="輸入關鍵字篩選" />

    <van-collapse v-model="activeName" border>
      <van-collapse-item
        v-for="(item) in filteredMovies"
        :key="item.id"
        :title="item.name"
        :name="item.id"
      >
        {{ item.nameEN }}
        <van-cell v-for="(_time, i) in item.showTimes" :key="i" :title="_time.date">
          <template #label>
            <van-tag
              v-for="str in _time.times"
              :key="str"
              :type="isExpired(`${_time.date} ${str}`) ? 'default' : 'success'"
              plain
              class="margin-a-5"
              size="medium"
            >
              {{ str }}
            </van-tag>
          </template>
        </van-cell>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<style lang="scss"></style>
