<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLessonsStore } from '@/stores/lessons'

import PageHeader from '@/components/PageHeader.vue'
import StudentCurrentUnitCard from '@/components/student/StudentCurrentUnitCard.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import StudentSummaryCard from '@/components/student/StudentSummaryCard.vue'

const auth = useAuthStore()
const lessonsStore = useLessonsStore()
const badgesEarned = 0
const loading = ref(false)

const classGroupId = computed(() => auth.user?.classGroup ?? null)

onMounted(async () => {
	if (!classGroupId.value) {
		return
	}

	if (!lessonsStore.mainLessons[classGroupId.value]) {
		loading.value = true
	}

	try {
		await lessonsStore.getMainLessons(classGroupId.value)
	} finally {
		loading.value = false
	}
})

const lessonCards = computed(() => {
	if (!classGroupId.value) {
		return []
	}

	return lessonsStore.mainLessons[classGroupId.value] ?? []
})
const currentUnitData = computed(() => lessonCards.value[0]?.units?.[0] ?? null)

const totalUnits = computed(() => lessonCards.value.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0))
const completedUnits = computed(() => 0)
const courseProgress = computed(() => 0)
</script>

<template lang="pug">
.lp-student-dashboard
	.lp-student-dashboard__loading(v-if="loading")
		span Loading your dashboard...

	template(v-else)
		PageHeader(
			:title="`Welcome back\n${auth.user.name} ${auth.user.surname ?? ''}`"
		)
			StudentProgressSummary(
				:current-lesson="currentUnitData?.title ?? '—'"
				:course-progress="courseProgress"
				:badges-earned="badgesEarned"
				:completed-units="completedUnits"
				:total-units="totalUnits"
			)
 
		StudentCurrentUnitCard(
			:current-lesson="currentUnitData?.title ?? '—'"
			:current-lesson-desc="currentUnitData?.description ?? '—'"
		)

		.lp-student-dashboard__empty(v-if="!lessonCards.length")
			p No lessons have been assigned to your class yet.

		.lp-student-dashboard__grid(v-else)
			StudentSummaryCard(
				:user="auth.user"
				:badges-earned="badgesEarned"
				:total-units="totalUnits"
				:completed-units="completedUnits"
				:course-progress="courseProgress"
				continue-route="/units"
				continue-label="Continue Learning ›"
			)

			StudentLessonList(:lesson-cards="lessonCards")
</template>

<style lang="scss" scoped>
.lp-student-dashboard {
	padding: 1.5rem;
	font-family: 'Fredoka', sans-serif;

	&__loading {
		padding: 2rem;
		color: #a0aec0;
		font-size: 0.95rem;
	}

	&__empty {
		padding: 1.5rem;
		color: #a0aec0;
		font-size: 0.95rem;
		text-align: center;
	}

	&__grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1.4rem;
		align-items: start;
	}
}

@media (max-width: 900px) {
	.lp-student-dashboard {
		&__grid {
			grid-template-columns: 1fr;
		}
	}
}
</style>
