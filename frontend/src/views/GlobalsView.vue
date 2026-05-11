<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLessonsStore } from '@/stores/lessons'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/PageHeader.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'

const user = useUserStore()
const lessonsStore = useLessonsStore()
const badgesEarned = 0
const loading = ref(false)
const hero = computed(() => user.profile?.hero ?? null)
const country = computed(() => user.profile?.country ?? null)

onMounted(async () => {
  if (!user.classGroupKey) {
    return
  }

  if (!lessonsStore.mainLessons[user.classGroupKey]) {
    loading.value = true
  }

  try {
    await lessonsStore.getMainLessons(user.classGroupKey)
  } finally {
    loading.value = false
  }
})

const lessonCards = computed(() => {
  if (!user.classGroupKey) {
    return []
  }

  return lessonsStore.mainLessons[user.classGroupKey] ?? []
})
const totalUnits = computed(() => lessonCards.value.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0))
const completedUnits = computed(() => 0)
const courseProgress = computed(() => 0)
const currentLesson = computed(() => lessonCards.value[0]?.units?.[0]?.title ?? '—')

function heroImg(slug) {
  return `/assets/img/heros/${slug}.svg`
}
function countryImg(slug) {
  return `/assets/img/countries/${slug}.svg`
}
</script>

<template lang="pug">
section.lp-globals-view.container-fluid
  .lp-globals-view__loading(v-if="loading")
    span Loading your globals...

  template(v-else)
    PageHeader(title="My Globals" subtitle="Your hero and country selected by your instructor.")
      StudentProgressSummary(
        :current-lesson="currentLesson"
        :course-progress="courseProgress"
        :badges-earned="badgesEarned"
        :completed-units="completedUnits"
        :total-units="totalUnits"
      )


    .lp-globals-view__content
      .row.g-4.justify-content-center
        .col-12.col-md-3
          .lp-globals-view__panel
            .lp-globals-view__panel-header My Global Hero
            .lp-globals-view__panel-body
              template(v-if="hero")
                img.lp-globals-view__hero-img(:src="heroImg(hero.slug)" :alt="hero.name")
                span.lp-globals-view__panel-name {{ hero.name }}
              span.lp-globals-view__empty(v-else) Not assigned yet

        .col-12.col-md-3
          .lp-globals-view__panel
            .lp-globals-view__panel-header My Country
            .lp-globals-view__panel-body
              template(v-if="country")
                img.lp-globals-view__flag-img(:src="countryImg(country.slug)" :alt="country.name")
                span.lp-globals-view__panel-name {{ country.name }}
              span.lp-globals-view__empty(v-else) Not assigned yet
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-globals-view {
  padding: 24px 0;
  font-family: $font-main;

  &__loading {
    padding: 32px;
    color: #a0aec0;
    font-size: 15.2px;
  }

  &__content {
	width: 100%;
    background: $bg_card;
    border: 2px dashed $primary;
    border-radius: 16px;
    padding: 40px 32px;
  }

  &__card {

    @media (max-width: 768px) {
      padding: 28px 20px;
    }
  }

  &__panel {
    height: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 12px rgba(13, 32, 68, 0.08);
  }

  &__panel-header {
    background: $bg-dark;
    color: $primary;
    font-family: $font-main;
    font-size: 15.2px;
    font-weight: 600;
    text-align: center;
    padding: 14px 16px;
    letter-spacing: 0.2px;
  }

  &__panel-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 28px 20px 24px;
    min-height: 180px;
    justify-content: center;
  }

  &__hero-img {
    width: 100px; 
	height: auto;
    object-fit: contain;
    border-radius: 8px;
  }

  &__flag-img {
    width: 100px;
    height: auto; 
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  &__panel-name {
    font-family: $font-main;
    font-size: 16px;
    font-weight: 600;
    color: $text-dark;
    text-align: center;
  }

  &__empty {
    font-family: $font-main;
    font-size: 14px;
    color: $text-muted;
    font-style: italic;
  }
}
</style>

