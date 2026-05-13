<script>
import api from '@/lib/api'
import { useStudentsStore } from '@/stores/students'

export default {
  name: 'StudentProfileEditModal',

  emits: ['close', 'saved'],

  props: {
    student: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      studentsStore: useStudentsStore(),
      heros: [],
      countries: [],
      selectedHero: null,
      selectedCountry: null,
      form: { name: '', surname: '', studentId: '', grade: '', section: '', campus: '' },
      saving: false,
      error: '',
    }
  },

  watch: {
    student: {
      immediate: true,
      handler(student) {
        if (student) {
          this.selectedHero = student.hero?._id ?? student.hero ?? null
          this.selectedCountry = student.country?._id ?? student.country ?? null
          this.form = {
            name: student.name ?? '',
            surname: student.surname ?? '',
            studentId: student.studentId ?? '',
            grade: student.grade ?? '',
            section: student.section ?? '',
            campus: student.campus ?? '',
          }
        }
      },
    },
  },

  mounted() {
    this.fetchOptions()
  },

  methods: {
    async fetchOptions() {
      const [herosRes, countriesRes] = await Promise.all([api.get('/heros'), api.get('/countries')])
      this.heros = herosRes.data
      this.countries = countriesRes.data
    },

    async save() {
      if (!this.student) return
      this.saving = true
      this.error = ''
      try {
        const updated = await this.studentsStore.updateStudentProfile(this.student._id, {
          ...this.form,
          hero: this.selectedHero,
          country: this.selectedCountry,
        })
        this.$emit('saved', updated)
        this.$emit('close')
      } catch (e) {
        this.error = e.response?.data?.error || e.message || 'Failed to save.'
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<template>
  <Teleport to="body">
    <div class="lp-spe-backdrop" @click.self="$emit('close')">
      <div class="lp-spe-modal" role="dialog" aria-modal="true">
        <div class="lp-spe-modal__header">
          <span class="lp-spe-modal__title">
            Edit Profile —
            <strong>{{ student?.name }} {{ student?.surname }}</strong>
          </span>
          <button class="lp-spe-modal__close" @click="$emit('close')" aria-label="Close">✕</button>
        </div>

        <div class="lp-spe-modal__body">
          <div class="lp-spe-row">
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-name">Name</label>
              <input id="spe-name" v-model="form.name" class="lp-spe-field__input" type="text" />
            </div>
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-surname">Surname</label>
              <input id="spe-surname" v-model="form.surname" class="lp-spe-field__input" type="text" />
            </div>
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-student-id">Student ID</label>
              <input id="spe-student-id" v-model="form.studentId" class="lp-spe-field__input" type="text" />
            </div>
          </div>

          <div class="lp-spe-row">
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-grade">Grade</label>
              <input id="spe-grade" v-model.number="form.grade" class="lp-spe-field__input" type="number" min="1" />
            </div>
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-section">Section</label>
              <input id="spe-section" v-model="form.section" class="lp-spe-field__input" type="text" />
            </div>
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-campus">Campus</label>
              <input id="spe-campus" v-model="form.campus" class="lp-spe-field__input" type="text" />
            </div>
          </div>

          <div class="lp-spe-row">
            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-hero">Hero</label>
              <select id="spe-hero" v-model="selectedHero" class="lp-spe-field__select">
                <option :value="null">— None —</option>
                <option v-for="hero in heros" :key="hero._id" :value="hero._id">{{ hero.name }}</option>
              </select>
            </div>

            <div class="lp-spe-field">
              <label class="lp-spe-field__label" for="spe-country">Country</label>
              <select id="spe-country" v-model="selectedCountry" class="lp-spe-field__select">
                <option :value="null">— None —</option>
                <option v-for="country in countries" :key="country._id" :value="country._id">{{ country.name }}</option>
              </select>
            </div>
          </div>

          <p class="lp-spe-error" v-if="error">{{ error }}</p>
        </div>

        <div class="lp-spe-modal__footer">
          <button class="lp-spe-btn lp-spe-btn--ghost" @click="$emit('close')" type="button">Cancel</button>
          <button class="lp-spe-btn lp-spe-btn--primary" @click="save" :disabled="saving" type="button">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-spe-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(13, 32, 68, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-spe-modal {
  background: $bg_card;
  border: 2px solid $primary;
  border-radius: 16px;
  width: min(600px, 96vw);
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

    strong {
      color: $primary;
    }
  }

  &__close {
    background: none;
    border: none;
    font-size: 16px;
    color: #a0aec0;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    line-height: 1;
    font-family: $font-main;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
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
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1.5px dashed darken($bg_card, 10%);
    flex-shrink: 0;
  }
}

.lp-spe-row {
  display: flex;
  gap: 14px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.lp-spe-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__label {
    font-size: 12.8px;
    font-weight: 600;
    color: $primary-dark;
    font-family: $font-main;
    letter-spacing: 0.3px;
  }

  &__input,
  &__select {
    width: 100%;
    padding: 9px 13px;
    border: 1.5px dashed $primary;
    border-radius: $border-radius;
    font-size: 14.4px;
    font-family: $font-main;
    color: $text-dark;
    background: #fff;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;

    &:focus {
      outline: none;
      border-style: solid;
      border-color: $primary-dark;
      background: $bg_card;
      box-shadow: 0 0 0 3px rgba(224, 123, 57, 0.15);
    }
  }

  &__select {
    cursor: pointer;
    appearance: auto;
  }
}

.lp-spe-error {
  color: #c53030;
  font-size: 13.6px;
  font-family: $font-main;
  margin: 0;
}

.lp-spe-btn {
  padding: 8px 22px;
  border-radius: $border-radius;
  font-size: 14.4px;
  font-weight: 600;
  font-family: $font-main;
  cursor: pointer;
  border: none;
  transition: background 0.18s;

  &--ghost {
    background: transparent;
    color: $text-muted;
    border: 1.5px dashed #cbd5e0;

    &:hover {
      background: #edf2f7;
      border-color: #a0aec0;
    }
  }

  &--primary {
    background: $primary;
    color: #fff;
    border: 1.5px solid $primary;

    &:hover:not(:disabled) {
      background: $primary-dark;
      border-color: $primary-dark;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}
</style>
