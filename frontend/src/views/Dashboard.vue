<script setup>
import { useUserStore } from '@/stores/user'
import StudentDashboard from './StudentDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'
const user = useUserStore() 
</script>

<template lang="pug">
.lp-dashboard
	StudentDashboard(v-if="user.profile?.role === 'student'")
	TeacherDashboard(v-else-if="user.profile?.role === 'teacher'")
	.lp-dashboard__loading(v-else) Loading...
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
