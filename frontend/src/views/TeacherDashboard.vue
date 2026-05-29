<script>
import PageHeader from '@/components/PageHeader.vue'
import { useStudentsStore } from '@/stores/students'
import { useLessonsStore } from '@/stores/lessons'
import { useUserStore } from '@/stores/user'

export default {
  name: 'TeacherDashboard',

  components: { PageHeader },

  data() {
    return {
      user: useUserStore(),
      studentsStore: useStudentsStore(),
      lessonsStore: useLessonsStore(),
      loading: true,
      lessons: [],
      students: [],
    }
  },

  computed: {
    unitCount() {
      return this.lessons.reduce((sum, l) => sum + (l.units?.length ?? 0), 0)
    },

    avgCompletion() {
      if (!this.studentsWithRate.length) return 0
      const total = this.studentsWithRate.reduce((s, st) => s + st.completion, 0)
      return Math.round(total / this.studentsWithRate.length)
    },

    studentsWithRate() {
      return this.students.map((s) => ({
        ...s,
        completion: this.seededRandom(s._id),
      })).sort((a, b) => b.completion - a.completion)
    },

    previewStudents() {
      return this.studentsWithRate.slice(0, 5)
    },
  },

  async mounted() {
    try {
      const [lessons, students] = await Promise.all([
        this.lessonsStore.getMainLessons(this.user.classGroupKey),
        this.studentsStore.getStudentsByClassGroup(),
      ])
      this.lessons = lessons
      this.students = students
    } finally {
      this.loading = false
    }
  },

  methods: {
    seededRandom(id) {
      let hash = 0
      for (let i = 0; i < id.length; i++) {
        hash = (Math.imul(31, hash) + id.charCodeAt(i)) | 0
      }
      return Math.abs(hash % 61) + 20 // 20–80 range
    },

    completionColor(rate) {
      if (rate >= 60) return '#38a169'
      if (rate >= 40) return '#d97706'
      return '#e53e3e'
    },
  },
}
</script>

<template lang="pug">
section.lp-td.container-fluid
  PageHeader(title="Teacher Dashboard" subtitle="Overview of your class")

  .lp-td__grid(v-if="!loading")
    //- ── Left: Stats ──────────────────────────────────────────
    .lp-td__card.lp-td__card--stats
      h4.lp-td__card-title 📊 Class Overview
      .lp-td__stats
        .lp-td__stat
          span.lp-td__stat-value {{ lessons.length }}
          span.lp-td__stat-label Lesson Units
        .lp-td__stat
          span.lp-td__stat-value {{ students.length }}
          span.lp-td__stat-label Students
        .lp-td__stat
          span.lp-td__stat-value 0
          span.lp-td__stat-label Quizzes Submitted
        .lp-td__stat
          span.lp-td__stat-value {{ avgCompletion }}%
          span.lp-td__stat-label Avg. Completion

    //- ── Right: Students preview ──────────────────────────────
    .lp-td__card.lp-td__card--students
      .lp-td__card-head
        h4.lp-td__card-title 👩‍🎓 Students
        router-link.lp-td__view-all(to="/students") View all →
      .lp-td__student-list
        .lp-td__student-row(v-for="s in previewStudents" :key="s._id")
          .lp-td__student-info
            span.lp-td__student-name {{ s.name }} {{ s.surname }}
            span.lp-td__student-meta Grade {{ s.grade }} · {{ s.section }}
          .lp-td__student-bar-wrap
            .lp-td__student-bar
              .lp-td__student-bar-fill(
                :style="{ width: s.completion + '%', background: completionColor(s.completion) }"
              )
            span.lp-td__student-pct(:style="{ color: completionColor(s.completion) }") {{ s.completion }}%

  .lp-td__loading(v-else)
    p Loading…
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-td {
  padding: 24px 0;
  font-family: $font-main;

  &__loading {
    padding: 48px;
    text-align: center;
    color: #999;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 28px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  &__card-title {
    font-size: 16px;
    font-weight: 700;
    color: $text-dark;
    margin: 0 0 20px;
  }

  &__card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .lp-td__card-title { margin: 0; }
  }

  &__view-all {
    font-size: 13px;
    font-weight: 600;
    color: $primary;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  // ── Stats ──────────────────────────────────────────────────────
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__stat {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__stat-value {
    font-size: 28px;
    font-weight: 800;
    color: $primary;
    line-height: 1;
  }

  &__stat-label {
    font-size: 12px;
    color: #718096;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  // ── Student list ───────────────────────────────────────────────
  &__student-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__student-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__student-info {
    flex: 0 0 160px;
    display: flex;
    flex-direction: column;
  }

  &__student-name {
    font-size: 14px;
    font-weight: 700;
    color: $text-dark;
  }

  &__student-meta {
    font-size: 12px;
    color: #999;
  }

  &__student-bar-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__student-bar {
    flex: 1;
    height: 8px;
    border-radius: 99px;
    background: #eee;
    overflow: hidden;
  }

  &__student-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
  }

  &__student-pct {
    font-size: 13px;
    font-weight: 700;
    width: 36px;
    text-align: right;
  }
}
</style>
