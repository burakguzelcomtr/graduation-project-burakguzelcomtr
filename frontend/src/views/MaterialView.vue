<script>
import { nextTick } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import MaterialContentRenderer from '@/components/lesson/MaterialContentRenderer.vue'
import MaterialNavigation from '@/components/lesson/MaterialNavigation.vue'
import { useLessonsStore } from '@/stores/lessons'
import { useSocketStore } from '@/stores/socket'
import { numberBulletSrc } from '@/utils/numberBullet'

export default {
  name: 'MaterialView',

  components: {
    PageHeader,
    MaterialContentRenderer,
    MaterialNavigation,
  },

  data() {
    return {
      lessonsStore: useLessonsStore(),
      socketStore: useSocketStore(),
      loading: false,
      errorMessage: '',
      material: null,
      unitItems: [],
      quizQuestions: [],
      quizResponses: {},
      quizQuestionStates: {},
      quizFinished: false,
      currentQuizPage: 0,
      submittingQuestionKey: '',
    }
  },

  computed: {
    materialId() {
      return this.$route.params.materialId ?? ''
    },

    lessonSlug() {
      return this.$route.params.lessonSlug ?? ''
    },

    unitSlug() {
      return this.$route.params.unitSlug ?? ''
    },

    currentIndex() {
      return this.unitItems.findIndex((item) => {
        const id = item.item?._id ?? item._id
        return String(id) === String(this.materialId)
      })
    },

    prevItem() {
      return this.currentIndex > 0 ? this.unitItems[this.currentIndex - 1] : null
    },

    nextItem() {
      return this.currentIndex !== -1 && this.currentIndex < this.unitItems.length - 1
        ? this.unitItems[this.currentIndex + 1]
        : null
    },

    isLast() {
      return this.currentIndex !== -1 && this.currentIndex === this.unitItems.length - 1
    },

    completedQuestions() {
      return this.quizQuestions.reduce((count, question, index) => count + (this.isQuestionCompleted(question, index) ? 1 : 0), 0)
    },

    quizReadyToFinish() {
      return this.quizQuestions.length > 0 && this.completedQuestions === this.quizQuestions.length
    },

    quizSubmitted() {
      return this.quizFinished && this.quizReadyToFinish
    },

    canGoForwardInMaterialNav() {
      return this.material?.type !== 'quiz' || this.quizSubmitted
    },

    shouldDisableNextInMaterialNav() {
      return this.material?.type === 'quiz' && !this.quizSubmitted
    },

    shouldDisableFinishInMaterialNav() {
      return this.material?.type === 'quiz' && !this.quizSubmitted
    },

    currentQuestion() {
      return this.quizQuestions[this.currentQuizPage] ?? null
    },

    currentQuestionIndex() {
      if (!this.quizQuestions.length) {
        return 0
      }

      return Math.min(this.currentQuizPage, this.quizQuestions.length - 1)
    },

    hasPreviousQuizQuestion() {
      return this.currentQuestionIndex > 0
    },

    hasNextQuizQuestion() {
      return this.currentQuestionIndex < this.quizQuestions.length - 1
    },

    currentQuestionCompleted() {
      return this.currentQuestion ? this.isQuestionCompleted(this.currentQuestion, this.currentQuestionIndex) : false
    },

    isSubmittingCurrentQuestion() {
      return this.currentQuestion ? this.submittingQuestionKey === this.questionKey(this.currentQuestion, this.currentQuestionIndex) : false
    },
  },

  watch: {
    materialId: {
      immediate: true,
      async handler(id) {
        await this.loadMaterial(id)
      },
    },
  },

  methods: {
    numberBulletSrc,

    resetQuizState() {
      this.quizQuestions = []
      this.quizResponses = {}
      this.quizQuestionStates = {}
      this.quizFinished = false
      this.currentQuizPage = 0
      this.submittingQuestionKey = ''
    },

    async loadMaterial(id) {
      if (!id) {
        this.material = null
        this.resetQuizState()
        return
      }

      this.material = null
      this.resetQuizState()
      this.loading = true
      this.errorMessage = ''

      try {
        const [mat, unit] = await Promise.all([
          this.lessonsStore.getMaterialById(id),
          this.lessonsStore.getUnitBySlug(this.lessonSlug, this.unitSlug),
        ])
        this.material = mat
        this.unitItems = unit?.items ?? []

        if (mat?.type === 'quiz') {
          this.quizQuestions = Array.isArray(mat?.questions) ? mat.questions : []
        }

        this.socketStore.startMaterial(this.material?._id ?? this.material?.id)
      } catch (error) {
        this.errorMessage = error.response?.data?.error ?? 'Content could not be loaded.'
      } finally {
        this.loading = false
      }
    },

    itemTitle(item) {
      return item?.item?.title ?? item?.title ?? ''
    },

    itemType(item) {
      return item?.item?.type ?? item?.type ?? 'topic'
    },

    itemId(item) {
      return item?.item?._id ?? item?._id
    },

    navigate(item) {
      const id = this.itemId(item)
      if (!id) return
      this.$router.push({
        name: 'material-detail',
        params: { lessonSlug: this.lessonSlug, unitSlug: this.unitSlug, materialId: id },
      })
    },

    questionKey(question, index) {
      return question?._id ?? question?.id ?? `question-${index}`
    },

    quizResponse(question, index) {
      return this.quizResponses[this.questionKey(question, index)] ?? ''
    },

    questionState(question, index) {
      return this.quizQuestionStates[this.questionKey(question, index)] ?? null
    },

    setQuizResponse(question, index, value) {
      if (this.quizSubmitted || this.isQuestionCompleted(question, index)) {
        return
      }

      this.quizResponses = {
        ...this.quizResponses,
        [this.questionKey(question, index)]: value,
      }

      if (this.questionState(question, index)) {
        this.quizQuestionStates = {
          ...this.quizQuestionStates,
          [this.questionKey(question, index)]: null,
        }
      }
    },

    hasQuizResponse(question, index) {
      return String(this.quizResponse(question, index)).trim().length > 0
    },

    questionOptions(question) {
      if (question?.type === 'true-false') {
        return question?.answers?.length ? question.answers : ['True', 'False']
      }

      return question?.answers ?? []
    },

    questionTypeLabel(question) {
      if (question?.type === 'multiple-choice') return 'Choose one answer'
      if (question?.type === 'true-false') return 'True or false'
      if (question?.type === 'short-answer') return 'Write your answer'
      return 'Question'
    },

    isQuestionCompleted(question, index) {
      return this.questionState(question, index)?.completed === true
    },

    questionFeedbackMessage(question, index) {
      return this.questionState(question, index)?.message ?? ''
    },

    async submitCurrentQuestion() {
      if (!this.currentQuestion) {
        return
      }

      const question = this.currentQuestion
      const index = this.currentQuestionIndex
      const key = this.questionKey(question, index)

      if (this.submittingQuestionKey) {
        return
      }

      this.submittingQuestionKey = key
      await nextTick()

      try {
        if (!this.hasQuizResponse(question, index)) {
          this.quizQuestionStates = {
            ...this.quizQuestionStates,
            [key]: {
              completed: false,
              correct: false,
              message: 'Please answer this question before submitting.',
            },
          }
          return
        }

        const questionId = question?._id ?? question?.id
        if (!questionId) {
          this.quizQuestionStates = {
            ...this.quizQuestionStates,
            [key]: {
              completed: false,
              correct: false,
              message: 'Question validation is unavailable right now.',
            },
          }
          return
        }

        const validation = await this.lessonsStore.validateQuestion(questionId, this.quizResponse(question, index))
        const correct = validation?.isCorrect === true

        if (!correct) {
          this.quizQuestionStates = {
            ...this.quizQuestionStates,
            [key]: {
              completed: false,
              correct: false,
              message: 'That is not correct. Please try again.',
            },
          }
          return
        }

        this.quizQuestionStates = {
          ...this.quizQuestionStates,
          [key]: {
            completed: true,
            correct: true,
            message: this.hasNextQuizQuestion
              ? 'Correct answer. Moving to the next question.'
              : 'Correct answer. You can continue the lesson now.',
          },
        }

        if (this.hasNextQuizQuestion) {
          this.currentQuizPage += 1
          return
        }

        this.quizFinished = true
      } catch (error) {
        this.quizQuestionStates = {
          ...this.quizQuestionStates,
          [key]: {
            completed: false,
            correct: false,
            message: error.response?.data?.error ?? error.message ?? 'Question validation failed. Please try again.',
          },
        }
      } finally {
        this.submittingQuestionKey = ''
      }
    },

    goToPreviousQuizQuestion() {
      if (!this.hasPreviousQuizQuestion) {
        return
      }

      this.currentQuizPage -= 1
    },

    goToNextQuizQuestion() {
      if (!this.hasNextQuizQuestion || !this.currentQuestionCompleted) {
        return
      }

      this.currentQuizPage += 1
    },
  },
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
          .lp-material__quiz-head
            .lp-material__quiz-copy
              h2.lp-material__quiz-title {{ material.title ?? 'Quiz' }}
              p.lp-material__quiz-subtitle {{ completedQuestions }} / {{ quizQuestions.length }} questions completed

          p.lp-material__quiz-note(v-if="quizSubmitted") Quiz completed successfully. You can continue the lesson now.
          p.lp-material__quiz-empty(v-if="!quizQuestions.length") No questions have been added to this quiz yet.

          .lp-material__quiz-list(v-else)
            .lp-material__quiz-pagination
              span.lp-material__quiz-page Question {{ currentQuestionIndex + 1 }} of {{ quizQuestions.length }}

            article.lp-material__quiz-question(
              v-if="currentQuestion"
              :key="questionKey(currentQuestion, currentQuestionIndex)"
            )
              .lp-material__quiz-question-head
                img.lp-material__quiz-number(
                  v-if="numberBulletSrc(currentQuestion.order, currentQuestionIndex)"
                  :src="numberBulletSrc(currentQuestion.order, currentQuestionIndex)"
                  alt=""
                  aria-hidden="true"
                )
                span.lp-material__quiz-number-fallback(v-else) {{ currentQuestionIndex + 1 }}
                .lp-material__quiz-heading-block
                  h3.lp-material__quiz-question-title {{ currentQuestion.question }}
                  p.lp-material__quiz-question-type {{ questionTypeLabel(currentQuestion) }}

              .lp-material__quiz-options(v-if="currentQuestion.type !== 'short-answer'")
                button.lp-material__quiz-option(
                  v-for="(answer, answerIndex) in questionOptions(currentQuestion)"
                  :key="`${questionKey(currentQuestion, currentQuestionIndex)}-${answerIndex}`"
                  type="button"
                  :class="{ 'lp-material__quiz-option--selected': quizResponse(currentQuestion, currentQuestionIndex) === answer }"
                  :disabled="quizSubmitted || currentQuestionCompleted || isSubmittingCurrentQuestion"
                  @click="setQuizResponse(currentQuestion, currentQuestionIndex, answer)"
                )
                  span.lp-material__quiz-option-indicator {{ quizResponse(currentQuestion, currentQuestionIndex) === answer ? '✓' : '' }}
                  span.lp-material__quiz-option-text {{ answer }}

              textarea.lp-material__quiz-textarea(
                v-else
                :value="quizResponse(currentQuestion, currentQuestionIndex)"
                placeholder="Type your response here"
                rows="4"
                :disabled="quizSubmitted || currentQuestionCompleted || isSubmittingCurrentQuestion"
                @input="setQuizResponse(currentQuestion, currentQuestionIndex, $event.target.value)"
              )

              p.lp-material__quiz-helper(v-if="currentQuestion.type === 'short-answer'") Submit this answer to check whether it is correct.
              .lp-material__quiz-feedback(v-if="questionFeedbackMessage(currentQuestion, currentQuestionIndex)")
                p.lp-material__quiz-feedback-state(:class="{ 'lp-material__quiz-feedback-state--correct': currentQuestionCompleted, 'lp-material__quiz-feedback-state--wrong': !currentQuestionCompleted }")
                  | {{ questionFeedbackMessage(currentQuestion, currentQuestionIndex) }}

              .lp-material__quiz-footer
                button.lp-material__quiz-submit.btn(
                  type="button"
                  :disabled="quizSubmitted || currentQuestionCompleted || isSubmittingCurrentQuestion"
                  @click="submitCurrentQuestion"
                ) {{ isSubmittingCurrentQuestion ? 'Checking...' : (currentQuestionCompleted ? 'Submitted' : 'Submit Answer') }}

                .lp-material__quiz-footer-actions
                  button.lp-material__quiz-page-btn(
                    type="button"
                    :disabled="!hasPreviousQuizQuestion || isSubmittingCurrentQuestion"
                    @click="goToPreviousQuizQuestion"
                  ) Previous
                  button.lp-material__quiz-page-btn(
                    v-if="hasNextQuizQuestion"
                    type="button"
                    :disabled="!currentQuestionCompleted || isSubmittingCurrentQuestion"
                    @click="goToNextQuizQuestion"
                  ) Next

    //- NAV
    MaterialNavigation(
      :prev-item="prevItem"
      :next-item="nextItem"
      :is-last="isLast"
      :disable-next="shouldDisableNextInMaterialNav"
      :disable-finish="shouldDisableFinishInMaterialNav"
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

  &__quiz {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__quiz-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__quiz-title {
    margin: 0;
    color: #ea6d27;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.02em;
  }

  &__quiz-subtitle,
  &__quiz-note,
  &__quiz-empty,
  &__quiz-helper {
    margin: 0;
    color: #6b7280;
    font-size: 13.6px;
  }

  &__quiz-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    border-radius: 16px;
    background: #fff9eb;
    border: 1px dashed #f3a260;
    text-align: center;
  }

  &__quiz-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__quiz-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    flex-wrap: wrap;
  }

  &__quiz-page {
    color: #ea6d27;
    font-size: 14.4px;
    font-weight: 800;
  }

  &__quiz-footer-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  &__quiz-page-btn {
    padding: 10px 16px;
    border: 1px dashed #f3a260;
    border-radius: 12px;
    background: #fff;
    color: #ea6d27;
    font: inherit;
    font-size: 13.6px;
    font-weight: 800;
    cursor: pointer;

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    &--finish {
      background: linear-gradient(135deg, #7c4dff 0%, #5b3df5 100%);
      color: #fff;
      border-color: transparent;
    }
  }

  &__quiz-question {
    padding: 18px;
    border: 1px dashed #f3a260;
    border-radius: 18px;
    background: #fffaf0;
  }

  &__quiz-question-head {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 14px;
  }

  &__quiz-number {
    display: block;
    width: 36px;
    height: 52px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__quiz-number-fallback {
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #ea6d27;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    flex-shrink: 0;
  }

  &__quiz-heading-block {
    min-width: 0;
  }

  &__quiz-question-title {
    margin: 0;
    color: #ea6d27;
    font-size: 17.6px;
    font-weight: 800;
  }

  &__quiz-question-type {
    margin: 4px 0 0;
    color: #7c4dff;
    font-size: 12.8px;
    font-weight: 700;
  }

  &__quiz-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__quiz-option {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 18px;
    border: 1px dashed #f3a260;
    border-radius: 14px;
    background: #fff;
    color: #334155;
    font-size: 15.2px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 18px rgba(124, 77, 255, 0.12);
    }

    &:disabled {
      cursor: default;
    }

    &--selected {
      background: linear-gradient(135deg, #7c4dff 0%, #5b3df5 100%);
      color: #fff;
    }
  }

  &__quiz-option-indicator {
    display: inline-flex;
    width: 28px;
    height: 28px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid currentColor;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 800;
  }

  &__quiz-option-text {
    min-width: 0;
  }

  &__quiz-textarea {
    width: 100%;
    min-height: 120px;
    padding: 18px 20px;
    border: 1px dashed #f3a260;
    border-radius: 14px;
    background: #fff;
    color: #334155;
    font: inherit;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #ea6d27;
      box-shadow: 0 0 0 4px rgba(234, 109, 39, 0.12);
    }

    &:disabled {
      background: #f8fafc;
      cursor: default;
    }
  }

  &__quiz-feedback {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px dashed #f3a260;
  }

  &__quiz-feedback-state,
  &__quiz-feedback-answer {
    margin: 0;
    font-size: 13.6px;
  }

  &__quiz-feedback-state {
    font-weight: 800;

    &--correct {
      color: #15803d;
    }

    &--wrong {
      color: #b91c1c;
    }
  }

  &__quiz-feedback-answer {
    margin-top: 6px;
    color: #475569;
  }

  &__quiz-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  &__quiz-submit {
    min-width: 180px;
    padding: 12px 18px;
    border: none;
    border-radius: 12px;
    background: #ea6d27;
    color: #fff;
    font-size: 14.4px;
    font-weight: 800;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

@media (max-width: 700px) {
  .lp-material {
    &__body {
      padding: 24px;
    }

    &__quiz-head {
      align-items: stretch;
    }

    &__quiz-pagination {
      align-items: stretch;
    }

    &__quiz-footer {
      align-items: stretch;
    }

    &__quiz-footer-actions {
      width: 100%;
    }

    &__quiz-page-btn {
      flex: 1 1 0;
    }

    &__quiz-submit {
      width: 100%;
    }
  }
}
</style>
