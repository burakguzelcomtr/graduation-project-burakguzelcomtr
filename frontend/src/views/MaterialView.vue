<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import MaterialContentRenderer from '@/components/lesson/MaterialContentRenderer.vue'
import MaterialNavigation from '@/components/lesson/MaterialNavigation.vue'
import { useLessonsStore } from '@/stores/lessons'
import { useSocketStore } from '@/stores/socket'

const route = useRoute()
const router = useRouter()
const lessonsStore = useLessonsStore()
const socketStore = useSocketStore()
const loading = ref(false)
const errorMessage = ref('')
const material = ref(null)
const unitItems = ref([])

const materialId = computed(() => route.params.materialId ?? '')
const lessonSlug = computed(() => route.params.lessonSlug ?? '')
const unitSlug = computed(() => route.params.unitSlug ?? '')

watch(
  materialId,
  async (id) => {
    if (!id) {
      material.value = null
      return
    }

    material.value = null
    loading.value = true
    errorMessage.value = ''

    try {
      const [mat, unit] = await Promise.all([
        lessonsStore.getMaterialById(id),
        lessonsStore.getUnitBySlug(lessonSlug.value, unitSlug.value),
      ])
      material.value = mat
      unitItems.value = unit?.items ?? []
      socketStore.startMaterial(material.value?._id ?? material.value?.id)
    } catch (error) {
      errorMessage.value = error.response?.data?.error ?? 'Content could not be loaded.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const currentIndex = computed(() =>
  unitItems.value.findIndex((item) => {
    const id = item.item?._id ?? item._id
    return String(id) === String(materialId.value)
  }),
)

const prevItem = computed(() => (currentIndex.value > 0 ? unitItems.value[currentIndex.value - 1] : null))
const nextItem = computed(() =>
  currentIndex.value !== -1 && currentIndex.value < unitItems.value.length - 1
    ? unitItems.value[currentIndex.value + 1]
    : null,
)
const isLast = computed(
  () => currentIndex.value !== -1 && currentIndex.value === unitItems.value.length - 1,
)

function itemTitle(item) {
  return item?.item?.title ?? item?.title ?? ''
}

function itemType(item) {
  return item?.item?.type ?? item?.type ?? 'topic'
}

function itemId(item) {
  return item?.item?._id ?? item?._id
}

function navigate(item) {
  const id = itemId(item)
  if (!id) return
  router.push({
    name: 'material-detail',
    params: { lessonSlug: lessonSlug.value, unitSlug: unitSlug.value, materialId: id },
  })
}
</script>

<template lang="pug">
section.lp-material.container-fluid
  .lp-material__loading(v-if="loading")
    span Loading...

  .lp-material__error(v-else-if="errorMessage")
    p {{ errorMessage }}

  .lp-material__empty(v-else-if="!material")
    p Content not found.

  template(v-else)
    PageHeader(:title="material.title ?? 'Content'" :show-decoration="false")
      template(#meta)
        span.lp-material__type-badge(:class="`lp-material__type-badge--${material.type}`") {{ material.type === 'quiz' ? 'Quiz' : 'Topic' }}

    .lp-material__body

      //- TOPIC
      template(v-if="material.type === 'topic'")
        .lp-material__topic
          MaterialContentRenderer(v-if="material.content" :content="material.content")
          p.lp-material__empty-content(v-else) No content has been added yet.

      //- QUIZ
      template(v-else-if="material.type === 'quiz'")
        .lp-material__quiz
          .lp-material__quiz-placeholder
            span.lp-material__quiz-icon 📝
            p.lp-material__quiz-label Quiz coming soon
            p.lp-material__quiz-sub Quiz details are not available yet.

    //- NAV
    MaterialNavigation(
      :prev-item="prevItem"
      :next-item="nextItem"
      :is-last="isLast"
      :lesson-slug="lessonSlug"
      :unit-slug="unitSlug"
    )
</template>

<style lang="scss" scoped>
.lp-material {
  padding: 24px 0;
  font-family: 'Fredoka', sans-serif;
  margin-bottom: 80px;
  &__loading,
  &__error,
  &__empty {
    padding: 32px;
    color: #6b7280;
  }

  &__type-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;

    &--topic {
      background: #dbeafe;
      color: #1d4ed8;
    }

    &--quiz {
      background: #fef3c7;
      color: #92400e;
    }
  }

  &__body {
    margin-top: 24px;
    padding: 48px;
    background-color: #fff; 
    border: 1px solid #f1f5f9;
    border-radius: 14px;
  }

  &__topic {
    max-width: 100%;
    margin: 0 auto;
  }

  &__empty-content {
    color: #9ca3af;
    font-size: 14.4px;
  }

  &__quiz-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 48px 24px;
    border-radius: 16px;
    background: #fffbeb;
    border: 2px dashed #fcd34d;
    max-width: 480px;
    text-align: center;
  }

  &__quiz-icon {
    font-size: 40px;
  }

  &__quiz-label {
    margin: 0;
    color: #92400e;
    font-size: 18px;
    font-weight: 700;
  }

  &__quiz-sub {
    margin: 0;
    color: #b45309;
    font-size: 13.6px;
  }
}
</style>
