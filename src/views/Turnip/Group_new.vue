<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showNotify } from 'vant'

import { turnipSVC } from '@/services'
import { useMainStore } from '@/store'

// Props
interface Props {
  groupList: any[]
}

const props = withDefaults(defineProps<Props>(), {
  groupList: () => [],
})

const router = useRouter()
const store = useMainStore()

// 響應式數據
const activeTab = ref('all')
const showEditor = ref(false)
const groupName = ref('')
const password = ref('')
const isPrivate = ref(false)
const showDialog = ref(false)
const group = ref<any>({})
const joinPassword = ref('')

// 計算屬性
const profile = computed(() => store.profile)
const filterGroupList = computed(() => {
  switch (activeTab.value) {
    case 'all':
      return props.groupList
    case 'joined':
      return props.groupList.filter(item => item.members.includes(profile.value.userId))
    case 'notjoin':
      return props.groupList.filter(item => !item.members.includes(profile.value.userId))
    default:
      return []
  }
})

// 監聽器
watch(showDialog, (bool) => {
  if (!bool) {
    joinPassword.value = ''
    group.value = {}
  }
})

// 方法
async function updateProfileByUserId() {
  try {
    await turnipSVC.updateProfileByUserId(profile.value.userId, profile.value)
  } catch (err) {
    console.log(err)
  }
}

async function onSubmit() {
  try {
    await turnipSVC.createGroup({
      name: groupName.value,
      password: isPrivate.value ? password.value : '',
      creatorId: profile.value.userId,
    })

    showEditor.value = false

    updateProfileByUserId()
  } catch (err) {
    console.log(err)
  }
}

async function goDetails(item: any) {
  if (!item.members.includes(profile.value.userId)) {
    // 不在群組內
    group.value = item
    showDialog.value = true
    return
  }

  router.push({ name: 'TurnipGroupDetails', params: { id: item.id } })
}

async function beforeClose(action: string, done: (confirm?: boolean) => void): Promise<boolean> {
  if (action === 'cancel') {
    done()
    return true
  }

  if (joinPassword.value !== group.value.password) {
    showNotify({
      type: 'danger',
      message: 'Oops... 密碼錯誤',
    })
    done(false)
    return false
  }

  try {
    group.value.members.push(profile.value.userId)

    await turnipSVC.updateGroup(group.value.id, {
      ...group.value,
    })
    updateProfileByUserId()

    done()
    router.push({ name: 'TurnipGroupDetails', params: { id: group.value.id } })
    return true
  } catch (err) {
    console.log(err)
    done()
    return false
  }
}
</script>

<template>
  <div class="group">
    <div class="margin-bt-15">
      <van-tabs v-model="activeTab" type="card">
        <van-tab title="全部" name="all" />
        <van-tab title="已加入" name="joined" />
        <van-tab title="未加入" name="notjoin" />
      </van-tabs>
    </div>

    <van-cell-group>
      <van-cell
        v-for="item in filterGroupList"
        :key="item.id"
        :title="item.name"
        center
        is-link
        clickable
        @click="goDetails(item)"
      >
        <template #label>
          <span class="margin-r-10 little-text">{{ item.password ? '私密' : '公開' }}群組</span>
          <van-icon name="user-o" />
          <span class="margin-l-5">{{ item.members.length }}</span>
        </template>
        <template #icon>
          <div class="margin-r-15">
            <van-tag v-if="item.members.includes(profile.userId)" type="success" plain>
              已加入
            </van-tag>
            <van-tag v-else plain>
              未加入
            </van-tag>
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="plus-btn" @click="showEditor = true">
      <van-icon name="plus" />
    </div>

    <van-popup
      v-model="showEditor"
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
      v-model="showDialog"
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

.plus-btn {
  position: fixed;
  right: 15px;
  bottom: calc(env(safe-area-inset-bottom) + 65px);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: mediumseagreen;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  opacity: 0.7;
}
</style>
