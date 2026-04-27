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

onMounted(async () => { 
  if (!user.classGroupKey) {
    return
  }

  if (!lessonsStore.premunLessons[user.classGroupKey]) {
    loading.value = true
  }
  
  try {
    await lessonsStore.getPremunLessons(user.classGroupKey)
  } finally {
    loading.value = false
  }
})

const lessonCards = computed(() => {
  if (!user.classGroupKey) {
    return []
  }

  return lessonsStore.premunLessons[user.classGroupKey] ?? []
}) 
const totalUnits = computed(() => lessonCards.value.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0))
const completedUnits = computed(() => 0)
const courseProgress = computed(() => 0)
const currentLesson = computed(() => lessonCards.value[0]?.units?.[0]?.title ?? '—')
</script>

<template lang="pug">
section.lp-premun-hub.container-fluid
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

    StudentLessonList(v-else :lesson-cards="lessonCards"  lesson-route-name="lesson-detail")
</template>

<style lang="scss" scoped>
.lp-premun-hub {
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