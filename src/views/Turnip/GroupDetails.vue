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
        <van-button
          v-else
          class="margin-r-5"
          type="danger"
          size="mini"
          @click="removeMembers(profile.userId)"
        >退出</van-button>
        <van-button class="padding-lr-5" type="primary" size="mini" plain @click="copyLink">複製網址</van-button>
      </div>
    </van-cell>
    <van-panel class="margin-b-15" v-for="item in filterPriceList" :key="item.id">
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
      <div class="padding-a-10">
        <van-button type="danger" size="mini" @click="removeGroup">刪除群組</van-button>
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
            <van-button type="primary" round block native-type="submit">送出</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';
import _cloneDeep from 'lodash/cloneDeep';

import { turnipSVC } from '@/services';
import { momentUtil, copyValue } from '@/utils';

import TurnipLineChart from '@/components/TurnipLineChart.vue';

const weekStart = momentUtil.getWeekStart();
const weekdays = momentUtil.getWeekdays();
const now = moment();

const sellPrice = {};
weekdays.forEach(item => {
  sellPrice[item.id] = {
    am: '',
    pm: '',
  };
});

export default {
  metaInfo() {
    return {
      title: this.$route.query.title || this.group?.name,
    };
  },
  components: {
    TurnipLineChart,
  },
  props: {
    userList: {
      type: Array,
      default() {
        return [];
      },
    },
    priceList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      weekdays,
      group: null,
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
    filterPriceList() {
      return this.userList
        .filter(item => this.group?.members?.includes(item.id))
        .map(user => {
          const price = this.priceList.find(p => p.id === user.id) || {
            buyPrice: '',
            sellPrice: _cloneDeep(sellPrice),
          };

          return {
            ...price,
            profile: user,
          };
        })
        .sort((a, b) => {
          try {
            const w = now.weekday();
            if (w <= 0) {
              return a.buyPrice > b.buyPrice ? 1 : -1;
            }
            // am 或 pm
            const key = now.locale('en-us').format('a');

            const aPrice = +a?.sellPrice[`w${w}`][key] || 0;
            const bPrice = +b?.sellPrice[`w${w}`][key] || 0;
            console.log(aPrice, bPrice)

            return aPrice > bPrice ? -1 : 1;
          } catch (err) {
            console.log(err);
            return 1;
          }
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

      if (!this.group?.members?.includes(this.profile.userId)) {
        // 不在群組內
        this.$router.replace({ name: 'TurnipGroup' });
      }
    });
  },
  beforeDestroy() {
    turnipSVC.removeListenerGroupById(this.groupId);
  },
  methods: {
    async removeMembers(userId) {
      try {
        await this.$dialog.confirm({
          title: '確定嗎？',
        });

        const members = this.group.members.filter(id => id !== userId);

        await turnipSVC.updateGroup(this.groupId, {
          ...this.group,
          members,
        });

        this.$notify({
          type: 'success',
          message: '成功',
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
    async removeGroup() {
      try {
        await this.$dialog.confirm({
          title: '注意，此動作無法復原',
          message: '確定要刪除群組？',
        });

        await turnipSVC.removeGroup(this.groupId);
      } catch (err) {
        console.log(err);
      }
    },
    copyLink() {
      const isOk = copyValue(`https://liff.line.me/1557984400-gjEoY0y1/liff-sp/${this.$route.fullPath}`);
      if (isOk) {
        this.$toast.success({
          message: '已複製群組網址',
          duration: 700,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
