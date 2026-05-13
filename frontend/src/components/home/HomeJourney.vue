<script>
export default {
  name: 'HomeJourney',

  data() {
    return {
      steps: [
        { num: '01', icon: '📖', title: 'Learn', desc: 'Dive into curriculum-aligned lessons that blend language skills with global awareness topics.', color: '#fce8d5' },
        { num: '02', icon: '✏️', title: 'Practice', desc: 'Reinforce knowledge through quizzes, simulations, and interactive exercises.', color: '#d5eafc' },
        { num: '03', icon: '🤝', title: 'Collaborate', desc: 'Participate in group challenges that mirror real UN and diplomatic scenarios.', color: '#d5fce8' },
        { num: '04', icon: '🚀', title: 'Grow', desc: 'Track your progress and earn certificates as you advance through the LearnPass journey.', color: '#f5fcd5' },
      ],
    }
  },
}
</script>

<template lang="pug">
section.lp-home-journey#journey
  .lp-home-journey__inner
    .lp-home-journey__header
      span.lp-home-journey__eyebrow How It Works
      h2 Your LearnPass
        span.lp-home-journey__accent  Journey
    .lp-home-journey__steps
      .lp-home-journey__step(v-for="step in steps" :key="step.num" :style="{ background: step.color }")
        .lp-home-journey__step-top
          span.lp-home-journey__num {{ step.num }}
          span.lp-home-journey__icon {{ step.icon }}
        h4 {{ step.title }}
        p {{ step.desc }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-journey {
  background: #fff;
  padding: 80px 32px;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 48px;
  }

  &__eyebrow {
    display: inline-block;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: $primary;
    font-weight: 700;
    margin-bottom: 12px;
  }

  h2 {
    font-size: clamp(34px, 4.5vw, 52px);
    font-weight: 800;
    color: $text-dark;
  }

  &__accent {
    color: $primary;
  }

  &__steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  &__step {
    border-radius: 24px;
    padding: 32px 24px;

    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
  }

  &__num {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: $primary;
  }

  &__icon {
    font-size: 42px;
  }

  h4 {
    font-size: 21px;
    font-weight: 800;
    margin-bottom: 10px;
    color: $text-dark;
  }

  p {
    font-size: 16px;
    line-height: 1.65;
    color: #555;
  }
}
</style>
