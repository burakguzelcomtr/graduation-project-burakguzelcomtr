<script setup>
const testimonials = [
  {
    quote: 'My students started talking about the UN and world issues after just a few weeks! LearnPass completely changed how they engage with English.',
    name: 'Ms. Ayşe Kaya',
    role: 'Primary English Teacher, Istanbul',
    initials: 'AK',
  },
  {
    quote: 'I never thought English could feel so relevant. Now I want to learn more because I understand why it matters for the real world.',
    name: 'Mert, Age 11',
    role: 'LearnPass Student, Ankara',
    initials: 'M',
  },
]
</script>

<template lang="pug">
section.lp-home-testimonials
  .container
    .row
      .col-12
        h2 What People Are Saying
    .lp-home-testimonials__grid.row
      .lp-home-testimonials__col.col-12.col-lg-6(v-for="t in testimonials" :key="t.name")
        .lp-home-testimonials__card
          p.lp-home-testimonials__quote "{{ t.quote }}"
          .lp-home-testimonials__author
            .lp-home-testimonials__avatar {{ t.initials }}
            div
              strong {{ t.name }}
              span {{ t.role }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-testimonials {
  background: #f3ede6;
  padding: 64px 32px;
  text-align: center;

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 40px;
    color: $text-dark;
  }

  &__grid {
    --bs-gutter-x: 24px;
    --bs-gutter-y: 24px;
    max-width: 860px;
    margin: 0 auto;
  }

  &__card {
    height: 100%;
    padding: 32px;
    border-radius: 12px;
    background: #fff;
    text-align: left;
  }

  &__quote {
    font-style: italic;
    font-size: 15.2px;
    line-height: 1.65;
    color: #444;
    margin-bottom: 19.2px;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $primary;
    color: #fff;
    font-size: 14.4px;
    font-weight: 700;
  }

  strong {
    display: block;
    color: $text-dark;
    font-size: 14.4px;
  }

  span {
    color: #888;
    font-size: 12.48px;
  }
}
</style>
