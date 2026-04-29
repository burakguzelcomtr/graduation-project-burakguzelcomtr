<script setup>
defineProps({
  loggedIn: { type: Boolean, default: false },
})
defineEmits(['loginClick'])
</script>

<template lang="pug">
section.lp-home-hero
  .lp-home-hero__inner
    .lp-home-hero__left
      .lp-home-hero__badge 🌍 &nbsp; Global English Education
      h1.lp-home-hero__title
        | Your Passport to
        br
        span.lp-home-hero__title--accent a Better World.
      p.lp-home-hero__desc Through engaging tasks and unique English diplomacy courses, LearnPass teaches primary students to find their voice, solve global issues, and build a brighter future.
      .lp-home-hero__meta
        .lp-home-hero__stat
          strong 2,000+
          span Students Enrolled
        .lp-home-hero__stat
          strong 50+
          span Lessons & Units
        .lp-home-hero__stat
          strong 🏫
          span School-Ready
      button.lp-home-hero__button.btn(type="button" @click="$emit('loginClick')") {{ loggedIn ? 'Go to Dashboard' : 'Start Learning' }} →
    .lp-home-hero__right
      .lp-home-hero__photo-grid
        .lp-home-hero__photo.lp-home-hero__photo--1
          span 📖
        .lp-home-hero__photo.lp-home-hero__photo--2
          span 🗣
        .lp-home-hero__photo.lp-home-hero__photo--3
          span 🌎
        .lp-home-hero__photo.lp-home-hero__photo--4
          span 🎓
        .lp-home-hero__photo.lp-home-hero__photo--5
          span 🤝
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-hero {
  background: #fff9f4;
  padding-top: 64px; // navbar height
  min-height: 90vh;
  display: flex;
  align-items: center;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 32px;
    display: flex;
    align-items: center;
    gap: 64px;

    @media (max-width: 900px) {
      flex-direction: column;
      text-align: center;
    }
  }

  &__left {
    flex: 1;
  }

  &__badge {
    display: inline-block;
    background: #fff2e0;
    color: $primary;
    border-radius: 24px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &__title {
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 800;
    line-height: 1.15;
    color: $text-dark;
    margin-bottom: 20px;

    &--accent {
      color: $primary;
    }
  }

  &__desc {
    font-size: 17px;
    color: #555;
    line-height: 1.65;
    margin-bottom: 32px;
    max-width: 500px;
  }

  &__meta {
    display: flex;
    gap: 32px;
    margin-bottom: 36px;
    flex-wrap: wrap;
  }

  &__stat {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 22px;
      font-weight: 800;
      color: $text-dark;
    }

    span {
      font-size: 12px;
      color: #888;
      font-weight: 500;
    }
  }

  &__button {
    background: $primary;
    color: #fff;
    border: none;
    padding: 14px 36px;
    border-radius: 32px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    box-shadow: 0 6px 20px rgba($primary, 0.35);

    &:hover {
      background: $primary-dark;
      transform: translateY(-2px);
      color: #fff;
    }
  }

  &__right {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  &__photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 130px);
    grid-template-rows: repeat(2, 130px);
    gap: 12px;
  }

  &__photo {
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;

    &--1 { background: #fce8d5; grid-column: 1; grid-row: 1; }
    &--2 { background: #d5eafc; grid-column: 2; grid-row: 1; border-radius: 50%; }
    &--3 { background: #d5fce8; grid-column: 3; grid-row: 1; }
    &--4 { background: #fcd5d5; grid-column: 1; grid-row: 2; }
    &--5 { background: #f5fcd5; grid-column: 2 / span 2; grid-row: 2; border-radius: 20px; font-size: 56px; }
  }
}
</style>
