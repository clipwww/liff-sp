<template>
  <div v-if="group">
    <van-cell class="margin-b-15" :title="group.name" :border="false" center>
      <div slot="label">
        <van-icon name="user-o" />
        <span class="margin-l-5">{{ group.members.length }}</span>
      </div>
      <div slot="right-icon">
        <van-button
          v-if="isCreator"
          class="margin-r-5"
          type="info"
          size="small"
          @click="showEditor = true"
        >編輯</van-button>
        <van-button type="primary" size="small" plain @click="copyLink">複製網址</van-button>
      </div>
    </van-cell>
    <van-skeleton
      class="padding-bt-15"
      v-if="!filterDataList.length"
      title
      avatar
      avatar-size="50"
      :row="5"
    ></van-skeleton>
    <van-panel v-else class="margin-b-15" v-for="item in filterDataList" :key="item.id">
      <van-cell slot="header">
        <van-image
          v-if="item.profile.pictureUrl"
          slot="icon"
          class="margin-r-15"
          :src="item.profile.pictureUrl"
          width="50"
          height="50"
          round
          lazy-load
        ></van-image>
        <div slot="title">{{ item.profile.displayName }}</div>
        <div slot="label" class="little-text">買價：{{ item.buyPrice }}</div>
        <div v-if="isCreator && item.id !== profile.userId" slot="right-icon">
          <van-button type="danger" size="mini" @click="removeMembers(item.id)">移出</van-button>
        </div>
      </van-cell>
      <van-grid :column-num="6">
        <van-grid-item v-for="(key, index) in Object.keys(item.sellPrice)" :key="key">
          <div class="little-text">{{ weekdays[index].momentInstance.format('ddd') }}</div>
          <div class="margin-bt-10">{{ item.sellPrice[key].am || '--' }}</div>
          <div>{{ item.sellPrice[key].pm || '--' }}</div>
        </van-grid-item>
      </van-grid>
      <div class="padding-bt-10">
        <TurnipLineChart :id="item.id" :buyPrice="item.buyPrice" :sellPrice="item.sellPrice" />
      </div>
    </van-panel>

    <van-popup v-model="showEditor" position="bottom" closeable :style="{ height: '70%' }">
      <div class="padding-t-30">
        <van-divider>建立群組</van-divider>
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
            <van-button type="primary" round block native-type="submit">送出</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { turnipSVC } from '@/services';
import { momentUtil, copyValue } from '@/utils';

import TurnipLineChart from '@/components/TurnipLineChart.vue';

const weekStart = momentUtil.getWeekStart();
const weekdays = momentUtil.getWeekdays();

export default {
  components: {
    TurnipLineChart,
  },
  data() {
    return {
      weekdays,
      group: null,
      dataList: [],
      userList: [],
      showEditor: false,

      form: {
        groupName: '',
        isPrivate: false,
        password: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    groupId() {
      return this.$route.params.id;
    },
    filterDataList() {
      return this.dataList
        .filter(item => this.group?.members?.includes(item.id))
        .map(item => {
          const user = this.userList.find(u => u.id === item.id);

          return {
            ...item,
            profile: user || {},
          };
        })
        .sort((a, b) => {
          const w = now.weekday();

          const aPrice = a?.sellPrice[`w${w}`][now.format('a')] ?? 0;
          const bPrice = a?.sellPrice[`w${w}`][now.format('b')] ?? 0;

          return aPrice > bPrice ? -1 : 1;
        });
    },
    isCreator() {
      // 創造群組之人
      return this.group?.creatorId === this.profile.userId;
    },
  },
  watch: {
    showEditor(bool) {
      this.form.groupName = this.group.name;
      this.form.isPrivate = !!this.group.password;
      this.form.password = this.group.password;
    },
  },
  created() {
    turnipSVC.listenerGroupById(this.groupId, group => {
      this.group = group;

      if (!this.group.members.includes(this.profile.userId)) {
        // 不在群組內
        this.$router.replace({ name: 'TurnipGroup' });
      }
    });

    turnipSVC.listenerPriceList(weekStart, list => {
      this.dataList = list;
    });

    turnipSVC.listenerUserList(list => {
      this.userList = list;
    });
  },
  beforeDestroy() {
    turnipSVC.removeListenerGroupById(this.groupId);
    turnipSVC.removeListenerPriceList(weekStart);
    turnipSVC.removeListenerUserList();
  },
  methods: {
    async removeMembers(userId) {
      try {
        const members = this.group.members;

        await turnipSVC.updateGroup(this.groupId, {
          ...this.group,
          members: members.filter(item => item.id !== userId),
        });

        this.$notify({
          type: 'success',
          message: '移出成員成功',
        });
      } catch (err) {
        console.log(err);
      }
    },
    async onSubmit() {
      try {
        await turnipSVC.updateGroup(this.groupId, {
          ...this.group,
          name: this.form.groupName,
          password: this.form.isPrivate ? this.form.password : '',
        });

        this.showEditor = false;
        this.$notify({
          type: 'success',
          message: '修改成功',
        });
      } catch (err) {
        console.log(err);
      }
    },
    copyLink() {
      const isOk = copyValue(`https://liff.line.me/1557984400-gjEoY0y1/liff-sp/${this.$route.fullPath}`);
      if (isOk) {
        this.$toast.success('已複製群組網址');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
