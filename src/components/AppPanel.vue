<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  desc?: string
}>(), {
  title: '',
  desc: '',
})
</script>

<template>
  <div class="van-panel">
    <slot name="header">
      <van-cell v-if="title || desc" :title="title" :label="desc" />
    </slot>
    <slot />
    <div v-if="$slots.footer" class="van-panel__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.van-panel {
  background: var(--van-background-2);
  overflow: hidden;
}
.van-panel__footer {
  padding: var(--van-padding-md) var(--van-padding-md) calc(var(--van-padding-md) - var(--van-padding-xs));
}
</style>
