<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'TeacherDashboard',

  components: {
    PageHeader,
  },
}
</script>

<template lang="pug">
section.lp-teacher-dashboard.container-fluid
  PageHeader(title="Teacher Dashboard")
  .lp-teacher-dashboard__cards.row
    .lp-teacher-dashboard__col.col-12.col-md-6.col-xl-3
      .lp-teacher-dashboard__card
        .lp-teacher-dashboard__card-icon 📚
        h3 My Lessons
        p Manage your lesson content and materials.
        router-link.lp-teacher-dashboard__link.btn(to="/lessons") Go to Lessons →
    .lp-teacher-dashboard__col.col-12.col-md-6.col-xl-3
      .lp-teacher-dashboard__card
        .lp-teacher-dashboard__card-icon 📝
        h3 Create Quiz
        p Build new quizzes for your students.
        router-link.lp-teacher-dashboard__link.btn(to="/quizzes") Go to Quizzes →
    .lp-teacher-dashboard__col.col-12.col-md-6.col-xl-3
      .lp-teacher-dashboard__card
        .lp-teacher-dashboard__card-icon 🏫
        h3 Class Management
        p View class groups and student rosters.
        router-link.lp-teacher-dashboard__link.btn(to="/class-groups") Go to Classes →
    .lp-teacher-dashboard__col.col-12.col-md-6.col-xl-3
      .lp-teacher-dashboard__card
        .lp-teacher-dashboard__card-icon 📊
        h3 Student Progress
        p Track lesson and quiz progress for all students.
        router-link.lp-teacher-dashboard__link.btn(to="/students") Go to Students →
</template>

<style lang="scss" scoped>
.lp-teacher-dashboard {
  padding: 24px 0;

  &__cards {
    --bs-gutter-x: 24px;
    --bs-gutter-y: 24px;
  }

  &__card {
    height: 100%;
    padding: 24px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    h3 {
      margin: 0 0 6.4px;
      font-size: 16.8px;
    }

    p {
      margin: 0 0 16px;
      color: #718096;
      font-size: 13.92px;
      line-height: 1.4;
    }

    .lp-teacher-dashboard__link {
      color: #38a169;
      font-size: 14.4px;
      font-weight: 600;
      border-color: #38a169;

      &:hover {
        background: #38a169;
        color: #fff;
      }
    }
  }

  &__card-icon {
    margin-bottom: 9.6px;
    font-size: 32px;
  }
}
</style>
