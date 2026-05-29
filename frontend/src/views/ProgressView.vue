<script>
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ProgressView',

  components: {
    PageHeader,
  },
}
</script>

<template lang="pug">
section.lp-progress
  PageHeader(title="Progress" subtitle="Track your learning journey")

  .lp-progress__content
    .lp-progress__construction
      .lp-progress__construction-icon 🚧
      h3 Under Construction
      p This page is coming soon. Check back later!
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-progress {
  font-family: $font-main;
  min-height: 100%;

  &__content {
    padding: 24px 8px 0;
  }

  &__construction {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 80px 24px;
    text-align: center;
    color: #999;

    &-icon {
      font-size: 64px;
    }

    h3 {
      font-size: 24px;
      font-weight: 700;
      color: $text-dark;
      margin: 0;
    }

    p {
      font-size: 15px;
      margin: 0;
    }
  }
}
</style>
