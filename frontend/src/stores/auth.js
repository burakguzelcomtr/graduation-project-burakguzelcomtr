import { defineStore } from 'pinia'
import api from '@/lib/api' 

export const useAuthStore = defineStore('Account', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchSession() {
      try {
        this.user = (await api.get('/accounts/session')).data ?? null 
      } catch {
        this.user = null
      }
    },

    async login(email, password) {
      try {
        this.user = (await api.post('/accounts/session', { email, password })).data
      } catch (error) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed', { cause: error })
      }
    },

    async logout() {
      await api.delete('/accounts/session')
      this.user = null
    },
  },
})
