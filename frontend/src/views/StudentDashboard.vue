<script>
import { useUserStore } from '@/stores/user'
import { useLessonsStore } from '@/stores/lessons'

import PageHeader from '@/components/PageHeader.vue'
import StudentCurrentUnitCard from '@/components/student/StudentCurrentUnitCard.vue'
import StudentLessonList from '@/components/student/StudentLessonList.vue'
import StudentProgressSummary from '@/components/student/StudentProgressSummary.vue'
import StudentSummaryCard from '@/components/student/StudentSummaryCard.vue'

export default {
	name: 'StudentDashboard',

	components: {
		PageHeader,
		StudentCurrentUnitCard,
		StudentLessonList,
		StudentProgressSummary,
		StudentSummaryCard,
	},

	data() {
		return {
			user: useUserStore(),
			lessonsStore: useLessonsStore(),
			badgesEarned: 0,
			loading: false,
		}
	},

	computed: {
		lessonCards() {
			if (!this.user.classGroupKey) {
				return []
			}

			return this.lessonsStore.mainLessons[this.user.classGroupKey] ?? []
		},

		currentUnitData() {
			return this.lessonCards[0]?.units?.[0] ?? null
		},

		totalUnits() {
			return this.lessonCards.reduce((count, lesson) => count + (lesson.units?.length ?? 0), 0)
		},

		completedUnits() {
			return 0
		},

		courseProgress() {
			return 0
		},
	},

	async mounted() {
		if (!this.user.classGroupKey) {
			return
		}

		if (!this.lessonsStore.mainLessons[this.user.classGroupKey]) {
			this.loading = true
		}

		try {
			await this.lessonsStore.getMainLessons(this.user.classGroupKey)
		} finally {
			this.loading = false
		}
	},
}
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
