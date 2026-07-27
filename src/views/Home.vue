<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const routes = computed(() => {
  return (router.options.routes ?? []).filter(item => item.path !== '/')
})

function goFeature(name?: string) {
  if (!name) {
    return
  }

  router.push({ name })
}
</script>

<template>
  <div class="home app-page">
    <section class="home-hero app-surface app-section">
      <van-swipe class="home-hero__media" :autoplay="5000" indicator-color="white">
        <van-swipe-item v-for="n in 5" :key="n">
          <van-image
            src="/images/howhow.jpg"
            width="100%"
            height="220"
            fit="cover"
          />
        </van-swipe-item>
      </van-swipe>
    </section>

    <section class="app-section">
      <div class="app-section-title">
        功能入口
      </div>

      <div class="feature-grid margin-t-15">
        <button
          v-for="item in routes"
          :key="item.name"
          type="button"
          class="feature-card app-surface"
          @click="goFeature(item.name?.toString())"
        >
          <div class="feature-card__media">
            <van-icon
              v-if="item.meta?.icon"
              class="feature-card__icon"
              size="30"
              :name="item.meta.icon"
            />
            <van-image
              v-else-if="item.meta?.image"
              class="feature-card__image"
              width="42"
              height="42"
              fit="contain"
              :src="item.meta.image"
              alt="feature"
            />
          </div>
          <div class="feature-card__title">
            {{ item.meta?.label }}
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-top: 20px;
  padding-bottom: 28px;
}

.home-hero {
  padding: 20px;
  overflow: hidden;
}

.home-hero__media {
  overflow: hidden;
  border-radius: 20px;

  :deep(.van-swipe-item) {
    background: var(--van-gray-2);
  }
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.feature-card {
  width: 100%;
  padding: 22px 20px;
  border: 0;
  text-align: left;
}

.feature-card__media {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: rgba(25, 137, 250, 0.08);
}

.feature-card__icon {
  color: var(--van-primary-color);
}

.feature-card__title {
  margin-top: 18px;
  font-size: 22px;
  font-weight: 700;
  color: var(--van-text-color);
}
</style>
