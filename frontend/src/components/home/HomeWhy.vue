<script setup>
</script>

<template lang="pug">
section.lp-home-why
  .container
    .row
      .col-12
        p.lp-home-why__label Why LearnPass?
        h2 Education That Opens Doors
    .lp-home-why__cards.row
      .lp-home-why__col.col-12.col-md-6.col-xl-4
        .lp-home-why__card
          .lp-home-why__icon 🎯
          h3 Mission-Driven
          p Every lesson is anchored to real-world global challenges — helping students connect classroom learning to the world they'll inherit.
      .lp-home-why__col.col-12.col-md-6.col-xl-4
        .lp-home-why__card
          .lp-home-why__icon 🗣
          h3 Diplomatic English
          p Beyond grammar and vocabulary, students learn how to communicate, negotiate, and collaborate with confidence on the international stage.
      .lp-home-why__col.col-12.col-md-6.col-xl-4
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
  padding: 64px 32px;

  &__label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    opacity: 0.8;
    margin-bottom: 8px;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
  }

  &__cards {
    --bs-gutter-x: 24px;
    --bs-gutter-y: 24px;
    max-width: 960px;
    margin: 0 auto;
  }

  &__card {
    height: 100%;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    padding: 32px 24px;
    text-align: left;

    .lp-home-why__icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    h3 {
      font-size: 17.6px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    p {
      font-size: 14.4px;
      line-height: 1.6;
      opacity: 0.9;
    }
  }
}
</style>
