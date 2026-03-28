<script setup>
defineProps({
  currentLesson: {
    type: String,
    default: '—',
  },
  currentLessonDesc: {
    type: String,
    default: '',
  },
})
</script>

<template lang="pug">
.lp-current-unit-card
  p.lp-current-unit-card__eyebrow Your Current Unit
  h2.lp-current-unit-card__title {{ currentLesson.toUpperCase() }}
  p.lp-current-unit-card__desc {{ currentLessonDesc }}
</template>

<style lang="scss" scoped>
.lp-current-unit-card {
  margin-bottom: 1.4rem;
  padding: 1.8rem 2rem;
  border: 2px dashed #de7534;
  border-radius: 14px;
  background: #fff;
  text-align: center;

  &__eyebrow {
    margin: 0 0 0.4rem;
    color: #a0aec0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0 0 0.7rem;
    color: #de7534;
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  &__desc {
    max-width: 680px;
    margin: 0 auto;
    color: #4a5568;
    font-size: 0.92rem;
    line-height: 1.6;
  }
}
</style>