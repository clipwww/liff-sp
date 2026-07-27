<script setup lang="ts">
import _cloneDeep from 'lodash/cloneDeep'
import { storeToRefs } from 'pinia'
import { showConfirmDialog, showNotify } from 'vant'
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import TurnipLineChart from '@/components/TurnipLineChart.vue'
import TurnipSellPrice from '@/components/TurnipSellPrice.vue'
import dayjs from '@/plugins/dayjs'
import { Toast } from '@/plugins/vant'
import { turnipSVC } from '@/services'
import { useAppStore } from '@/store'
import { copyValue, momentUtil } from '@/utils'

const props = withDefaults(defineProps<{
  userList?: any[]
  priceList?: any[]
}>(), {
  userList: () => [],
  priceList: () => [],
})
const weekStart = momentUtil.getWeekStart()
const weekdays = momentUtil.getWeekdays()
const now = dayjs()

const sellPrice = {}
weekdays.forEach((item) => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  }
})

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const { profile } = storeToRefs(appStore)

const groupId = route.params.id?.toString() ?? ''
const group = ref<any | null>(null)
const showEditor = shallowRef(false)

const form = reactive({
  groupName: '',
  isPrivate: false,
  password: '',
})

const filterPriceList = computed(() => {
  return props.userList
    .filter(item => group.value?.members?.includes(item.id))
    .map((user) => {
      const price = props.priceList.find(entry => entry.id === user.id) || {
        buyPrice: '',
        sellPrice: _cloneDeep(sellPrice),
      }

      return {
        ...price,
        profile: user,
      }
    })
    .sort((a, b) => {
      try {
        const weekday = now.weekday()
        if (weekday <= 0) {
          return (+a.buyPrice || 110) > (+b.buyPrice || 110) ? 1 : -1
        }

        const periodKey = now.locale('en-us').format('a')
        const aPrice = +a?.sellPrice[`w${weekday}`][periodKey] || 0
        const bPrice = +b?.sellPrice[`w${weekday}`][periodKey] || 0

        return aPrice > bPrice ? -1 : 1
      }
      catch (err) {
        console.log(err)
        return 1
      }
    })
})

const isCreator = computed(() => group.value?.creatorId === profile.value?.userId)

watch(showEditor, (opened) => {
  if (!opened || !group.value) {
    return
  }

  form.groupName = group.value.name
  form.isPrivate = !!group.value.password
  form.password = group.value.password
})

onMounted(() => {
  turnipSVC.listenerGroupById(groupId, (currentGroup) => {
    group.value = currentGroup

    if (!group.value?.members?.includes(profile.value?.userId)) {
      router.replace({ name: 'TurnipGroup' })
    }
  })
})

onBeforeUnmount(() => {
  turnipSVC.removeListenerGroupById(groupId)
})

onBeforeRouteLeave(() => {
  turnipSVC.removeListenerGroupById(groupId)
})

async function removeMembers(userId: string) {
  if (!group.value) {
    return
  }

  try {
    await showConfirmDialog({
      title: '確定嗎？',
    })

    const members = group.value.members.filter((id: string) => id !== userId)

    await turnipSVC.updateGroup(groupId, {
      ...group.value,
      members,
    })

    showNotify({
      type: 'success',
      message: '成功',
    })
  }
  catch (err) {
    console.log(err)
  }
}

async function onSubmit() {
  if (!group.value) {
    return
  }

  try {
    await turnipSVC.updateGroup(groupId, {
      ...group.value,
      name: form.groupName,
      password: form.isPrivate ? form.password : '',
    })

    showEditor.value = false
    showNotify({
      type: 'success',
      message: '修改成功',
    })
  }
  catch (err) {
    console.log(err)
  }
}

async function removeGroup() {
  try {
    await showConfirmDialog({
      title: '注意，此動作無法復原',
      message: '確定要刪除群組？',
    })

    await turnipSVC.removeGroup(groupId)
    router.replace({ name: 'TurnipGroup' })
  }
  catch (err) {
    console.log(err)
  }
}

