<script setup>
defineProps({
  units: {
    type: Array,
    default: () => [],
  },
})
</script>

<template lang="pug">
.lp-lesson-units
  p.lp-lesson-units__empty(v-if="!units.length") No units have been added to this lesson yet.

  template(v-else)
    details.lp-lesson-units__item(
      v-for="(unit, unitIndex) in units"
      :key="unit._id ?? unitIndex"
      :open="unitIndex === 0"
    )
      summary.lp-lesson-units__summary
        .lp-lesson-units__summary-main
          span.lp-lesson-units__number {{ unit.order ?? (unitIndex + 1) }}
          div
            strong.lp-lesson-units__title {{ unit.title || 'Untitled Unit' }}
            p.lp-lesson-units__meta {{ unit.items?.length ?? 0 }} lesson items

      .lp-lesson-units__body
        p.lp-lesson-units__description {{ unit.description || 'No description has been added for this unit yet.' }}

        .lp-lesson-units__items(v-if="unit.items?.length")
          .lp-lesson-units__row(
            v-for="(item, itemIndex) in unit.items"
            :key="item.item?._id ?? item._id ?? itemIndex"
          )
            span.lp-lesson-units__row-number {{ item.order ?? (itemIndex + 1) }}
            div
              strong.lp-lesson-units__row-title {{ item.item?.title || item.title || ('Lesson item ' + (itemIndex + 1)) }}
              p.lp-lesson-units__row-type {{ (item.itemType || item.item?.type || 'topic').toUpperCase() }}

        p.lp-lesson-units__hint(v-else) Lesson items will appear here when they are ready.
</template>

<style lang="scss" scoped>
.lp-lesson-units {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__empty {
    margin: 0;
    padding: 1rem;
    border-radius: 14px;
    background: #fff7ed;
    color: #9a3412;
  }

  &__item {
    overflow: hidden;
    border: 1px solid #fed7aa;
    border-radius: 16px;
    background: #fff;
  }

  &__summary {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.1rem;
    cursor: pointer;
    list-style: none;
    background: #fff7ed;

    &::-webkit-details-marker {
      display: none;
    }
  }

  &__summary-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__number {
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #ea580c;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__title {
    color: #7c2d12;
    font-size: 0.95rem;
  }

  &__meta,
  &__description,
  &__row-type,
  &__hint {
    margin: 0;
    color: #6b7280;
    font-size: 0.8rem;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1rem 1.1rem 1.1rem;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 0.9rem;
    border: 1px solid #ffedd5;
    border-radius: 12px;
    background: #fffaf5;
  }

  &__row-number {
    display: flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #fdba74;
    color: #7c2d12;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__row-title {
    color: #431407;
    font-size: 0.9rem;
  }
}
</style>