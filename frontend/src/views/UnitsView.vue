<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLessonsStore } from '@/stores/lessons'
import PageHeader from '@/components/PageHeader.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const lessonsStore = useLessonsStore()
const badgesEarned = 0
const loading = ref(false)

const classGroupId = computed(() => user.profile?.classGroup ?? null)

onMounted(async () => {
  if (!classGroupId.value) {
    return
  }

  if (!lessonsStore.mainLessons[classGroupId.value]) {
    loading.value = true
  }

  try {
    await lessonsStore.getMainLessons(classGroupId.value)
  } finally {
    loading.value = false
  }
})

const lessonCards = computed(() => {
  if (!classGroupId.value) {
    return []
  }

  return lessonsStore.mainLessons[classGroupId.value] ?? []
})
const totalUnits = computed(() => lessonCards.value.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0))
const completedUnits = computed(() => 0)
const courseProgress = computed(() => 0)
const currentLesson = computed(() => lessonCards.value[0]?.units?.[0]?.title ?? '—')
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