function copyLink() {
  const isOk = copyValue(`https://liff.line.me/1557984400-gjEoY0y1/liff-sp${route.fullPath}`)
  if (isOk) {
    Toast.success({
      message: '已複製群組網址',
      duration: 700,
    })
  }
}
</script>

<template>
  <div>
    <van-skeleton
      v-if="!group"
      class="padding-bt-15"
      title
      avatar
      avatar-size="50"
      :row="6"
      :loading="!group"
    />
    <div v-else>
      <section class="turnip-group-details__hero app-surface margin-b-15">
        <div class="turnip-group-details__hero-head">
          <div>
            <div class="turnip-group-details__name">
              {{ group.name }}
            </div>
            <div class="little-text">
              {{ group.members.length }} 位成員
            </div>
          </div>
          <div class="turnip-group-details__actions">
            <van-button
              v-if="isCreator"
              class="margin-r-5"
              type="info"
              size="small"
              @click="showEditor = true"
            >
              編輯
            </van-button>
            <van-button
              v-else
              class="margin-r-5"
              type="danger"
              size="small"
              @click="removeMembers(profile.userId)"
            >
              退出
            </van-button>
            <van-button
              type="primary"
              size="mini"
              plain
              @click="copyLink"
            >
              複製網址
            </van-button>
          </div>
        </div>
      </section>

      <section v-for="item in filterPriceList" :key="item.id" class="turnip-member-card app-surface margin-b-15">
        <div class="turnip-member-card__head">
          <div class="turnip-member-card__profile">
            <van-image
              v-if="item.profile.pictureUrl"
              class="turnip-member-card__avatar"
              :src="item.profile.pictureUrl"
              width="52"
              height="52"
              round
              lazy-load
            />
            <div>
              <div class="turnip-member-card__name">
                {{ item.profile.displayName }}
              </div>
              <div class="little-text">
                買價：{{ item.buyPrice || '--' }}
              </div>
            </div>
          </div>
          <div v-if="isCreator && item.id !== profile.userId">
            <van-button type="danger" size="mini" @click="removeMembers(item.id)">
              移出
            </van-button>
          </div>
        </div>
        <TurnipSellPrice :sell-price="item.sellPrice" />
        <TurnipLineChart :id="item.id" :buy-price="item.buyPrice" :sell-price="item.sellPrice" />
      </section>

      <van-popup
        v-model:show="showEditor"
        position="bottom"
        closeable
        :style="{ height: '70%' }"
      >
        <div class="padding-a-10">
          <van-button type="danger" size="mini" @click="removeGroup">
            刪除群組
          </van-button>
        </div>
        <div>
          <van-divider>編輯群組</van-divider>
          <van-form @submit="onSubmit">
            <van-field
              v-model="form.groupName"
              name="群組名稱"
              label="群組名稱"
              placeholder="請填寫群組名稱"
              :rules="[{ required: true, message: '請填寫群組名稱' }]"
            />
            <van-field name="switch" label="私密群組">
              <template #input>
                <van-switch v-model="form.isPrivate" size="20" />
              </template>
            </van-field>
            <van-field
              v-if="form.isPrivate"
              v-model="form.password"
              name="群組密碼"
              label="群組密碼"
              placeholder="請填寫群組密碼"
              :rules="[{ required: true, message: '請填寫群組密碼' }]"
            />
            <div class="padding-a-15">
              <van-button
                type="primary"
                round
                block
                native-type="submit"
              >
                送出
              </van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.turnip-group-details__hero,
.turnip-member-card {
  padding: 20px;
}

.turnip-group-details__hero-head,
.turnip-member-card__head {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
}

.turnip-group-details__name,
.turnip-member-card__name {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.turnip-group-details__actions {
  display: flex;
  align-items: center;
}

.turnip-member-card__profile {
  display: flex;
  gap: 14px;
  align-items: center;
}
</style>
