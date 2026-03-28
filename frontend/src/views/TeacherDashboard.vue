<script setup>
import PageHeader from '@/components/PageHeader.vue'
</script>

<template lang="pug">
.lp-teacher-dashboard
  PageHeader(title="Teacher Dashboard")
  .lp-teacher-dashboard__cards
    .lp-teacher-dashboard__card
      .lp-teacher-dashboard__card-icon 📚
      h3 My Lessons
      p Manage your lesson content and materials.
      router-link(to="/lessons") Go to Lessons →
    .lp-teacher-dashboard__card
      .lp-teacher-dashboard__card-icon 📝
      h3 Create Quiz
      p Build new quizzes for your students.
      router-link(to="/quizzes") Go to Quizzes →
    .lp-teacher-dashboard__card
      .lp-teacher-dashboard__card-icon 🏫
      h3 Class Management
      p View class groups and student rosters.
      router-link(to="/class-groups") Go to Classes →
    .lp-teacher-dashboard__card
      .lp-teacher-dashboard__card-icon 📊
      h3 Student Progress
      p Track lesson and quiz progress for all students.
      router-link(to="/students") Go to Students →
</template>

<style lang="scss" scoped>
.lp-teacher-dashboard {
  padding: 1.5rem;

  &__cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  &__card {
    min-width: 200px;
    flex: 1;
    padding: 1.5rem;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    h3 {
      margin: 0 0 0.4rem;
      font-size: 1.05rem;
    }

    p {
      margin: 0 0 1rem;
      color: #718096;
      font-size: 0.87rem;
      line-height: 1.4;
    }

    a {
      color: #38a169;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__card-icon {
    margin-bottom: 0.6rem;
    font-size: 2rem;
  }
}
</style>
