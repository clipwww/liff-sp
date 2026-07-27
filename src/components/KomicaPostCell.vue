<script setup lang="ts">
import { showDialog } from 'vant'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useTemplateRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { filters } from '@/plugins/vue-filter'
import { toPureHtmlString, toSafeHtmlString } from '@/utils'

const props = withDefaults(defineProps<{
  item: any
  isDetails?: boolean
  oItem?: any
  showPreviewBtn?: boolean
}>(), {
  isDetails: false,
  oItem: undefined,
  showPreviewBtn: false,
})

const emit = defineEmits<{
  click: []
  clickPreview: []
  clickImage: [item: any]
}>()

const rootRef = useTemplateRef('root')

const showPopup = ref(false)
let pressTimer: number | null = null
const isLongPress = ref(false)

const replyCount = computed(() => {
  let count = 0
  const matchArr = props.item.warnText?.match(/\d+/g)
  if (matchArr) {
    count += +matchArr[0]
  }
  count += props.item?.reply?.length ?? 0
  return count
})

const formattedDate = computed(() => filters.formatDate(props.item.dateCreated))

onMounted(async () => {
  await nextTick()
  setupLinkListeners()
})

onUpdated(() => {
  setupLinkListeners()
})

onBeforeUnmount(() => {
  teardownLinkListeners()
})

onBeforeRouteLeave(() => {
  teardownLinkListeners()
})

function setupLinkListeners() {
  const rootEl = rootRef.value
  if (!rootEl) {
    return
  }

  teardownLinkListeners()

  rootEl.querySelectorAll('a').forEach((el) => {
    el.addEventListener('mousedown', onTouchStart)
    el.addEventListener('mouseup', onTouchEnd)
    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchend', onTouchEnd)
  })
}

function teardownLinkListeners() {
  const rootEl = rootRef.value
  if (!rootEl) {
    return
  }

  rootEl.querySelectorAll('a').forEach((el) => {
    el.removeEventListener('mousedown', onTouchStart)
    el.removeEventListener('mouseup', onTouchEnd)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchend', onTouchEnd)
  })
}

function onTouchStart(event: Event) {
  event.preventDefault()

  pressTimer = window.setTimeout(() => {
    isLongPress.value = true
    const target = event.target as HTMLElement | null
    const id = target?.getAttribute('href')?.replace('#r', '') ?? ''
    const linkedItem = props.oItem?.id === id ? props.oItem : props.oItem?.reply?.find((reply: any) => reply.id === id)

    if (!linkedItem) {
      return
    }

    showDialog({
      title: `No. ${linkedItem.id}`,
      message: `<div class="text-center">${linkedItem.sImg ? `<img src="${linkedItem.sImg}" />` : ''}</div>${toPureHtmlString(linkedItem.text)}`.trim(),
      allowHtml: true,
      messageAlign: 'left',
    })
  }, 600)
}

function onTouchEnd(event: Event) {
  event.preventDefault()

  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }

  if (isLongPress.value) {
    isLongPress.value = false
    return
  }

  const target = event.target as HTMLElement | null
  const isQlink = target?.classList?.contains('qlink') ?? false
  const href = target?.getAttribute('href') ?? ''

  if (!href) {
    return
  }

  if (!isQlink) {
    window.liff.openWindow({
      url: href,
    })
    return
  }

  const id = href.replace('#r', '')
  const targetEl = document.getElementById(`r${id}`)
  const offsetTop = targetEl?.offsetTop
  if (Number.isNaN(offsetTop)) {
    return
  }

  window.scrollTo(0, offsetTop - 30)
  targetEl?.classList?.add('is-active')

  setTimeout(() => {
    targetEl?.classList?.remove('is-active')
  }, 2000)
}
</script>

<template>
  <article
    :id="`r${item.id}`"
    ref="root"
    class="komica-card app-surface"
    :class="{ 'komica-card--details': isDetails }"
    @click="emit('click')"
  >
    <div class="komica-card__header">
      <div class="komica-card__header-main">
        <div class="komica-card__title-row">
          <h3 class="komica-card__title">
            {{ item.title || '未命名文章' }}
          </h3>
          <van-button
            v-if="!isDetails && showPreviewBtn"
            plain
            type="primary"
            icon="eye-o"
            size="small"
            @click.stop="emit('clickPreview')"
          >
            預覽
          </van-button>
        </div>

        <div class="komica-card__meta-row">
          <span class="little-text">No. {{ item.id }}</span>
          <span v-if="!isDetails" class="little-text">{{ replyCount }} 則回應</span>
        </div>
      </div>
    </div>

    <div class="komica-card__body" :class="{ 'komica-card__body--details': isDetails }">
      <div v-if="item.sImg" class="komica-card__thumb-wrap">
        <van-image
          class="komica-card__thumb"
          :src="item.sImg"
          width="104"
          height="104"
          fit="cover"
          radius="16"
          lazy-load
          @click.stop="emit('clickImage', item)"
        />
      </div>

      <div class="komica-card__content">
        <div
          class="komica-card__text break-word"
          :class="{ 'van-multi-ellipsis--l4': !isDetails }"
          v-html="toSafeHtmlString(item.text)"
        />

        <div class="komica-card__footer">
          <span class="little-text">{{ formattedDate }}</span>

          <van-button
            v-if="isDetails"
            plain
            size="small"
            @click.stop="showPopup = true"
          >
            更多資訊
          </van-button>
        </div>
      </div>
    </div>

    <van-popup
      v-model:show="showPopup"
      round
      position="bottom"
      close-on-popstate
      :style="{ height: '50%' }"
    >
      <div class="komica-card__sheet">
        <van-cell-group inset>
          <van-cell title="No.">
            <template #value>
              <span>{{ item.id }}</span>
            </template>
          </van-cell>
          <van-cell title="使用者 Id">
            <template #value>
              <span>{{ item.userId || '--' }}</span>
            </template>
          </van-cell>
          <van-cell title="使用者名稱">
            <template #value>
              <span>{{ item.name || '--' }}</span>
            </template>
          </van-cell>
          <van-cell title="標題">
            <template #value>
              <span>{{ item.title || '--' }}</span>
            </template>
          </van-cell>
          <van-cell title="E-mail">
            <template #value>
              <span>{{ item.email || '--' }}</span>
            </template>
          </van-cell>
          <van-cell title="建立日期">
            <template #value>
              <span>{{ formattedDate }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </article>
</template>

<style lang="scss" scoped>
.komica-card {
  padding: 18px;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &.is-active {
    border-color: rgba(25, 137, 250, 0.45);
    background-color: rgba(25, 137, 250, 0.08);
  }

  &--details {
    padding: 20px;
  }
}

.komica-card__title-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.komica-card__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  color: var(--van-text-color);
}

.komica-card__meta-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.komica-card__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  margin-top: 16px;
}

.komica-card__body--details {
  grid-template-columns: auto 1fr;
}

.komica-card__content {
  min-width: 0;
}

.komica-card__text {
  font-size: 14px;
  line-height: 1.75;
  color: var(--van-text-color);

  :deep(a) {
    color: var(--van-primary-color);
  }

  :deep(img) {
    max-width: 100%;
  }
}

.komica-card__footer {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.komica-card__sheet {
  padding: 18px 0 26px;
}

@media (max-width: 640px) {
  .komica-card__body,
  .komica-card__body--details {
    grid-template-columns: 1fr;
  }
}
</style>
