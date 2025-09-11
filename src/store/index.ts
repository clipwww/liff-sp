import { defineStore } from 'pinia'
import type { LineProfile } from '@/view-models/liff.vm'

export interface RootState {
  isLoading: boolean
  isLoggedIn: boolean
  profile: LineProfile | null
}

export const useMainStore = defineStore('main', {
  state: (): RootState => ({
    isLoading: false,
    isLoggedIn: false,
    profile: null,
  }),

  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => state.isLoggedIn && window.liff.isLoggedIn(),
    profile: state => state.profile || {},
    pictureUrl: state => state.profile?.pictureUrl ?? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  },

  actions: {
    updateLoggedIn() {
      this.isLoggedIn = window.liff.isLoggedIn()
    },

    async updateProfile() {
      if (!this.isLoggedIn) {
        return
      }
      const profile = await window.liff.getProfile()
      this.profile = profile
    },
  },
})
