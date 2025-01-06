// src/stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: (): any => ({
    session: null,
  }),
  actions: {
    setSession(session: any) {
      this.session = session;
    },
    clearSession() {
      this.session = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.session,
  },
});
