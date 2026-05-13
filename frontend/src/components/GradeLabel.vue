<script>
export default {
	name: 'GradeLabel',

	props: {
		grade: {
			type: [Number, String],
			default: null,
		},
	},

	computed: {
		label() {
			const g = this.grade == null ? null : Number(this.grade)

			if (!g) return 'Your Grade'

			const suffix = g === 1 ? 'st' : g === 2 ? 'nd' : g === 3 ? 'rd' : 'th'
			return `${g}${suffix} Grade`
		},
	},
}
</script>

<template>
	{{ label }}
</template>