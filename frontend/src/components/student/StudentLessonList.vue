<script setup>
defineProps({
  lessonCards: {
    type: Array,
    default: () => [],
  },
})

// Helpers to support both the previously-mapped shape and the raw API lesson/unit objects
function lessonTitle(lesson) {
  return lesson.title ?? lesson.name ?? 'Untitled Lesson'
}

function lessonUnitCount(lesson) {
  return (lesson.units ?? []).length
}

function getUnitId(unit, lesson, unitIndex) {
  return unit._id ?? unit.id ?? `${lesson._id ?? lesson.id ?? lesson.title ?? 'lesson'}-${unitIndex}`
}

function getUnitName(unit) {
  return unit.title ?? unit.name ?? 'Untitled Unit'
}

function getUnitNum(unit, unitIndex) {
  return unit.num ?? unit.order ?? (unitIndex + 1)
}

function getUnitStatus(unit) {
  if (!unit) return 'not_started'
  if (typeof unit.status === 'string') return unit.status
  if (unit.completed === true) return 'completed'
  if (unit.progress && unit.progress.completed) return 'completed'
  return 'not_started'
}

function getUnitStatusModifier(unit) {
  return getUnitStatus(unit).replaceAll('_', '-')
}

function getUnitActionModifier(unit) {
  return getUnitStatus(unit) === 'completed' ? 'review' : 'start'
}
</script>

<template lang="pug">
.lp-lesson-list
  .lp-lesson-list__card(
    v-for="(lesson, lessonIndex) in lessonCards"
    :key="lesson._id ?? lesson.id ?? `lesson-${lessonIndex}`"
  )
    .lp-lesson-list__header
      h3.lp-lesson-list__title {{ lessonTitle(lesson) }}
      span.lp-lesson-list__count {{ lessonUnitCount(lesson) }} units
    p.lp-lesson-list__empty(v-if="!(lesson.units && lesson.units.length)") No units found in this lesson.
    .lp-lesson-list__items(v-else)
      .lp-lesson-list__item(
        v-for="(unit, unitIndex) in lesson.units"
        :key="getUnitId(unit, lesson, unitIndex)"
        :class="`lp-lesson-list__item--${getUnitStatusModifier(unit)}`"
      )
        .lp-lesson-list__num {{ getUnitNum(unit, unitIndex) }}
        .lp-lesson-list__info
          .lp-lesson-list__name {{ getUnitName(unit) }}
          .lp-lesson-list__meta
            span.lp-lesson-list__status(:class="`lp-lesson-list__status--${getUnitStatusModifier(unit)}`") {{ getUnitStatus(unit) === 'completed' ? '✔ Completed' : '⬛ Not Started' }}
        button.lp-lesson-list__action(:class="`lp-lesson-list__action--${getUnitActionModifier(unit)}`") {{ getUnitStatus(unit) === 'completed' ? 'Review' : 'Start' }}
</template>

<style lang="scss" scoped>
.lp-lesson-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__card {
    padding: 1.3rem 1.4rem;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__title {
    margin: 0;
    color: #de7534;
    font-size: 1.05rem;
    font-weight: 700;
  }

  &__count {
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    background: #de7534;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
  }

  &__empty {
    margin: 0;
    color: #718096;
    font-size: 0.85rem;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;

    &--completed {
      border: 1px solid #bbf7d0;
      background: #f0fdf4;

      .lp-lesson-list__num {
        background: #22c55e;
      }
    }

    &--not-started {
      border: 1px solid #ffe0b2;
      background: #fff8ee;
    }
  }

  &__num {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #de7534;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
  }

  &__info {
    min-width: 0;
    flex: 1;
  }

  &__name {
    color: #2d3748;
    font-size: 0.9rem;
    font-weight: 700;
  }

  &__sub {
    margin-top: 0.05rem;
    overflow: hidden;
    color: #a0aec0;
    font-size: 0.72rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__meta {
    margin-top: 0.1rem;
  }

  &__status {
    font-size: 0.68rem;
    font-weight: 600;

    &--completed {
      color: #16a34a;
    }

    &--not-started {
      color: #de7534;
    }
  }

  &__action {
    flex-shrink: 0;
    padding: 0.35rem 0.9rem;
    border: none;
    border-radius: 7px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;

    &--review {
      background: #22c55e;
      color: #fff;

      &:hover {
        background: #16a34a;
      }
    }

    &--start {
      background: #de7534;
      color: #fff;

      &:hover {
        background: #c05c1a;
      }
    }
  }
}
</style>