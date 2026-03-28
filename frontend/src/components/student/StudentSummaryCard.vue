<script setup>
import { computed } from 'vue'
import GradeLabel from '@/components/GradeLabel.vue'

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  badgesEarned: {
    type: Number,
    default: 0,
  },
  totalUnits: {
    type: Number,
    default: 0,
  },
  completedUnits: {
    type: Number,
    default: 0,
  },
  courseProgress: {
    type: Number,
    default: 0,
  },
  continueRoute: {
    type: String,
    default: '/units',
  },
  continueLabel: {
    type: String,
    default: 'Continue Learning ›',
  },
})

const avatarText = computed(() => `${props.user?.name?.[0] ?? ''}${props.user?.surname?.[0] ?? ''}`)
</script>

<template lang="pug">
.lp-summary-card
  .lp-summary-card__profile
    .lp-summary-card__avatar {{ avatarText }}
    .lp-summary-card__name-wrap
      .lp-summary-card__name {{ user?.name }} {{ user?.surname }}
      .lp-summary-card__role Student
    .lp-summary-card__badges
      span.lp-summary-card__badges-num {{ badgesEarned }}
      span.lp-summary-card__badges-label BADGES

  .lp-summary-card__boxes
    .lp-summary-card__box
      .lp-summary-card__box-icon 📚
      .lp-summary-card__box-num {{ totalUnits }}
      .lp-summary-card__box-label TOTAL UNITS
    .lp-summary-card__box
      .lp-summary-card__box-icon 📋
      .lp-summary-card__box-num {{ completedUnits }}
      .lp-summary-card__box-label COMPLETED UNITS
    .lp-summary-card__box
      .lp-summary-card__box-icon 🏅
      .lp-summary-card__box-num {{ badgesEarned }}
      .lp-summary-card__box-label BADGES EARNED
    .lp-summary-card__box
      .lp-summary-card__box-icon ⭐
      .lp-summary-card__box-num {{ courseProgress }}%
      .lp-summary-card__box-label COURSE PROGRESS

  .lp-summary-card__grade
    h4.lp-summary-card__grade-title
      GradeLabel(:grade="user?.grade ?? user?.classGroup?.grade")
    .lp-summary-card__grade-card
      .lp-summary-card__grade-circle
        span.lp-summary-card__grade-percent {{ courseProgress }}%
      .lp-summary-card__grade-info
        .lp-summary-card__grade-bar-wrap
          .lp-summary-card__grade-bar-fill(:style="{ width: courseProgress + '%' }")
        .lp-summary-card__grade-meta
          span {{ completedUnits }} units completed
          span {{ totalUnits }} total units
      .lp-summary-card__grade-trophy 🏆
    router-link.lp-summary-card__continue(:to="continueRoute") {{ continueLabel }}
</template>

<style lang="scss" scoped>
.lp-summary-card {
  padding: 1.3rem 1.4rem;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);

  &__profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.2rem;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #de7534;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
  }

  &__name-wrap {
    flex: 1;
  }

  &__name {
    color: #2d3748;
    font-size: 1rem;
    font-weight: 700;
  }

  &__role {
    color: #a0aec0;
    font-size: 0.75rem;
  }

  &__badges {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #de7534;
  }

  &__badges-num {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1;
  }

  &__badges-label {
    color: #fff;
    font-size: 0.5rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  &__boxes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.2rem;
  }

  &__box {
    padding: 0.9rem 0.75rem;
    border: 1px solid #ffe0b2;
    border-radius: 10px;
    background: #fff3e0;
    text-align: center;
  }

  &__box-icon {
    margin-bottom: 0.3rem;
    font-size: 1.6rem;
  }

  &__box-num {
    color: #de7534;
    font-size: 1.4rem;
    font-weight: 800;
    line-height: 1;
  }

  &__box-label {
    margin-top: 0.2rem;
    color: #de7534;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__grade-title {
    margin: 0 0 0.7rem;
    color: #de7534;
    font-size: 1rem;
    font-weight: 700;
  }

  &__grade-card {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-bottom: 1rem;
    padding: 0.9rem 1rem;
    border: 1px solid #ffe0b2;
    border-radius: 10px;
    background: #fff3e0;
  }

  &__grade-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #de7534;
  }

  &__grade-percent {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 800;
  }

  &__grade-info {
    flex: 1;
  }

  &__grade-bar-wrap {
    overflow: hidden;
    height: 8px;
    margin-bottom: 0.4rem;
    border-radius: 99px;
    background: #ffd9b0;
  }

  &__grade-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: #de7534;
    transition: width 0.4s;
  }

  &__grade-meta {
    display: flex;
    justify-content: space-between;
    color: #a0aec0;
    font-size: 0.7rem;
  }

  &__grade-trophy {
    flex-shrink: 0;
    font-size: 1.6rem;
  }

  &__continue {
    display: block;
    width: 100%;
    padding: 0.7rem;
    border-radius: 8px;
    background: #1a202c;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    transition: background 0.15s;

    &:hover {
      background: #2d3748;
    }
  }
}
</style>