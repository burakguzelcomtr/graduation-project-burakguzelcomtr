import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useLessonsStore = defineStore('lessons', {
  state: () => ({
    mainLessons: {},
    premunLessons: {},
    lesson: null
  }),

  actions: {
    async getMainLessons(classGroup) {
      if (!classGroup) return []

      if (this.mainLessons[classGroup]) {
        return this.mainLessons[classGroup]
      }

      const res = await api.get('/lessons', {
        params: {
          withUnits: 'true',
          type: 'main',
          classGroup,
        }
      })

      this.mainLessons[classGroup] = res.data ?? []
      return this.mainLessons[classGroup]
    },

    async getPremunLessons(classGroup) {
      if (!classGroup) return []

      if (this.premunLessons[classGroup]) {
        return this.premunLessons[classGroup]
      }

      const res = await api.get('/lessons', {
        params: {
          withUnits: 'true',
          type: 'premun',
          classGroup,
        }
      })

      this.premunLessons[classGroup] = res.data ?? []
      return this.premunLessons[classGroup]
    },

    async getLessonById(lessonId) {
      if (!lessonId) return null

      const res = await api.get(`/lessons/${lessonId}`, {
        params: {
          withUnits: 'true'
        }
      })

      this.lesson = res.data ?? null
      return this.lesson
    },

    resetCache() {
      this.$reset()
    }
  }
})