<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { onMounted, watch } from 'vue'
import StudentDashboard from './StudentDashboard.vue'
import TeacherDashboard from './TeacherDashboard.vue'
const user = useUserStore()
const router = useRouter()

onMounted(() => {
	if (user.profile && user.profile.role !== 'student') {
		router.replace({ path: '/dashboard' })
	}
})

watch(() => user.profile, (p) => {
	if (p && p.role !== 'student') router.replace({ path: '/dashboard' })
})
</script>

<template lang="pug">
.lp-passport
	.lp-passport__content(v-if="user.profile?.role === 'student'")
		StudentDashboard
	.lp-passport__loading(v-else) Loading...
</template>

<style lang="scss" scoped>
.lp-passport {
	min-height: 100%;

	&__loading {
		padding: 32px;
		color: #718096;
	}
}
</style>
