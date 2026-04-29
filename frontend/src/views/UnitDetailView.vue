<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useLessonsStore } from '@/stores/lessons'

const route = useRoute()
const router = useRouter()
const lessonsStore = useLessonsStore()
const loading = ref(false)
const errorMessage = ref('')
const unit = ref(null)

const lessonSlug = computed(() => route.params.lessonSlug ?? '')
const unitSlug = computed(() => route.params.unitSlug ?? '')

watch(
  [lessonSlug, unitSlug],
  async ([lSlug, uSlug]) => {
    if (!lSlug || !uSlug) {
      unit.value = null
      return
    }

    unit.value = null
    loading.value = true
    errorMessage.value = ''

    try {
      unit.value = await lessonsStore.getUnitBySlug(lSlug, uSlug)
    } catch (error) {
      errorMessage.value = error.response?.data?.error ?? 'Unit could not be loaded.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

function materialRoute(item) {
  const id = item.item?._id ?? item._id
  if (!id) return null
  return {
    name: 'material-detail',
    params: { lessonSlug: lessonSlug.value, unitSlug: unitSlug.value, materialId: id },
  }
}

function materialType(item) {
  return item.item?.type ?? item.type ?? 'topic'
}
</script>

<template lang="pug">
section.lp-unit-detail.container-fluid
  .lp-unit-detail__loading(v-if="loading")
    span Loading unit...

  .lp-unit-detail__error(v-else-if="errorMessage")
    p {{ errorMessage }}

  .lp-unit-detail__empty(v-else-if="!unit")
    p Unit not found.

  template(v-else)
    PageHeader(:title="unit.title ?? 'Unit'" :show-decoration="false")

    .lp-unit-detail__content.row
      .col-12
        section.lp-unit-detail__section
          h2.lp-unit-detail__heading Description
          p.lp-unit-detail__description {{ unit.description || 'No description has been added for this unit yet.' }}

      .col-12(v-if="unit.items?.length")
        section.lp-unit-detail__section
          .lp-unit-detail__section-head
            h2.lp-unit-detail__heading Lesson Items
            span.lp-unit-detail__count {{ unit.items.length }} items

          .lp-unit-detail__items
            router-link.lp-unit-detail__item.row(
              v-for="(item, index) in unit.items"
              :key="item.item?._id ?? item._id ?? index"
              :to="materialRoute(item)"
              :class="`lp-unit-detail__item--${materialType(item)}`"
            )
              .col-auto
                span.lp-unit-detail__num {{ item.order ?? (index + 1) }}
              .col
                strong.lp-unit-detail__item-title {{ item.item?.title || item.title || ('Lesson item ' + (index + 1)) }}
                p.lp-unit-detail__item-type(:class="`lp-unit-detail__item-type--${materialType(item)}`") {{ materialType(item).toUpperCase() }}
</template>

<style lang="scss" scoped>
.lp-unit-detail {
  padding: 24px 0;
  font-family: 'Fredoka', sans-serif;

  &__loading,
  &__error,
  &__empty {
    padding: 32px;
    color: #6b7280;
  }

  &__section {
    margin-bottom: 24px;
  }

  &__section-head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  &__heading {
    margin: 0;
    color: #1a202c;
    font-size: 17.6px;
    font-weight: 700;
  }

  &__count {
    padding: 3.2px 9.6px;
    border-radius: 6px;
    background: #de7534;
    color: #fff;
    font-size: 11.2px;
    font-weight: 700;
  }

  &__description {
    color: #4a5568;
    font-size: 14.4px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    align-items: center;
    padding: 12px;
    border-radius: 10px;
    background: #fff7ed;
    text-decoration: none;
    transition: background 0.15s;

    &:hover {
      background: #fed7aa;
    }

    &--quiz {
      background: #fffbeb;

      &:hover {
        background: #fde68a;
      }
    }
  }

  &__num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #de7534;
    color: #fff;
    font-size: 13.6px;
    font-weight: 700;
  }

  &__item-title {
    display: block;
    color: #1a202c;
    font-size: 14.4px;
  }

  &__item-type {
    margin: 2px 0 0;
    font-size: 11.2px;
    font-weight: 600;

    &--topic {
      color: #1d4ed8;
    }

    &--quiz {
      color: #92400e;
    }
  }
}
</style>
