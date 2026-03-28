<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentsStore } from '@/stores/students'
import PageHeader from '@/components/PageHeader.vue'

const auth = useAuthStore()
const studentsStore = useStudentsStore()
const loading = ref(false)
const error = ref('')
const classGroupId = computed(() => auth.user?.classGroup?._id ?? auth.user?.classGroup ?? null)
const students = computed(() => {
  if (!classGroupId.value) {
    return []
  }

  return studentsStore.studentsByClassGroup[classGroupId.value] ?? []
})

onMounted(async () => {
  if (!classGroupId.value) {
    error.value = 'No class group assigned to your account.'
    return
  }

  if (!studentsStore.studentsByClassGroup[classGroupId.value]) {
    loading.value = true
  }

  try {
    error.value = ''
    await studentsStore.getStudentsByClassGroup(classGroupId.value)
  } catch (e) {
    error.value = e.response?.data?.error || e.message || 'Failed to fetch students.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="lp-teacher-students">
    <PageHeader title="My Students">
      <span class="lp-teacher-students__count" v-if="students.length">{{ students.length }} students</span>
    </PageHeader>

    <div class="lp-teacher-students__state" v-if="loading">Loading students...</div>
    <div class="lp-teacher-students__state lp-teacher-students__state--error" v-else-if="error">{{ error }}</div>
    <div class="lp-teacher-students__state" v-else-if="students.length === 0">No students found in your class.</div>

    <div class="lp-teacher-students__table-wrap" v-else>
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
</template>

<style lang="scss" scoped>
.lp-teacher-students {
  padding: 1.5rem;

  &__count {
    padding: 0.25rem 0.7rem;
    border-radius: 20px;
    background: #ebf8ff;
    color: #2b6cb0;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__state {
    padding: 1rem 0;
    color: #718096;
    font-size: 0.95rem;

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
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-align: left;
      text-transform: uppercase;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f0f4f8;
      color: #2d3748;
      font-size: 0.9rem;
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
      font-size: 0.85rem;
    }
  }
}
</style>
