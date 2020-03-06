<template>
  <div class="theater">
    <!-- <template v-for="item in citys">
      <van-divider content-position="left" :key="item.id">{{ item.name }}</van-divider>
      <TheaterList :cityId="item.id" :key="item.id" />
    </template>-->
    <div class="theater__container">
      <van-dropdown-menu class="dropdown">
        <van-dropdown-item v-model="cityId" :options="cityOptions" />
      </van-dropdown-menu>
      <div class="theater__list">
        <TheaterList :cityId="cityId" :key="cityId" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _isEqual from 'lodash/isEqual';

import { movieSVC } from '@/services';
import { movieRef } from '@/plugins/firebase';

import TheaterList from './components/TheaterList.vue';

export default {
  components: {
    TheaterList,
  },
  data() {
    return {
      cityId: window.localStorage.getItem('cityId') || '',
      citys: [],
    };
  },
  computed: {
    cityOptions() {
      return this.citys.map(item => {
        return {
          text: item.name,
          value: item.id,
        };
      });
    },
  },
  watch: {
    cityId: {
      immediate: true,
      handler(val) {
        window.localStorage.setItem('cityId', val);
      },
    },
  },
  created() {
    movieRef.child('citys').on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        this.citys = data.items;
      }
    });
    this.getCityList();
  },
  beforeDestroy() {
    movieRef.child('citys').off();
  },
  methods: {
    async getCityList() {
      const ret = await movieSVC.getCityList();
      if (!ret.success) {
        return;
      }

      const citys = [];
      ret.items.forEach(item => {
        if (!citys.find(city => city.id === item.id)) {
          citys.push(item);
        }
      });

      if (!_isEqual(this.citys, citys)) {
        console.log('new!');
        movieRef.child('citys').set({
          items: citys,
          dateCreated: +moment(),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.theater {
  &__container {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 54px);
  }

  &__list {
    flex: 1;
    overflow: auto;
    height: 100%;
  }
}

.dropdown {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>