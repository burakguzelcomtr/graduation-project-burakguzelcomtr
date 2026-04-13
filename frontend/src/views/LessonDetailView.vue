<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import StudentLessonUnitsAccordion from '@/components/student/StudentLessonUnitsAccordion.vue'
import { useLessonsStore } from '@/stores/lessons'

const route = useRoute()
const lessonsStore = useLessonsStore()
const loading = ref(false)
const errorMessage = ref('')

const lessonId = computed(() => route.params.lessonId ?? '')
const lesson = computed(() => lessonsStore.lesson)
const totalUnits = computed(() => lesson.value?.units?.length ?? 0)
const currentUnitTitle = computed(() => lesson.value?.units?.[0]?.title ?? '—')
const completedUnits = 0
const courseProgress = 0

watch(lessonId, async (id) => {
  if (!id) {
    lessonsStore.lesson = null
    return
  }

  lessonsStore.lesson = null
  loading.value = true
  errorMessage.value = ''

  try {
    await lessonsStore.getLessonById(id)
  } catch (error) {
    errorMessage.value = error.response?.data?.error ?? 'Lesson could not be loaded.'
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<template lang="pug">
section.lp-lesson-detail.container-fluid
  .lp-lesson-detail__loading(v-if="loading")
    span Loading lesson...

  .lp-lesson-detail__error(v-else-if="errorMessage")
    p {{ errorMessage }}

  .lp-lesson-detail__empty(v-else-if="!lesson")
    p Lesson not found.

  template(v-else)
    PageHeader(:title="lesson.title ?? 'Lesson'" :show-decoration="false")
      template(#meta)
        StudentProgressSummary(
          :current-lesson="currentUnitTitle"
          :course-progress="courseProgress"
          :completed-units="completedUnits"
          :total-units="totalUnits"
        )

      button.lp-lesson-detail__start.btn(type="button") Start

    .lp-lesson-detail__content.row
      .col-12.col-xl-4
        section.lp-lesson-detail__section
          h2.lp-lesson-detail__heading Description
          p.lp-lesson-detail__description {{ lesson.description || 'No description has been added for this lesson yet.' }}

      .col-12.col-xl-8
        section.lp-lesson-detail__section
          .lp-lesson-detail__section-head
            h2.lp-lesson-detail__heading Units
            span.lp-lesson-detail__count {{ totalUnits }} units

          StudentLessonUnitsAccordion(:units="lesson.units || []")
</template>

<style lang="scss" scoped>
.lp-lesson-detail {
  padding: 24px 0;
  font-family: 'Fredoka', sans-serif;

  &__loading,
  &__error,
  &__empty {
    padding: 32px;
    color: #6b7280;
  }

  &__start {
    padding: 13.6px 25.6px;
    border: none;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 12px 30px rgba(124, 45, 18, 0.18);
    color: #c2410c;
    font-size: 15.2px;
    font-weight: 800;
    cursor: pointer;
  }

  &__section {
    padding: 22.4px;
    border: 2px dashed #ffedd5;
    border-radius: 16px;
    background: #fffaf5;
  }

  &__content {
    margin-top: 24px;
    --bs-gutter-x: 24px;
    --bs-gutter-y: 24px;
  }

  &__section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__heading {
    margin: 0;
    color: #7c2d12;
    font-size: 19.2px;
  }

  &__description {
    margin: 0;
    color: #6b7280;
    line-height: 1.7;
  }

  &__count {
    flex-shrink: 0;
    padding: 7.2px 12.8px;
    border-radius: 999px;
    background: #ffedd5;
    color: #c2410c;
    font-size: 12.48px;
    font-weight: 700;
  }
}

@media (max-width: 700px) {
  .lp-lesson-detail {
    &__section-head {
      flex-direction: column;
      align-items: flex-start;
    }

    &__start {
      width: 100%;
    }
  }
}
</style>