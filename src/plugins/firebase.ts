import { IdbRef } from '@/utils/idb-ref'

/**
 * 電影資料快取（原 Firebase Realtime Database）
 * 資料儲存於 IndexedDB 命名空間 'movie'
 */
export const movieRef = new IdbRef('movie')

/**
 * 蕪菁價格共享資料（原 Firebase Realtime Database）
 * 資料儲存於 IndexedDB 命名空間 'turnip'
 * 注意：移除 Firebase 後，多用戶即時同步功能已改為本機單機模式
 */
export const turnipRef = new IdbRef('turnip')
