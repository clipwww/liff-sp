<template>
  <div>
    <van-cell v-for="(item, i) in items" 
      :key="item.id"
      :title="item.name"
      :label="item.description"
      @click="goDetails(item)">
      <van-image slot="icon" class="margin-r-10" width="40" :src="item.poster" :lazy-load="i > 0" />
      <van-image v-if="item.cerImg" slot="right-icon" class="margin-l-5" width="40" fit="contain" :src="item.cerImg" :lazy-load="i > 0" />
    </van-cell>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    goDetails(item) {
      this.$router.push({ name: 'MovieDetails', params: { id: item.id } });
    }
  }
}
</script>

<style>

</style>