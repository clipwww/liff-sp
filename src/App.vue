<template>
  <div id="app">
    <router-link to="/">
      <van-button type="info" plain>藍色藥丸</van-button>
    </router-link>
    <router-link to="/login">
      <van-button type="danger" plain>紅色藥丸</van-button>
    </router-link>
    <router-view />
  </div>
</template>

<style lang="scss"></style>
