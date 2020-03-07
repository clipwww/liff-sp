import Vue from 'vue'
import Vuex from 'vuex'

import { movieRef } from '@/plugins/firebase';
import { LineProfile } from '@/view-models/liff.vm';

Vue.use(Vuex)

export interface RootState {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: LineProfile | null;

}

export default new Vuex.Store<RootState>({
  state: {
    isLoading: false,
    isLoggedIn: false,
    profile: null,
  },
  mutations: {
    UPDATE_LOGGED_IN(state, bool: boolean) {
      state.isLoggedIn = bool;
    },
    UPDATE_PROFILE(state, profile: LineProfile) {
      state.profile = profile;
    }
  },
  actions: {
    updateLoggedIn({ commit }) {
      commit('UPDATE_LOGGED_IN', window.liff.isLoggedIn());
    },
    async updateProfile({ commit, state }) {
      if (!state.isLoggedIn) {
        return;
      }
      const profile = await window.liff.getProfile();

      commit('UPDATE_PROFILE', profile);
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => state.isLoggedIn && window.liff.isLoggedIn(),
    profile: state => state.profile || {},
    pictureUrl: state => state.profile?.pictureUrl ?? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  modules: {
  }
})
