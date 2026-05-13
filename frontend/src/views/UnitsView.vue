<script>
import { useLessonsStore } from '@/stores/lessons'
import PageHeader from '@/components/PageHeader.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'UnitsView',

  components: {
    PageHeader,
    StudentLessonList,
    StudentProgressSummary,
  },

  data() {
    return {
      user: useUserStore(),
      lessonsStore: useLessonsStore(),
      badgesEarned: 0,
      loading: false,
    }
  },

  computed: {
    lessonCards() {
      if (!this.user.classGroupKey) {
        return []
      }

      return this.lessonsStore.mainLessons[this.user.classGroupKey] ?? []
    },

    totalUnits() {
      return this.lessonCards.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0)
    },

    completedUnits() {
      return 0
    },

    courseProgress() {
      return 0
    },

    currentLesson() {
      return this.lessonCards[0]?.units?.[0]?.title ?? '—'
    },
  },

  async mounted() {
    if (!this.user.classGroupKey) {
      return
    }

    if (!this.lessonsStore.mainLessons[this.user.classGroupKey]) {
      this.loading = true
    }

    try {
      await this.lessonsStore.getMainLessons(this.user.classGroupKey)
    } finally {
      this.loading = false
    }
  },
}
</script>

<template lang="pug">
section.lp-units-view.container-fluid
  .lp-units-view__loading(v-if="loading")
    span Loading your units...

  template(v-else)
    PageHeader(
      title="Units"
    )
      StudentProgressSummary(
        :current-lesson="currentLesson"
        :course-progress="courseProgress"
        :badges-earned="badgesEarned"
        :completed-units="completedUnits"
        :total-units="totalUnits"
      )

    .lp-units-view__empty(v-if="!lessonCards.length")
      p No lessons have been assigned to your class yet.

    StudentLessonList(v-else :lesson-cards="lessonCards" lesson-route-name="lesson-detail")
</template>

<style lang="scss" scoped>
.lp-units-view {
  padding: 24px 0;
  font-family: 'Fredoka', sans-serif;

  &__loading {
    padding: 32px;
    color: #a0aec0;
    font-size: 15.2px;
  }

  &__empty {
    padding: 24px;
    color: #a0aec0;
    font-size: 15.2px;
    text-align: center;
  }
}
</style>