<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template lang="pug">
.lp-page-header
  .lp-page-header__main
    h1.lp-page-header__title {{ title }}
    p.lp-page-header__subtitle(v-if="subtitle") {{ subtitle }}
  .lp-page-header__side(v-if="$slots.default")
    img.animated_badge(src="/assets/img/students-width-baloons.svg" alt="Header decoration" width="160")
    slot
</template>

<style lang="scss" scoped>
.lp-page-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
  padding: 48px 48px 72px;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  background: linear-gradient(236deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: lp-header-gradient-animation 15s ease infinite;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(50% - 250px);
    width: 500px;
    height: 160px;
    opacity: 0;
    background-image: url('/assets/img/student-hands.svg');
    background-repeat: no-repeat;
    background-size: 100%;
    transform: translateY(20px) translateX(0);
    will-change: transform, opacity;
    animation:
      lp-header-slide-up 700ms cubic-bezier(.22, .9, .35, 1) 150ms forwards,
      lp-header-float-side 9600ms ease-in-out 900ms infinite;
  }

  &__main {
    min-width: 0;
  }

  &__title {
    margin: 0;
    color: #fff;
    font-size: 48px;
    white-space: pre-line;
  }

  &__subtitle {
    margin: 0.35rem 0 0;
    color: #fff;
    font-size: 0.92rem;
  }

  &__side {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    .animated_badge { animation:
      lp-header-slide-up 700ms cubic-bezier(.22, .9, .35, 1) 150ms forwards,
      lp-header-float-side2 24600ms ease-in-out 900ms infinite;
    }
  }
}

@keyframes lp-header-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) translateX(0);
  }

  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

@keyframes lp-header-float-side {
  0% {
    transform: translateY(0) translateX(0);
  }

  50% {
    transform: translateY(0) translateX(15px);
  }

  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes lp-header-float-side2 {
  0% {
    transform: translateY(0) translateX(0);
  }

  25% {
    transform: translateY(5px) translateX(18px);
  }
  50% {
    transform: translateY(0) translateX(0);
  }
  75% {
    transform: translateY(-5px) translateX(18px);
  }

  100% {
    transform: translateY(0) translateX(0);
  }
}

@keyframes lp-header-gradient-animation {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 900px) {
  .lp-page-header {
    align-items: stretch;
    flex-direction: column;

    &__side {
      width: 100%;
    }
  }
}
</style>
