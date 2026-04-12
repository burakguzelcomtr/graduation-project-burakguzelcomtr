import { defineStore } from 'pinia'
import { watch } from 'vue'
import api from '@/lib/api'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
  }),
  actions: {
    async fetchMe() {
      try {
        this.profile = (await api.get('/users/me')).data
      } catch {
        this.profile = null
      }
    },

    watchAuth() {
      const authStore = useAuthStore()
      watch(
        () => authStore.user,
        (account) => {
          if (account) this.fetchMe()
          else this.profile = null
        },
        { immediate: true },
      )
    },
  },
})
