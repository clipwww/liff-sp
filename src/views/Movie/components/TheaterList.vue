<template>
  <div>
    <van-cell @click="goDetails(item)" v-for="item in theaters" :key="item.id">
      <van-icon slot="icon" name="like-o" class="lh-inherit margin-r-10"/>
      {{ item.name }}
    </van-cell>
    <div v-show="!theaters.length && cityId">
      <van-cell v-for="n in 10" :key="n">
        <van-skeleton title :row="0" />
      </van-cell>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';

export default {
  props: {
    cityId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      theaters: [],
    };
  },
  created() {
    this.getTheaterList();
  },
  methods: {
    async getTheaterList() {
      if (!this.cityId) {
        return;
      }
      await movieRef.child(`theaters-${this.cityId}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          this.theaters = data.items;
        }
      });

      const ret = await movieSVC.getTheaterList(this.cityId);
      if (!ret.success) {
        return;
      }

      if (!_isEqual(this.theaters, ret.items)) {
        console.log('new!');
        movieRef.child(`theaters-${this.cityId}`).set({
          items: ret.items,
          dateCreated: +moment(),
        });
      }
      this.theaters = ret.items;
    },
    goDetails(item) {
      this.$router.push({ name: 'MovieTheaterDetails', params: { id: item.id }, query: { cityId: this.cityId } });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>