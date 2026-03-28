import { defineStore } from 'pinia'
import api from '@/lib/api'
import { useLessonsStore } from '@/stores/lessons'
import { useStudentsStore } from '@/stores/students'

export const useAuthStore = defineStore('Account', {
  state: () => ({
    user: null,
  }),
  actions: {
    clearCachedData() {
      useLessonsStore().resetCache()
      useStudentsStore().resetCache()
    },

    async fetchSession() {
      try {
        this.user = (await api.get('/accounts/session')).data ?? null

        if (!this.user) {
          this.clearCachedData()
        }
      } catch {
        this.user = null
        this.clearCachedData()
      }
    },

    async login(email, password) {
      try {
        this.user = (await api.post('/accounts/session', { email, password })).data
        this.clearCachedData()
      } catch (error) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Login failed', { cause: error })
      }
    },

    async logout() {
      await api.delete('/accounts/session')
      this.user = null
      this.clearCachedData()
    },
  },
})
