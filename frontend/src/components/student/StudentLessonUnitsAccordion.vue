<script setup>
import { useRouter } from 'vue-router'
import { displayOrder, numberBulletSrc } from '@/utils/numberBullet'

const props = defineProps({
  units: {
    type: Array,
    default: () => [],
  },
  lessonSlug: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function navigateToUnit(unit) {
  const uSlug = unit.slug || unit._id
  if (!props.lessonSlug || !uSlug) return
  router.push({ name: 'unit-detail', params: { lessonSlug: props.lessonSlug, unitSlug: uSlug } })
}
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
      summary.lp-lesson-units__summary(:class="{ 'lp-lesson-units__summary--linkable': lessonSlug && (unit.slug || unit._id) }" @click.prevent="lessonSlug ? navigateToUnit(unit) : undefined")
        .lp-lesson-units__summary-main.row
          .col-auto
            img.lp-lesson-units__number-bullet(
              v-if="numberBulletSrc(unit.order, unitIndex)"
              :src="numberBulletSrc(unit.order, unitIndex)"
              alt=""
              aria-hidden="true"
            )
            span.lp-lesson-units__number(v-else) {{ displayOrder(unit.order, unitIndex) }}
          .col
            div
              strong.lp-lesson-units__title {{ unit.title || 'Untitled Unit' }}
              p.lp-lesson-units__meta {{ unit.items?.length ?? 0 }} lesson items

      .lp-lesson-units__body
        p.lp-lesson-units__description {{ unit.description || '' }}

        .lp-lesson-units__items(v-if="unit.items?.length")
          .lp-lesson-units__row.row(
            v-for="(item, itemIndex) in unit.items"
            :key="item.item?._id ?? item._id ?? itemIndex"
          )
            .col-auto
              img.lp-lesson-units__row-bullet(
                v-if="numberBulletSrc(item.order, itemIndex)"
                :src="numberBulletSrc(item.order, itemIndex)"
                alt=""
                aria-hidden="true"
              )
              span.lp-lesson-units__row-number(v-else) {{ displayOrder(item.order, itemIndex) }}
            .col
              div
                strong.lp-lesson-units__row-title {{ item.item?.title || item.title || ('Lesson item ' + (itemIndex + 1)) }}
                p.lp-lesson-units__row-type {{ (item.itemType || item.item?.type || 'topic').toUpperCase() }}

        p.lp-lesson-units__hint(v-else) Lesson items will appear here when they are ready.
</template>

<style lang="scss" scoped>
.lp-lesson-units {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__empty {
    margin: 0;
    padding: 16px;
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
    gap: 12px;
    padding: 16px 17.6px;
    cursor: pointer;
    list-style: none;
    background: #fff7ed;

    &::-webkit-details-marker {
      display: none;
    }

    &--linkable:hover {
      background: #fed7aa;
    }
  }

  &__summary-main {
    align-items: center;
    --bs-gutter-x: 12px;
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
    font-size: 13.6px;
    font-weight: 700;
  }

  &__number-bullet {
    display: block;
    width: 36px;
    height: 52px;
    object-fit: contain;
  }

  &__title {
    color: #7c2d12;
    font-size: 15.2px;
  }

  &__meta,
  &__description,
  &__row-type,
  &__hint {
    margin: 0;
    color: #6b7280;
    font-size: 12.8px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 14.4px;
    padding: 16px 17.6px 17.6px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10.4px;
  }

  &__row {
    align-items: center;
    --bs-gutter-x: 12px;
    padding: 12.8px 14.4px;
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
    font-size: 12.8px;
    font-weight: 700;
  }

  &__row-bullet {
    display: block;
    width: 36px;
    height: 52px;
    object-fit: contain;
  }

  &__row-title {
    color: #431407;
    font-size: 14.4px;
  }
}
</style>