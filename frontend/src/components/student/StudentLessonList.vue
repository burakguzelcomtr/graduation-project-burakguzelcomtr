<script setup>
defineProps({
  lessonCards: {
    type: Array,
    default: () => [],
  },
  lessonRouteName: {
    type: String,
    default: '',
  },
})

// Helpers to support both the previously-mapped shape and the raw API lesson/unit objects
function lessonTitle(lesson) {
  return lesson.title ?? lesson.name ?? 'Untitled Lesson'
}

function lessonUnitCount(lesson) {
  return (lesson.units ?? []).length
}

function getLessonId(lesson, lessonIndex) {
  return lesson._id ?? `lesson-${lessonIndex}`
}

function getUnitId(unit, lesson, unitIndex) {
  return unit._id ?? `${lesson._id ?? 'lesson'}-${unitIndex}`
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
    :key="lesson._id ?? `lesson-${lessonIndex}`"
  )
    .lp-lesson-list__header.row
      .lp-lesson-list__header-main.col-12.col-md
        router-link.lp-lesson-list__title.lp-lesson-list__title--link(
          v-if="lessonRouteName"
          :to="{ name: lessonRouteName, params: { lessonId: getLessonId(lesson, lessonIndex) } }"
        ) {{ lessonTitle(lesson) }}
        h3.lp-lesson-list__title(v-else) {{ lessonTitle(lesson) }}
      .lp-lesson-list__header-side.col-12.col-md-auto
        span.lp-lesson-list__count {{ lessonUnitCount(lesson) }} units
    p.lp-lesson-list__empty(v-if="!(lesson.units && lesson.units.length)") No units found in this lesson.
    .lp-lesson-list__items(v-else)
      .lp-lesson-list__item(
        v-for="(unit, unitIndex) in lesson.units"
        :key="getUnitId(unit, lesson, unitIndex)"
        :class="`lp-lesson-list__item--${getUnitStatusModifier(unit)}`"
      )
        .row
          .lp-lesson-list__num-col.col-auto
            .lp-lesson-list__num {{ getUnitNum(unit, unitIndex) }}
          .lp-lesson-list__info.col-12.col-md
            .lp-lesson-list__name {{ getUnitName(unit) }}
            .lp-lesson-list__meta
              span.lp-lesson-list__status(:class="`lp-lesson-list__status--${getUnitStatusModifier(unit)}`") {{ getUnitStatus(unit) === 'completed' ? '✔ Completed' : '⬛ Not Started' }}
          .lp-lesson-list__action-col.col-12.col-md-auto
            button.lp-lesson-list__action.btn(:class="`lp-lesson-list__action--${getUnitActionModifier(unit)}`" type="button") {{ getUnitStatus(unit) === 'completed' ? 'Review' : 'Start' }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
.lp-lesson-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  &__card {
    padding: 15px;
    border-radius: 14px;
  background-color: $bg-card;
    
  }

  &__header {
    align-items: center; 
    margin-bottom: 16px;
  }

  &__header-side {
    @media (min-width: 768px) {
      display: flex;
      justify-content: flex-end;
    }
  }

  &__title {
    margin: 0;
    color: #de7534;
    font-size: 16.8px;
    font-weight: 700;

    &--link {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__count {
    padding: 3.2px 9.6px;
    border-radius: 6px;
    background: #de7534;
    color: #fff;
    font-size: 11.2px;
    font-weight: 700;
  }

  &__empty {
    margin: 0;
    color: #718096;
    font-size: 13.6px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    align-items: center; 
    padding: 8px;
    border-radius: 10px;
    background: $bg-yellow;
    &--completed {
      border: 1px solid #bbf7d0;
      background: #f0fdf4;

      .lp-lesson-list__num {
        background: #22c55e;
      }
    }

    &--not-started {
      border: 1px solid #ffe0b2;
      background: $bg-yellow;
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
    font-size: 12.48px;
    font-weight: 800;
  }

  &__info {
    min-width: 0;
  }

  &__name {
    color: #2d3748;
    font-size: 14.4px;
    font-weight: 700;
  }

  &__sub {
    margin-top: 0.8px;
    overflow: hidden;
    color: #a0aec0;
    font-size: 11.52px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__meta {
    margin-top: 1.6px;
  }

  &__status {
    font-size: 10.88px;
    font-weight: 600;

    &--completed {
      color: #16a34a;
    }

    &--not-started {
      color: #de7534;
    }
  }

  &__action {
    width: 100%;
    padding: 5.6px 14.4px;
    border-radius: 7px;
    font-size: 13.12px;
    font-weight: 700;
    text-align: center;

    &--review {
      background: #22c55e;
      border-color: #22c55e;
      color: #fff;

      &:hover {
        background: #16a34a;
        border-color: #16a34a;
      }
    }

    &--start {
      background: #de7534;
      border-color: #de7534;
      color: #fff;

      &:hover {
        background: #c05c1a;
        border-color: #c05c1a;
      }
    }
  }

  &__action-col {
    @media (min-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>