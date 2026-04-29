<script setup>
</script>

<template lang="pug">
section.lp-home-why#why
  .lp-home-why__inner
    .lp-home-why__header
      span.lp-home-why__eyebrow Why LearnPass?
      h2 Education That
        span.lp-home-why__accent  Opens Doors
    .lp-home-why__cards
      .lp-home-why__card.lp-home-why__card--orange
        span.lp-home-why__card-arrow ↗
        .lp-home-why__card-icon 🎯
        h3 Mission-Driven
        p Every lesson is anchored to real-world global challenges — helping students connect classroom learning to the world they'll inherit.
      .lp-home-why__card.lp-home-why__card--blue
        span.lp-home-why__card-arrow ↗
        .lp-home-why__card-icon 🗣
        h3 Diplomatic English
        p Beyond grammar and vocabulary, students learn how to communicate, negotiate, and collaborate with confidence on the international stage.
      .lp-home-why__card.lp-home-why__card--green
        span.lp-home-why__card-arrow ↗
        .lp-home-why__card-icon 🌎
        h3 Citizen of the World
        p We nurture empathy, cultural awareness, and civic responsibility — preparing students to be thoughtful global citizens.
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-why {
  background: #fff9f4;
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

  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  &__card {
    position: relative;
    border-radius: 24px;
    padding: 36px 28px;
    overflow: hidden;

    &-arrow {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 20px;
      opacity: 0.4;
    }

    &-icon {
      font-size: 40px;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 23px;
      font-weight: 800;
      margin-bottom: 12px;
      color: $text-dark;
    }

    p {
      font-size: 16px;
      line-height: 1.65;
      color: #555;
    }

    &--orange { background: #fce8d5; }
    &--blue   { background: #d5eafc; }
    &--green  { background: #d5fce8; }
  }
}
</style>
