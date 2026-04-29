<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { useLessonsStore } from '@/stores/lessons'

const route = useRoute()
const lessonsStore = useLessonsStore()
const loading = ref(false)
const errorMessage = ref('')
const material = ref(null)

const materialId = computed(() => route.params.materialId ?? '')

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
      material.value = await lessonsStore.getMaterialById(id)
    } catch (error) {
      errorMessage.value = error.response?.data?.error ?? 'Content could not be loaded.'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
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
          .lp-material__content(v-if="material.content" v-html="material.content")
          p.lp-material__empty-content(v-else) No content has been added yet.

      //- QUIZ
      template(v-else-if="material.type === 'quiz'")
        .lp-material__quiz
          .lp-material__quiz-placeholder
            span.lp-material__quiz-icon 📝
            p.lp-material__quiz-label Quiz coming soon
            p.lp-material__quiz-sub Quiz details are not available yet.
</template>

<style lang="scss" scoped>
.lp-material {
  padding: 24px 0;
  font-family: 'Fredoka', sans-serif;

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
  }

  &__topic {
    max-width: 800px;
  }

  &__content {
    line-height: 1.8;
    color: #374151;
    font-size: 15.2px;

    :deep(h1),
    :deep(h2),
    :deep(h3) {
      margin: 1.2em 0 0.4em;
      color: #1a202c;
      font-weight: 700;
    }

    :deep(p) {
      margin: 0 0 1em;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 1.5em;
      margin-bottom: 1em;
    }
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
