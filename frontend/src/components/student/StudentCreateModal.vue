<script>
import { useStudentsStore } from '@/stores/students'
import { useUserStore } from '@/stores/user'

export default {
  name: 'StudentCreateModal',

  emits: ['close', 'created'],

  data() {
    const userStore = useUserStore()
    return {
      studentsStore: useStudentsStore(),
      form: {
        name: '',
        surname: '',
        studentId: '',
        email: '',
        password: '',
        grade: userStore.profile?.grade ?? '',
        section: userStore.profile?.section ?? '',
        campus: userStore.profile?.campus ?? '',
      },
      saving: false,
      error: '',
    }
  },

  methods: {
    async save() {
      this.saving = true
      this.error = ''
      try {
        const created = await this.studentsStore.createStudent({
          name: this.form.name,
          surname: this.form.surname,
          studentId: this.form.studentId || undefined,
          email: this.form.email,
          password: this.form.password,
          grade: Number(this.form.grade),
          section: this.form.section,
          campus: this.form.campus,
        })
        this.$emit('created', created)
        this.$emit('close')
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Failed to create student.'
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<template lang="pug">
Teleport(to="body")
  .lp-sc-backdrop(@click.self="$emit('close')")
    .lp-sc-modal(role="dialog" aria-modal="true")
      .lp-sc-modal__header
        span.lp-sc-modal__title Add New Student
        button.lp-sc-modal__close(@click="$emit('close')" aria-label="Close") ✕

      .lp-sc-modal__body
        .lp-sc-row
          .lp-sc-field
            label.lp-sc-field__label(for="sc-name") Name *
            input#sc-name.lp-sc-field__input(v-model="form.name" type="text" placeholder="e.g. Ahmet")
          .lp-sc-field
            label.lp-sc-field__label(for="sc-surname") Surname *
            input#sc-surname.lp-sc-field__input(v-model="form.surname" type="text" placeholder="e.g. Yılmaz")
          .lp-sc-field
            label.lp-sc-field__label(for="sc-student-id") Student ID
            input#sc-student-id.lp-sc-field__input(v-model="form.studentId" type="text" placeholder="Optional")

        .lp-sc-row
          .lp-sc-field
            label.lp-sc-field__label(for="sc-email") Email *
            input#sc-email.lp-sc-field__input(v-model="form.email" type="email" placeholder="student@school.com")
          .lp-sc-field
            label.lp-sc-field__label(for="sc-password") Password *
            input#sc-password.lp-sc-field__input(v-model="form.password" type="password" placeholder="Min. 6 characters")

        .lp-sc-class-info
          span.lp-sc-class-info__label Class:
          span.lp-sc-class-info__value Grade {{ form.grade }} / {{ form.section }} / {{ form.campus }}

        p.lp-sc-error(v-if="error") {{ error }}

      .lp-sc-modal__footer
        button.lp-sc-btn.lp-sc-btn--ghost(@click="$emit('close')" type="button") Cancel
        button.lp-sc-btn.lp-sc-btn--primary(@click="save" :disabled="saving || !form.name || !form.surname || !form.email || !form.password" type="button")
          | {{ saving ? 'Creating…' : 'Create Student' }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-sc-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(13, 32, 68, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-sc-modal {
  background: $bg_card;
  border: 2px solid $primary;
  border-radius: 16px;
  width: min(560px, 96vw);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 48px rgba(13, 32, 68, 0.28);
  font-family: $font-main;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    background: $bg-dark;
    border-radius: 14px 14px 0 0;
    flex-shrink: 0;
  }

  &__title {
    font-size: 15.2px;
    color: #fff;
    font-family: $font-main;
    font-weight: 700;
  }

  &__close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 4px;
    transition: color 0.15s;

    &:hover {
      color: #fff;
    }
  }

  &__body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__footer {
    padding: 16px 24px;
    border-top: 1px solid rgba(224, 123, 57, 0.18);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-shrink: 0;
  }
}

.lp-sc-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.lp-sc-field {
  flex: 1;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__label {
    font-size: 11.2px;
    font-weight: 700;
    color: $text-muted;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-family: $font-main;
  }

  &__input {
    padding: 9px 12px;
    border: 1.5px solid rgba(224, 123, 57, 0.3);
    border-radius: 8px;
    background: $bg_card;
    color: $text-dark;
    font-size: 14px;
    font-family: $font-main;
    outline: none;
    transition: border-color 0.15s;

    &:focus {
      border-color: $primary;
    }

    &::placeholder {
      color: $text-muted;
      opacity: 0.6;
    }
  }
}

.lp-sc-class-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(224, 123, 57, 0.08);
  border: 1.5px dashed rgba(224, 123, 57, 0.4);
  border-radius: 8px;

  &__label {
    font-size: 12px;
    color: $text-muted;
    font-family: $font-main;
    font-weight: 600;
  }

  &__value {
    font-size: 13.6px;
    color: $primary-dark;
    font-weight: 700;
    font-family: $font-main;
  }
}

.lp-sc-error {
  color: #c53030;
  font-size: 13.6px;
  font-family: $font-main;
  margin: 0;
}

.lp-sc-btn {
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13.6px;
  font-weight: 700;
  font-family: $font-main;
  cursor: pointer;
  border: 1.5px solid $primary;
  transition: background 0.15s, color 0.15s, opacity 0.15s;

  &--ghost {
    background: transparent;
    color: $primary-dark;

    &:hover {
      background: rgba(224, 123, 57, 0.08);
    }
  }

  &--primary {
    background: $primary;
    color: #fff;

    &:hover:not(:disabled) {
      background: $primary-dark;
      border-color: $primary-dark;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
