<script setup>
defineProps({
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
})
</script>

<template lang="pug">
.lp-progress-summary
  p.lp-progress-summary__label YOUR LEARNING PROGRESS
  p.lp-progress-summary__lesson {{ currentLesson }}
  .lp-progress-summary__bar
    .lp-progress-summary__fill(:style="{ width: courseProgress + '%' }")
    span.lp-progress-summary__percent {{ courseProgress }}%
  .lp-progress-summary__footer
    span.lp-progress-summary__badge {{ badgesEarned }} BADGES
    span.lp-progress-summary__units {{ completedUnits }} out of {{ totalUnits }} Units completed
</template>

<style lang="scss" scoped>
.lp-progress-summary {
  min-width: 230px;
  max-width: 280px;
  padding: 0.9rem 1rem;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  background: #fff7ed;

  &__label {
    margin: 0 0 0.25rem;
    color: #9ca3af;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__lesson {
    margin: 0 0 0.5rem;
    overflow: hidden;
    color: #1f2937;
    font-size: 0.82rem;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__bar {
    position: relative;
    overflow: hidden;
    height: 8px;
    margin-bottom: 0.55rem;
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
    font-size: 0.68rem;
    font-weight: 700;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__badge {
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    background: #de7534;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
  }

  &__units {
    color: #6b7280;
    font-size: 0.7rem;
  }
}

@media (max-width: 900px) {
  .lp-progress-summary {
    width: 100%;
    min-width: unset;
    max-width: 100%;
  }
}
</style>