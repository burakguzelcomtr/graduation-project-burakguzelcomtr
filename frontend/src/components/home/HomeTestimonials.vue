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
  h2 What People Are Saying
  .lp-home-testimonials__grid
    .lp-home-testimonials__card(v-for="t in testimonials" :key="t.name")
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
  padding: 4rem 2rem;
  text-align: center;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2.5rem;
    color: $text-dark;
  }

  &__grid {
    display: flex;
    gap: 1.5rem;
    max-width: 860px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__card {
    max-width: 400px;
    flex: 1 1 340px;
    padding: 2rem;
    border-radius: 12px;
    background: #fff;
    text-align: left;
  }

  &__quote {
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.65;
    color: #444;
    margin-bottom: 1.2rem;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
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
    font-size: 0.9rem;
    font-weight: 700;
  }

  strong {
    display: block;
    color: $text-dark;
    font-size: 0.9rem;
  }

  span {
    color: #888;
    font-size: 0.78rem;
  }
}
</style>
