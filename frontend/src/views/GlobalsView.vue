<script>
import { useLessonsStore } from '@/stores/lessons'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/PageHeader.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'

export default {
  name: 'GlobalsView',

  components: {
    PageHeader,
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
    hero() {
      return this.user.profile?.hero ?? null
    },

    country() {
      return this.user.profile?.country ?? null
    },

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

  methods: {
    heroImg(slug) {
      return `/assets/img/heros/${slug}.svg`
    },

    countryImg(slug) {
      return `/assets/img/countries/${slug}.svg`
    },
  },
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

