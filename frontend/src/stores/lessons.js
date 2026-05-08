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

    async getLessonBySlug(slug) {
      if (!slug) return null

      const res = await api.get(`/lessons/slug/${slug}`, {
        params: { withUnits: 'true' },
      })

      this.lesson = res.data ?? null
      return this.lesson
    },

    async getUnitBySlug(lessonSlug, unitSlug) {
      if (!lessonSlug || !unitSlug) return null

      const res = await api.get(`/lessons/slug/${lessonSlug}/units/${unitSlug}`)
      return res.data ?? null
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

    async getMaterialById(materialId) {
      if (!materialId) return null
      const res = await api.get(`/lesson-materials/${materialId}`)
      return res.data ?? null
    },

    async validateQuestion(questionId, answer) {
      if (!questionId) {
        throw new Error('Question id is required')
      }

      const res = await api.post(`/questions/${questionId}/validate`, { answer })
      return res.data ?? { isCorrect: false }
    },

    resetCache() {
      this.$reset()
    }
  }
})