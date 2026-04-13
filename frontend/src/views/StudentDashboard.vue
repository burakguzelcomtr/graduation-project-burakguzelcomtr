<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLessonsStore } from '@/stores/lessons'

import PageHeader from '@/components/PageHeader.vue'
import StudentCurrentUnitCard from '@/components/student/StudentCurrentUnitCard.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import StudentSummaryCard from '@/components/student/StudentSummaryCard.vue'

const user = useUserStore()
const lessonsStore = useLessonsStore()
const badgesEarned = 0
const loading = ref(false)

const classGroupId = computed(() => user.profile?.classGroup ?? null)

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
section.lp-student-dashboard.container-fluid
	.lp-student-dashboard__loading(v-if="loading")
		span Loading your dashboard...

	template(v-else)
		PageHeader(
			:title="`Welcome back\n${user.profile.name} ${user.profile.surname ?? ''}`"
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

		.lp-student-dashboard__grid.border-gradient(v-else)
			.row
				.lp-student-dashboard__col.col-12.col-xl-4
					StudentSummaryCard(
						:user="user.profile"
						:badges-earned="badgesEarned"
						:total-units="totalUnits"
						:completed-units="completedUnits"
						:course-progress="courseProgress"
						continue-route="/units"
						continue-label="Continue Learning ›"
					)

				.lp-student-dashboard__col.col-12.col-xl-8
					StudentLessonList(:lesson-cards="lessonCards")
				 
	</template>

<style lang="scss" scoped>
.lp-student-dashboard {
	padding: 24px 0;
	font-family: 'Fredoka', sans-serif;
	&__loading {
		padding: 32px;
		color: #a0aec0;
		font-size: 15.2px;
	}

	&__empty {
		padding: 24px;
		color: #a0aec0;
		font-size: 15.2px;
		text-align: center;
	}

	&__grid { 
		align-items: start;
		border-radius: 15px; 
		padding: 15px;
		background:#fff;
	}
}
</style>
