<script setup>
import { computed, onMounted, ref } from 'vue' 
import { useUserStore } from '@/stores/user'
import { useLessonsStore } from '@/stores/lessons'
import PageHeader from '@/components/PageHeader.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
 
const user = useUserStore()
const lessonsStore = useLessonsStore()
const badgesEarned = 0
const loading = ref(false)

const classGroupId = computed(() => user.profile?.classGroup?._id ?? user.profile?.classGroup ?? null)

onMounted(async () => {
  if (!classGroupId.value) {
    return
  }

  if (!lessonsStore.premunLessons[classGroupId.value] || !lessonsStore.mainLessons[classGroupId.value]) {
    loading.value = true
  }

  try {
    await Promise.all([
      lessonsStore.getPremunLessons(classGroupId.value),
      lessonsStore.getMainLessons(classGroupId.value),
    ])
  } finally {
    loading.value = false
  }
})

const lessonCards = computed(() => {
  if (!classGroupId.value) {
    return []
  }

  return lessonsStore.premunLessons[classGroupId.value] ?? []
})
const mainLessonCards = computed(() => {
  if (!classGroupId.value) {
    return []
  }

  return lessonsStore.mainLessons[classGroupId.value] ?? []
})
const totalUnits = computed(() => mainLessonCards.value.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0))
const completedUnits = computed(() => 0)
const courseProgress = computed(() => 0)
const currentLesson = computed(() => mainLessonCards.value[0]?.units?.[0]?.title ?? '—')
</script>

<template lang="pug">
.lp-premun-hub
  .lp-premun-hub__loading(v-if="loading")
    span Loading your PREMUN lessons...

  template(v-else)
    PageHeader(
      title="PREMUN Hub"
    )
      StudentProgressSummary(
        :current-lesson="currentLesson"
        :course-progress="courseProgress"
        :badges-earned="badgesEarned"
        :completed-units="completedUnits"
        :total-units="totalUnits"
      )

    .lp-premun-hub__empty(v-if="!lessonCards.length")
      p No PREMUN lessons have been assigned to your class yet.

    StudentLessonList(v-else :lesson-cards="lessonCards")
</template>

<style lang="scss" scoped>
.lp-premun-hub {
  padding: 1.5rem;
  font-family: 'Fredoka', sans-serif;

  &__loading {
    padding: 2rem;
    color: #a0aec0;
    font-size: 0.95rem;
  }

  &__empty {
    padding: 1.5rem;
    color: #a0aec0;
    font-size: 0.95rem;
    text-align: center;
  }
}
</style>