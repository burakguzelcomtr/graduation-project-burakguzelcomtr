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
  h2 Your LearnPass Journey
  .lp-home-journey__steps
    .lp-home-journey__step(v-for="step in steps" :key="step.num")
      .lp-home-journey__step-num {{ step.num }}
      .lp-home-journey__step-icon {{ step.icon }}
      h4 {{ step.title }}
      p {{ step.desc }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-journey {
  padding: 4rem 2rem;
  text-align: center;
  background: #fff;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    color: $text-dark;
  }

  &__steps {
    display: flex;
    gap: 1.5rem;
    max-width: 960px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__step {
    flex: 1 1 200px;
    max-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;

    &-num {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: $primary;
      margin-bottom: 0.4rem;
    }

    &-icon {
      font-size: 2.2rem;
      margin-bottom: 0.6rem;
    }

    h4 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.4rem;
      color: $text-dark;
    }

    p {
      font-size: 0.85rem;
      line-height: 1.55;
      color: #666;
    }
  }
}
</style>
