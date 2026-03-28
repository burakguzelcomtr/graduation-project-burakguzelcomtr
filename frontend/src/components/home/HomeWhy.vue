<script setup>
</script>

<template lang="pug">
section.lp-home-why
  p.lp-home-why__label Why LearnPass?
  h2 Education That Opens Doors
  .lp-home-why__cards
    .lp-home-why__card
      .lp-home-why__icon 🎯
      h3 Mission-Driven
      p Every lesson is anchored to real-world global challenges — helping students connect classroom learning to the world they'll inherit.
    .lp-home-why__card
      .lp-home-why__icon 🗣
      h3 Diplomatic English
      p Beyond grammar and vocabulary, students learn how to communicate, negotiate, and collaborate with confidence on the international stage.
    .lp-home-why__card
      .lp-home-why__icon 🌎
      h3 Citizen of the World
      p We nurture empathy, cultural awareness, and civic responsibility — preparing students to be thoughtful global citizens.
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-why {
  background: $primary;
  color: #fff;
  text-align: center;
  padding: 4rem 2rem;

  &__label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
  }

  &__cards {
    display: flex;
    gap: 1.5rem;
    max-width: 960px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__card {
    background: rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    padding: 2rem 1.5rem;
    flex: 1 1 260px;
    max-width: 300px;
    text-align: left;

    .lp-home-why__icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.9rem;
      line-height: 1.6;
      opacity: 0.9;
    }
  }
}
</style>
