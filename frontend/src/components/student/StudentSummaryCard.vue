<script>
import GradeLabel from '@/components/GradeLabel.vue'
import IconUnits from '../icons/IconUnits.vue'
import IconBook from '../icons/IconBook.vue'
import IconBadge from '../icons/IconBadge.vue'

export default {
  name: 'StudentSummaryCard',

  components: {
    GradeLabel,
    IconUnits,
    IconBook,
    IconBadge,
  },

  props: {
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
  },

  computed: {
    avatarText() {
      return `${this.user?.name?.[0] ?? ''}${this.user?.surname?.[0] ?? ''}`
    },
  },
}
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

  .lp-summary-card__boxes.row
    .lp-summary-card__box-col.col-6
      .lp-summary-card__box
        .lp-summary-card__box-icon
          IconUnits
        .lp-summary-card__box-num {{ totalUnits }}
        .lp-summary-card__box-label TOTAL UNITS
    .lp-summary-card__box-col.col-6
      .lp-summary-card__box
        .lp-summary-card__box-icon
          IconBook
        .lp-summary-card__box-num {{ completedUnits }}
        .lp-summary-card__box-label COMPLETED UNITS
    .lp-summary-card__box-col.col-6
      .lp-summary-card__box
        .lp-summary-card__box-icon
          IconBadge
        .lp-summary-card__box-num {{ badgesEarned }}
        .lp-summary-card__box-label BADGES EARNED
    .lp-summary-card__box-col.col-6
      .lp-summary-card__box
        .lp-summary-card__box-icon
          IconBadge
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
    router-link.lp-summary-card__continue.btn(:to="continueRoute") {{ continueLabel }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-summary-card {
  padding: 20.8px 22.4px;
  border-radius: 14px;
  background: $bg-card;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);

  &__profile {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 19.2px;
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
    font-size: 16px;
    font-weight: 700;
  }

  &__name-wrap {
    flex: 1;
  }

  &__name {
    color: #2d3748;
    font-size: 16px;
    font-weight: 700;
  }

  &__role {
    color: #a0aec0;
    font-size: 12px;
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
    font-size: 17.6px;
    font-weight: 800;
    line-height: 1;
  }

  &__badges-label {
    color: #fff;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  &__boxes {
    --bs-gutter-x: 12px;
    --bs-gutter-y: 12px;
    margin-bottom: 19.2px;
  }

  &__box {
    height: 100%;
    padding: 14.4px 12px;
    border: 1px dashed #ffe0b2;
    border-radius: 10px;
    background: $bg-yellow;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  &__box-icon { 
    svg {
      
    width: 64px;
    height: 64px;
    }
  }

  &__box-num {
    color: $text-dark;
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
  }

  &__box-label { 
    color: $primary;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &__grade-title {
    margin: 0 0 11.2px;
    color: $primary;
    font-size: 16px;
    font-weight: 700;
  }

  &__grade-card {
    display: flex;
    align-items: center;
    gap: 14.4px;
    margin-bottom: 16px;
    padding: 14.4px 16px;
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
    font-size: 14.4px;
    font-weight: 800;
  }

  &__grade-info {
    flex: 1;
  }

  &__grade-bar-wrap {
    overflow: hidden;
    height: 8px;
    margin-bottom: 6.4px;
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
    font-size: 11.2px;
  }

  &__grade-trophy {
    flex-shrink: 0;
    font-size: 25.6px;
  }

  &__continue {
    display: block;
    width: 100%;
    padding: 11.2px;
    background: #1a202c;
    border-color: #1a202c;
    color: #fff;
    font-size: 15.2px;
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