<script>
import Flipbook from 'flipbook-vue'
import { useUserStore } from '@/stores/user'
import PageHeader from '@/components/PageHeader.vue'

const PASSPORT_PAGE_COUNT = 14
const passportPages = Array.from({ length: PASSPORT_PAGE_COUNT }, (_, i) => {
	const n = i + 1
	return `/assets/img/grade3-passport/${n}.webp`
})

export default {
	name: 'PassportView',

	components: {
		Flipbook,
		PageHeader,
	},

	data() {
		return {
			user: useUserStore(),
			passportPages,
		}
	},

	computed: {
		profile() {
			return this.user.profile ?? {}
		},
	},

	watch: {
		'user.profile'(profile) {
			this.redirectNonStudent(profile)
		},
	},

	mounted() {
		this.redirectNonStudent(this.user.profile)
	},

	methods: {
		redirectNonStudent(profile) {
			if (profile && profile.role !== 'student') {
				this.$router.replace({ path: '/dashboard' })
			}
		},
	},
}
</script>

<template lang="pug">
section.lp-passport.container-fluid
	PageHeader(title="My Passport" subtitle="Your student profile and selections")

	.row
		.col-12
			.lp-passport__card.lp-passport__card--fullwidth
				p.lp-passport__hint Flip through your Grade 3 passport pages. Drag corners or swipe to turn.
				.lp-passport__flipbook-wrap
					Flipbook.lp-passport__flipbook(
						:pages="passportPages"
						:zooms="null"
						:click-to-zoom="false"
						:n-polygons="6"
						:flip-duration="750"
					)
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-passport {
	padding: 24px 0;
	font-family: $font-main;

	&__card {
		background: $bg_card;
		border: 2px dashed $primary;
		border-radius: 16px;
		padding: 28px;
		width: 100%;
		box-sizing: border-box;
	}

	&__hint {
		color: $text-muted;
		font-size: 0.95rem;
		margin-bottom: 16px;
	}

	&__flipbook-wrap {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	&__flipbook {
		width: min(100%, 960px);
		height: clamp(280px, 65vh, 720px);
	}

	&__avatar {
		display:flex;
		flex-direction:column;
		align-items:center;
		gap:12px;
		img { width:120px; height:120px; border-radius:12px; object-fit:cover }
	}

	&__panels { display:flex; flex-direction:column; gap:12px }
	&__panel { background:#fff; border-radius:8px; padding:14px; box-shadow:0 2px 8px rgba(13,32,68,0.06) }
	&__panel-header { background:$bg-dark; color:$primary; padding:8px 12px; border-radius:6px; display:inline-block; font-weight:600 }
	&__panel-body { padding:16px; display:flex; align-items:center; gap:12px }
	&__hero, &__flag { width:96px; height:96px; object-fit:contain }
	&__panel-name { font-weight:700; color:$text-dark }
	&__empty { color:$text-muted }
}
</style>
