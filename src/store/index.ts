import type { ActionContext } from 'vuex'
import { createStore } from 'vuex'

import type { LineProfile } from '@/view-models/liff.vm'

export interface RootState {
  isLoading: boolean
  isLoggedIn: boolean
  profile: LineProfile | null

}

type RootActionContext = ActionContext<RootState, RootState>

export default createStore<RootState>({
  state: {
    isLoading: false,
    isLoggedIn: false,
    profile: null,
  },
  mutations: {
    UPDATE_LOGGED_IN(state: RootState, bool: boolean) {
      state.isLoggedIn = bool
    },
    UPDATE_PROFILE(state: RootState, profile: LineProfile) {
      state.profile = profile
    },
  },
  actions: {
    updateLoggedIn({ commit }: RootActionContext) {
      commit('UPDATE_LOGGED_IN', window.liff.isLoggedIn())
    },
    async updateProfile({ commit, state }: RootActionContext) {
      if (!state.isLoggedIn) {
        return
      }
      const profile = await window.liff.getProfile()

      commit('UPDATE_PROFILE', profile)
    },
  },
  getters: {
    isLoading: (state: RootState) => state.isLoading,
    isLoggedIn: (state: RootState) => state.isLoggedIn && window.liff.isLoggedIn(),
    profile: (state: RootState) => state.profile || {},
    pictureUrl: (state: RootState) => state.profile?.pictureUrl ?? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  },
  modules: {
  },
})
