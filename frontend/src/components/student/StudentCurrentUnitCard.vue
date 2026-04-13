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
.lp-current-unit-card.border-gradient
  p.lp-current-unit-card__eyebrow Your Current Unit
  h2.lp-current-unit-card__title {{ currentLesson.toUpperCase() }}
  p.lp-current-unit-card__desc {{ currentLessonDesc }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *; 
.lp-current-unit-card {
  margin-bottom: 22.4px;
  padding: 30px;
  border-radius: 14px;
  background-color: #fff;
  text-align: center; 
  &__eyebrow {
    margin: 0 0 6.4px;
    color: #a0aec0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__title {
    margin: 0 0 11.2px;
    color: #de7534;
    font-size: 23.2px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  &__desc {
    max-width: 680px;
    margin: 0 auto;
    color: #4a5568;
    font-size: 14.72px;
    line-height: 1.6;
  }
}
</style>