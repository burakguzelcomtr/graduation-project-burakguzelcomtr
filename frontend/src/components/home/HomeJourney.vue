<script setup>
const steps = [
  { num: '01', icon: '📖', title: 'Learn', desc: 'Dive into curriculum-aligned lessons that blend language skills with global awareness topics.' },
  { num: '02', icon: '✏️', title: 'Practice', desc: 'Reinforce knowledge through quizzes, simulations, and interactive exercises.' },
  { num: '03', icon: '🤝', title: 'Collaborate', desc: 'Participate in group challenges that mirror real UN and diplomatic scenarios.' },
  { num: '04', icon: '🚀', title: 'Grow', desc: 'Track your progress and earn certificates as you advance through the LearnPass journey.' },
]
</script>

<template lang="pug">
section.lp-home-journey
  .container
    .row
      .col-12
        h2 Your LearnPass Journey
    .lp-home-journey__steps.row
      .lp-home-journey__col.col-12.col-sm-6.col-xl-3(v-for="step in steps" :key="step.num")
        .lp-home-journey__step
          .lp-home-journey__step-num {{ step.num }}
          .lp-home-journey__step-icon {{ step.icon }}
          h4 {{ step.title }}
          p {{ step.desc }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-journey {
  padding: 64px 32px;
  text-align: center;
  background: #fff;

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
    color: $text-dark;
  }

  &__steps {
    --bs-gutter-x: 24px;
    --bs-gutter-y: 24px;
    max-width: 960px;
    margin: 0 auto;
  }

  &__step {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;

    &-num {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: $primary;
      margin-bottom: 6.4px;
    }

    &-icon {
      font-size: 35.2px;
      margin-bottom: 9.6px;
    }

    h4 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6.4px;
      color: $text-dark;
    }

    p {
      font-size: 13.6px;
      line-height: 1.55;
      color: #666;
    }
  }
}
</style>
