<script>
import { useStudentsStore } from '@/stores/students'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/PageHeader.vue'
import StudentProfileEditModal from '@/components/student/StudentProfileEditModal.vue'

export default {
  name: 'TeacherStudents',

  components: {
    PageHeader,
    StudentProfileEditModal,
  },

  data() {
    return {
      user: useUserStore(),
      studentsStore: useStudentsStore(),
      loading: false,
      error: '',
      editingStudent: null,
    }
  },

  computed: {
    students() {
      if (!this.user.classGroupKey) {
        return []
      }

      return this.studentsStore.studentsByClassGroup[this.user.classGroupKey] ?? []
    },
  },

  async mounted() {
    if (!this.user.classGroupKey) {
      this.error = 'No class group assigned to your account.'
      return
    }

    if (!this.studentsStore.studentsByClassGroup[this.user.classGroupKey]) {
      this.loading = true
    }

    try {
      this.error = ''
      await this.studentsStore.getStudentsByClassGroup()
    } catch (e) {
      this.error = e.response?.data?.error || e.message || 'Failed to fetch students.'
    } finally {
      this.loading = false
    }
  },
}
</script>

<template>
  <div class="lp-teacher-students container-fluid">
    <PageHeader title="My Students">
      <span class="lp-teacher-students__count" v-if="students.length">{{ students.length }} students</span>
    </PageHeader>

    <div class="lp-teacher-students__state" v-if="loading">Loading students...</div>
    <div class="lp-teacher-students__state lp-teacher-students__state--error" v-else-if="error">{{ error }}</div>
    <div class="lp-teacher-students__state" v-else-if="students.length === 0">No students found in your class.</div>

    <div class="row" v-else>
      <div class="col-12">
        <div class="lp-teacher-students__table-wrap">
          <table class="lp-teacher-students__table">
            <thead class="lp-teacher-students__thead">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Student ID</th>
                <th>Hero</th>
                <th>Country</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, i) in students" :key="student._id">
                <td class="lp-teacher-students__cell lp-teacher-students__cell--muted">{{ i + 1 }}</td>
                <td class="lp-teacher-students__cell lp-teacher-students__cell--strong">{{ student.name }}</td>
                <td>{{ student.surname }}</td>
                <td class="lp-teacher-students__cell lp-teacher-students__cell--mono">{{ student.studentId ?? '—' }}</td>
                <td>{{ student.hero?.name ?? '—' }}</td>
                <td>{{ student.country?.name ?? '—' }}</td>
                <td class="lp-teacher-students__cell lp-teacher-students__cell--action">
                  <button class="lp-teacher-students__edit-btn" @click="editingStudent = student" type="button" title="Edit profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <StudentProfileEditModal
      v-if="editingStudent"
      :student="editingStudent"
      @close="editingStudent = null"
      @saved="editingStudent = null"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-teacher-students {
  padding: 24px 0;

  &__count {
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(224, 123, 57, 0.12);
    color: $primary-dark;
    font-size: 12.8px;
    font-weight: 700;
    font-family: $font-main;
  }

  &__state {
    padding: 16px 0;
    color: $text-muted;
    font-size: 15.2px;
    font-family: $font-main;

    &--error {
      color: #c53030;
    }
  }

  &__table-wrap {
    overflow: hidden;
    border-radius: 12px;
    border: 2px dashed $primary;
    background: $bg_card;
    box-shadow: 0 4px 16px rgba(13, 32, 68, 0.1);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-family: $font-main;

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(224, 123, 57, 0.05);
    }

    th {
      padding: 13px 16px;
      border-bottom: 1.5px dashed rgba(224, 123, 57, 0.4);
      color: $primary-dark;
      font-size: 12.48px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: left;
      text-transform: uppercase;
      font-family: $font-main;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(224, 123, 57, 0.12);
      color: $text-dark;
      font-size: 14.4px;
      font-family: $font-main;
    }
  }

  &__thead {
    background: $primary;

    th {
      color: $bg_card;
      border-bottom-color: rgba(224, 123, 57, 0.3);
    }
  }

  &__cell {
    &--strong {
      font-weight: 600;
    }

    &--muted {
      color: $text-muted;
    }

    &--mono {
      font-family: monospace;
      font-size: 13.6px;
    }

    &--action {
      text-align: right;
      white-space: nowrap;
    }
  }

  &__edit-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 13px;
    border: 1.5px dashed $primary;
    border-radius: 8px;
    background: transparent;
    color: $primary-dark;
    font-size: 12.8px;
    font-weight: 600;
    font-family: $font-main;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;

    &:hover {
      background: $primary;
      border-style: solid;
      border-color: $primary;
      color: #fff;
    }
  }
}
</style>
