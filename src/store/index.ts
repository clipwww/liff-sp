import type { LineProfile } from '@/view-models/liff.vm'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLoading: false,
    isLoggedIn: false,
    profile: null as LineProfile | null,
  }),
  getters: {
    pictureUrl: (state): string =>
      state.profile?.pictureUrl
      ?? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  },
  actions: {
    updateLoggedIn() {
      this.isLoggedIn = window.liff.isLoggedIn()
    },
    async updateProfile() {
      if (!this.isLoggedIn) { return }
      this.profile = await window.liff.getProfile()
    },
  },
})
