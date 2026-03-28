<script setup>
import { useAuthStore } from '@/stores/auth'
import StudentDashboard from './StudentDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'

const auth = useAuthStore()
</script>

<template lang="pug">
.lp-dashboard
	StudentDashboard(v-if="auth.user?.role === 'student'")
	TeacherDashboard(v-else-if="auth.user?.role === 'teacher'")
	.lp-dashboard__loading(v-else) Yükleniyor...
</template>

<style lang="scss" scoped>
.lp-dashboard {
	min-height: 100%;

	&__loading {
		padding: 2rem;
		color: #718096;
	}
}
</style>
