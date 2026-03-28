import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    studentsByClassGroup: {}
  }),

  actions: {
    async getStudentsByClassGroup(classGroupId) {
      if (!classGroupId) return []

      if (this.studentsByClassGroup[classGroupId]) {
        return this.studentsByClassGroup[classGroupId]
      }

      const res = await api.get(`/students/class-group/${classGroupId}`)

      this.studentsByClassGroup[classGroupId] = res.data ?? []
      return this.studentsByClassGroup[classGroupId]
    },

    resetCache() {
      this.$reset()
    }
  }
})