<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { showFailToast, showNotify } from 'vant'
import { computed, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { turnipSVC } from '@/services'
import { useAppStore } from '@/store'

const props = withDefaults(defineProps<{
  groupList?: any[]
}>(), {
  groupList: () => [],
})

const router = useRouter()
const appStore = useAppStore()
const { isLoggedIn, profile } = storeToRefs(appStore)

const activeTab = shallowRef('all')
const showEditor = shallowRef(false)
const groupName = shallowRef('')
const password = shallowRef('')
const isPrivate = shallowRef(false)
const showDialog = shallowRef(false)
const group = ref<any>({})
const joinPassword = shallowRef('')

const filterGroupList = computed(() => {
  switch (activeTab.value) {
    case 'all':
      return props.groupList
    case 'joined':
      return props.groupList.filter(item => item.members.includes(profile.value?.userId))
    case 'notjoin':
      return props.groupList.filter(item => !item.members.includes(profile.value?.userId))
    default:
      return []
  }
})

watch(showDialog, (opened) => {
  if (!opened) {
    joinPassword.value = ''
    group.value = {}
  }
})

async function updateProfileByUserId() {
  if (!profile.value?.userId) {
    return
  }

  try {
    await turnipSVC.updateProfileByUserId(profile.value.userId, profile.value)
  }
  catch (err) {
    console.log(err)
  }
}

function openEditor() {
  if (!isLoggedIn.value) {
    showFailToast('必須要登入才可以使用唷')
    return
  }

  showEditor.value = true
}

async function onSubmit() {
  if (!profile.value?.userId) {
    return
  }

  try {
    await turnipSVC.createGroup({
      name: groupName.value,
      password: isPrivate.value ? password.value : '',
      creatorId: profile.value.userId,
    })

    showEditor.value = false
    groupName.value = ''
    password.value = ''
    isPrivate.value = false

    updateProfileByUserId()
  }
  catch (err) {
    console.log(err)
  }
}

async function goDetails(item: any) {
  if (!item.members.includes(profile.value?.userId)) {
    group.value = item
    showDialog.value = true
    return
  }

  router.push({ name: 'TurnipGroupDetails', params: { id: item.id } })
}

async function beforeClose(action: string, done: (value?: boolean) => void) {
  if (action === 'cancel') {
    done()
    return
  }

  if (joinPassword.value !== group.value.password) {
    showNotify({
      type: 'danger',
      message: 'Oops... 密碼錯誤',
    })
    done(false)
    return
  }

  try {
    group.value.members.push(profile.value?.userId)

    await turnipSVC.updateGroup(group.value.id, {
      ...group.value,
    })
    updateProfileByUserId()

    done()
    router.push({ name: 'TurnipGroupDetails', params: { id: group.value.id } })
  }
  catch (err) {
    console.log(err)
    done()
  }
}
</script>

<template>
  <div class="group">
    <div class="turnip-group__tabs app-surface">
      <van-tabs v-model="activeTab" type="card">
        <van-tab title="全部" name="all" />
        <van-tab title="已加入" name="joined" />
        <van-tab title="未加入" name="notjoin" />
      </van-tabs>
    </div>

    <div class="turnip-group__list">
      <button
        v-for="item in filterGroupList"
        :key="item.id"
        type="button"
        class="turnip-group__card app-surface"
        @click="goDetails(item)"
      >
        <div class="turnip-group__card-head">
          <div>
            <div class="turnip-group__card-title">
              {{ item.name }}
            </div>
            <div class="little-text">
              {{ item.password ? '私密群組' : '公開群組' }}
            </div>
          </div>
          <van-tag v-if="item.members.includes(profile.userId)" type="success" plain>
            已加入
          </van-tag>
          <van-tag v-else plain>
            未加入
          </van-tag>
        </div>
        <div class="turnip-group__card-foot">
          <span class="little-text">{{ item.members.length }} 位成員</span>
          <span class="turnip-group__card-action">查看詳情</span>
        </div>
      </button>
    </div>

    <button type="button" class="plus-btn" @click="openEditor">
      <van-icon name="plus" />
    </button>

    <van-popup
      v-model:show="showEditor"
      position="bottom"
      closeable
      :style="{ height: '70%' }"
    >
      <div class="padding-t-30">
        <van-divider>建立群組</van-divider>
        <van-form @submit="onSubmit">
          <van-field
            v-model="groupName"
            name="群組名稱"
            label="群組名稱"
            placeholder="請填寫群組名稱"
            :rules="[{ required: true, message: '請填寫群組名稱' }]"
          />
          <van-field name="switch" label="私密群組">
            <template #input>
              <van-switch v-model="isPrivate" size="20" />
            </template>
          </van-field>
          <van-field
            v-if="isPrivate"
            v-model="password"
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

    <van-dialog
      v-model:show="showDialog"
      show-cancel-button
      close-on-popstate
      :before-close="beforeClose"
    >
      <template #title>
        <div class="padding-a-10">
          您不在群組內，是否要加入群組？
        </div>
      </template>
      <div class="padding-a-10 fs-14">
        群組名稱：{{ group.name }}
        <br>加入群組後菜價資訊將會公開分享給群組內成員。
      </div>
      <van-field
        v-if="group.password"
        v-model="joinPassword"
        label="群組密碼"
        placeholder="請輸入群組密碼"
      />
    </van-dialog>
  </div>
</template>

<style lang="scss" scoped>
.group {
  position: relative;
}

.turnip-group__tabs {
  padding: 20px;
  margin-bottom: 14px;
}

.turnip-group__card-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}

.turnip-group__list {
  display: grid;
  gap: 12px;
}

.turnip-group__card {
  width: 100%;
  padding: 18px;
  border: 0;
  text-align: left;
}

.turnip-group__card-head,
.turnip-group__card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.turnip-group__card-action {
  color: var(--van-primary-color);
}

.turnip-group__card-foot {
  margin-top: 14px;
}

.plus-btn {
  position: fixed;
  right: 15px;
  bottom: calc(env(safe-area-inset-bottom) + 65px);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 0;
  background-color: #16a34a;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  box-shadow: 0 16px 24px rgba(22, 163, 74, 0.24);
}
</style>
