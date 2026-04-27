import { defineStore } from 'pinia'
import { watch } from 'vue'
import api from '@/lib/api'
import { useAuthStore } from './auth'

let stopAuthWatch = null

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
  }),
  getters: {
    classGroupKey: (state) => {
      const user = state.profile

      if (!user?.grade || !user?.section || !user?.campus) {
        return null
      }

      return `${user.grade}-${user.section}-${user.campus}`
    },
  },
  actions: {
    async fetchMe() {
      try {
        this.profile = (await api.get('/users/me')).data
      } catch {
        this.profile = null
      }
    },

    watchAuth() {
      if (stopAuthWatch) {
        return stopAuthWatch
      }

      const authStore = useAuthStore()
      stopAuthWatch = watch(
        () => authStore.user,
        (account) => {
          this.profile = account ?? null
        },
        { immediate: false },
      )

      return stopAuthWatch
    },
  },
})
