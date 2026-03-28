<script setup>
import { computed } from 'vue'

const props = defineProps({
	grade: {
		type: [Number, String],
		default: null,
	},
})

const label = computed(() => {
	const g = props.grade == null ? null : Number(props.grade)

	if (!g) return 'Your Grade'

	const suffix = g === 1 ? 'st' : g === 2 ? 'nd' : g === 3 ? 'rd' : 'th'
	return `${g}${suffix} Grade`
})
</script>

<template>
	{{ label }}
</template>