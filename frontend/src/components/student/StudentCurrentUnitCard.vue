<script>
export default {
  name: 'StudentCurrentUnitCard',

  props: {
    currentLesson: {
      type: String,
      default: '—',
    },
    currentLessonDesc: {
      type: String,
      default: '',
    },
  },
}
</script>

<template lang="pug">
.lp-current-unit-card.border-gradient
  img.lp-current-unit-card__left_image(src="/assets/img/pencil_boy.webp" alt="" aria-hidden="true")
  p.lp-current-unit-card__eyebrow Your Current Unit
  h2.lp-current-unit-card__title {{ currentLesson.toUpperCase() }}
  p.lp-current-unit-card__desc {{ currentLessonDesc }}
  img.lp-current-unit-card__right_image(src="/assets/img/pencil_girl.webp" alt="" aria-hidden="true")
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *; 
.lp-current-unit-card {
  margin-bottom: 22.4px;
  padding: 30px;
  border-radius: 14px;
  background-color: #fff;
  text-align: center; 
  position: relative;
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
  &__left_image,
  &__right_image {
    position: absolute;
      animation: 2s linear 0s infinite alternate none running auto-move-side;
    transition: 0.3s linear;
    width: 90px;
    height: auto;
  }
  &__left_image {
    left: 20px;
    top: 20%; 
  }
  &__right_image {
    right: 20px;
    bottom: 20px;   
  }

  @keyframes auto-move-side {
    0% {
      transform: translateY(-50%) translateX(0);
    }
    100% {
      transform: translateY(-50%) translateX(10px);
    }
  }

  
}
</style>