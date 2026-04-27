import { defineStore } from 'pinia'
import api from '@/lib/api'
import { useUserStore } from './user'

export const useStudentsStore = defineStore('students', {
  state: () => ({
    studentsByClassGroup: {}
  }),

  actions: {
    async getStudentsByClassGroup() {
      const userStore = useUserStore()
      const classGroup = userStore.classGroupKey
      const user = userStore.profile

      if (!classGroup || !user?.grade || !user?.section || !user?.campus) return []

      if (this.studentsByClassGroup[classGroup]) {
        return this.studentsByClassGroup[classGroup]
      }

      const res = await api.get('/students', {
        params: {
          grade: user.grade,
          section: user.section,
          campus: user.campus,
        },
      })

      this.studentsByClassGroup[classGroup] = res.data ?? []
      return this.studentsByClassGroup[classGroup]
    },

    resetCache() {
      this.$reset()
    }
  }
})