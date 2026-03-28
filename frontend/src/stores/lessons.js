import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    mainLessons: {},
    premunLessons: {}
  }),

  actions: {
    async getMainLessons(classGroupId) {
      if (!classGroupId) return []

      if (this.mainLessons[classGroupId]) {
        return this.mainLessons[classGroupId]
      }

      const res = await api.get('/lessons', {
        params: {
          withUnits: 'true',
          type: 'main',
          classGroupId
        }
      })

      this.mainLessons[classGroupId] = res.data ?? []
      return this.mainLessons[classGroupId]
    },

    async getPremunLessons(classGroupId) {
      if (!classGroupId) return []

      if (this.premunLessons[classGroupId]) {
        return this.premunLessons[classGroupId]
      }

      const res = await api.get('/lessons', {
        params: {
          withUnits: 'true',
          type: 'premun',
          classGroupId
        }
      })

      this.premunLessons[classGroupId] = res.data ?? []
      return this.premunLessons[classGroupId]
    },

    resetCache() {
      this.$reset()
    }
  }
})