<template>
  <div class="group">
    <div class="margin-bt-15">
      <van-tabs type="card" v-model="activeTab">
        <van-tab title="全部" name="all"></van-tab>
        <van-tab title="已加入" name="joined"></van-tab>
        <van-tab title="未加入" name="notjoin"></van-tab>
      </van-tabs>
    </div>

    <van-skeleton class="padding-bt-15" v-if="isLoading" :title="false" :avatar="false" :row="2"></van-skeleton>
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
        <div slot="label">
          <van-icon name="user-o" />
          <span class="margin-l-5">{{ item.members.length }}</span>
        </div>
        <div slot="icon" class="margin-r-15">
          <van-tag v-if="item.members.includes(profile.userId)" type="success" plain>已加入</van-tag>
          <van-tag v-else plain>未加入</van-tag>
        </div>
      </van-cell>
    </van-cell-group>

    <div class="plus-btn" @click="showEditor = true">
      <van-icon name="plus" />
    </div>

    <van-popup v-model="showEditor" position="bottom" closeable :style="{ height: '70%' }">
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
            <van-button type="primary" round block native-type="submit">送出</van-button>
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
      <div class="padding-a-10" slot="title">您不在群組內，是否要加入群組？</div>
      <div class="padding-a-10 fs-14">
        群組名稱：{{ group.name }}
        <br />加入群組後菜價資訊將會公開分享給群組內成員。
      </div>
      <van-field v-if="group.password" label="群組密碼" v-model="joinPassword" placeholder="請輸入群組密碼"></van-field>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { turnipSVC } from '@/services';

export default {
  data() {
    return {
      activeTab: 'all',
      showEditor: false,
      groupName: '',
      password: '',
      isPrivate: false,
      groupList: [],
      showDialog: false,

      group: {},
      joinPassword: '',
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    filterGroupList() {
      switch (this.activeTab) {
        case 'all':
          return this.groupList;
        case 'joined':
          return this.groupList.filter(item => item.members.includes(this.profile.userId));
        case 'notjoin':
          return this.groupList.filter(item => !item.members.includes(this.profile.userId));
        default:
          return [];
      }
    },
  },
  watch: {
    showDialog(bool) {
      if (!bool) {
        this.joinPassword = '';
        this.group = {};
      }
    },
  },
  created() {
    turnipSVC.listenerGroupList(list => {
      this.groupList = list;
      this.isLoading = false;
    });
  },
  beforeDestroy() {
    turnipSVC.removeListenerGroupList();
  },
  methods: {
    async onSubmit() {
      try {
        await turnipSVC.createGroup({
          name: this.groupName,
          password: this.isPrivate ? this.password : '',
          creatorId: this.profile.userId,
        });

        this.showEditor = false;
      } catch (err) {
        console.log(err);
      }
    },
    async goDetails(item) {
      if (!item.members.includes(this.profile.userId)) {
        // 不在群組內
        this.group = item;
        this.showDialog = true;
        return;
      }

      this.$router.push({ name: 'TurnipGroupDetails', params: { id: item.id } });
    },
    async beforeClose(action, done) {
      if (action === 'cancel') {
        done();
        return;
      }

      if (this.joinPassword !== this.group.password) {
        this.$notify({
          type: 'danger',
          message: 'Oops... 密碼錯誤',
        });
        done(false);
        return;
      }

      try {
        this.group.members.push(this.profile.userId);

        turnipSVC.updateGroup(this.group.id, {
          ...this.group,
        });

        done();
        this.$router.push({ name: 'TurnipGroupDetails', params: { id: this.group.id } });
      } catch (err) {
        console.log(err);
        done();
      }
    },
  },
};
</script>

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