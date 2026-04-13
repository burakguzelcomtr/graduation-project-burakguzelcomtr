import { defineStore } from 'pinia'
import api from '@/lib/api' 
import { useUserStore } from './user'

export const useAuthStore = defineStore('Account', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchSession() {
      const userStore = useUserStore()

      try {
        this.user = (await api.get('/accounts/session')).data ?? null
        userStore.profile = this.user
      } catch {
        this.user = null
        userStore.profile = null
      }
    },

    async login(email, password) {
      const userStore = useUserStore()

      try {
        this.user = (await api.post('/accounts/session', { email, password })).data
        userStore.profile = this.user
      } catch (error) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed', { cause: error })
      }
    },

    async logout() {
      const userStore = useUserStore()

      await api.delete('/accounts/session')
      this.user = null
      userStore.profile = null
    },
  },
})
