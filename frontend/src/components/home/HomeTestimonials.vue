<script>
export default {
  name: 'HomeTestimonials',

  data() {
    return {
      testimonials: [
        {
          quote: 'My students started talking about the UN and world issues after just a few weeks! LearnPass completely changed how they engage with English.',
          name: 'Ms. Ayşe Kaya',
          role: 'Primary English Teacher, Istanbul',
          initials: 'AK',
          stars: 5,
        },
        {
          quote: 'I never thought English could feel so relevant. Now I want to learn more because I understand why it matters for the real world.',
          name: 'Mert, Age 11',
          role: 'LearnPass Student, Ankara',
          initials: 'M',
          stars: 5,
        },
        {
          quote: 'The curriculum is brilliant. It connects language learning with global citizenship in a way I have never seen before.',
          name: 'Mr. James O\'Brien',
          role: 'IB Curriculum Coordinator, London',
          initials: 'JO',
          stars: 5,
        },
      ],
    }
  },
}
</script>

<template lang="pug">
section.lp-home-testimonials#testimonials
  .lp-home-testimonials__inner
    .lp-home-testimonials__header
      span.lp-home-testimonials__eyebrow What People Are Saying
      h2 What
        span.lp-home-testimonials__accent  Lovely
        |  Teachers &amp;
        br
        | Students Are Saying
    .lp-home-testimonials__grid
      .lp-home-testimonials__card(v-for="t in testimonials" :key="t.name")
        .lp-home-testimonials__stars
          span(v-for="i in t.stars" :key="i") ★
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
    line-height: 1.2;
  }

  &__accent {
    color: $primary !important;
    font-style: italic; 
    font-size: inherit !important;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  &__card {
    background: #fff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  }

  &__stars {
    color: #f5a623;
    font-size: 18px;
    margin-bottom: 14px;
    letter-spacing: 2px;
  }

  &__quote {
    font-size: 16px;
    line-height: 1.75;
    color: #555;
    margin-bottom: 20px;
    font-style: italic;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $primary;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
  }

  strong {
    display: block;
    color: $text-dark;
    font-size: 16px;
    font-weight: 700;
  }

  span {
    color: #999;
    font-size: 13px;
  }
}
</style>
