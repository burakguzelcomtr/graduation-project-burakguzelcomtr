<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/PageHeader.vue'

const user = useUserStore()
const studentsStore = useStudentsStore()
const loading = ref(false)
const error = ref('')
const students = computed(() => {
  if (!user.classGroupKey) {
    return []
  }

  return studentsStore.studentsByClassGroup[user.classGroupKey] ?? []
})

onMounted(async () => {
  if (!user.classGroupKey) {
    error.value = 'No class group assigned to your account.'
    return
  }

  if (!studentsStore.studentsByClassGroup[user.classGroupKey]) {
    loading.value = true
  }

  try {
    error.value = ''
    await studentsStore.getStudentsByClassGroup()
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Failed to fetch students.'
  } finally {
    loading.value = false
  }
})
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
                <th>Grade</th>
                <th>Section</th>
                <th>Campus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, i) in students" :key="student._id">
                <td class="lp-teacher-students__cell lp-teacher-students__cell--muted">{{ i + 1 }}</td>
                <td class="lp-teacher-students__cell lp-teacher-students__cell--strong">{{ student.name }}</td>
                <td>{{ student.surname }}</td>
                <td class="lp-teacher-students__cell lp-teacher-students__cell--mono">{{ student.studentId ?? '—' }}</td>
                <td>{{ student.grade }}</td>
                <td>{{ student.section }}</td>
                <td>{{ student.campus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lp-teacher-students {
  padding: 24px 0;

  &__count {
    padding: 4px 11.2px;
    border-radius: 20px;
    background: #ebf8ff;
    color: #2b6cb0;
    font-size: 12.8px;
    font-weight: 700;
  }

  &__state {
    padding: 16px 0;
    color: #718096;
    font-size: 15.2px;

    &--error {
      color: #e53e3e;
    }
  }

  &__table-wrap {
    overflow: hidden;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: #f7fafc;
    }

    th {
      padding: 12px 16px;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
      font-size: 12.48px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: left;
      text-transform: uppercase;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f4f8;
      color: #2d3748;
      font-size: 14.4px;
    }
  }

  &__thead {
    background: #f7fafc;
  }

  &__cell {
    &--strong {
      font-weight: 600;
    }

    &--muted {
      color: #a0aec0;
    }

    &--mono {
      font-family: monospace;
      font-size: 13.6px;
    }
  }
}
</style>
