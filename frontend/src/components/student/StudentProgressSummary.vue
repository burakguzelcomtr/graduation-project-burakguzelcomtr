<script>
export default {
  name: 'StudentProgressSummary',

  props: {
    currentLesson: {
      type: String,
      default: '—',
    },
    courseProgress: {
      type: Number,
      default: 0,
    },
    badgesEarned: {
      type: Number,
      default: 0,
    },
    completedUnits: {
      type: Number,
      default: 0,
    },
    totalUnits: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<template lang="pug">
.lp-progress-summary
  .lp-progress-summary__top.row
    .col
      p.lp-progress-summary__label YOUR LEARNING PROGRESS
      p.lp-progress-summary__lesson {{ currentLesson }}
    .col-auto
      span.lp-progress-summary__percent-badge {{ courseProgress }}%
  .lp-progress-summary__bar
    .lp-progress-summary__fill(:style="{ width: courseProgress + '%' }")
    span.lp-progress-summary__percent {{ courseProgress }}%
  .lp-progress-summary__footer.row
    .col-12.col-sm-auto
      span.lp-progress-summary__badge {{ badgesEarned }} BADGES
    .col-12.col-sm
      span.lp-progress-summary__units {{ completedUnits }} out of {{ totalUnits }} Units completed
</template>

<style lang="scss" scoped>
.lp-progress-summary {
  min-width: 230px;
  max-width: 280px;
  padding: 14.4px 16px;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  background: #fff7ed;

  &__top {
    align-items: start;
    --bs-gutter-x: 12px;
    margin-bottom: 4px;
  }

  &__label {
    margin: 0 0 4px;
    color: #9ca3af;
    font-size: 9.92px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__lesson {
    margin: 0 0 8px;
    overflow: hidden;
    color: #1f2937;
    font-size: 13.12px;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__bar {
    position: relative;
    overflow: hidden;
    height: 8px;
    margin-bottom: 8.8px;
    border-radius: 999px;
    background: #e5e7eb;
  }

  &__fill {
    height: 100%;
    border-radius: 999px;
    background: #de7534;
    transition: width 0.4s;
  }

  &__percent {
    position: absolute;
    top: -14px;
    right: 4px;
    color: #de7534;
    font-size: 10.88px;
    font-weight: 700;
  }

  &__percent-badge {
    display: inline-block;
    padding: 4px 8.8px;
    border-radius: 999px;
    background: #de7534;
    color: #fff;
    font-size: 10.88px;
    font-weight: 700;
  }

  &__footer {
    align-items: center;
    --bs-gutter-x: 8px;
    --bs-gutter-y: 5.6px;
  }

  &__badge {
    padding: 3.2px 8px;
    border-radius: 6px;
    background: #de7534;
    color: #fff;
    font-size: 10.4px;
    font-weight: 700;
  }

  &__units {
    color: #6b7280;
    font-size: 11.2px;
  }
}

@media (max-width: 900px) {
  .lp-progress-summary {
    width: 100%;
    min-width: unset;
    max-width: 100%;

    &__percent {
      display: none;
    }
  }
}
</style>