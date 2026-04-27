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
        const session = (await api.get('/accounts/session')).data ?? null

        this.user = session?.user ?? null
        userStore.profile = this.user
      } catch {
        this.user = null
        userStore.profile = null
      }
    },

    async login(email, password) {
      const userStore = useUserStore()

      try {
        const session = (await api.post('/accounts/session', { email, password })).data ?? null

        this.user = session?.user ?? null
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
