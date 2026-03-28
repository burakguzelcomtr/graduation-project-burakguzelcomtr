<script setup>
defineProps({
  loggedIn: { type: Boolean, default: false },
})
defineEmits(['loginClick'])
</script>

<template lang="pug">
header.lp-home-nav
    .container
        .row
            .col-6
              span.lp-home-nav__brand-icon 🌍
              span.lp-home-nav__brand-name LearnPass
            .col-6.text-end
              button.lp-home-nav__login(@click="$emit('loginClick')") {{ loggedIn ? 'Go to Dashboard' : 'Login' }} →
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 3rem;

  &__brand-icon {
    font-size: 1.8rem;
  }

  &__brand-name {
    color: #fff;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__login {
    padding: 0.45rem 1.2rem;
    border: 2px solid #fff;
    border-radius: 6px;
    background: transparent;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: #fff;
      color: $text-dark;
    }
  }
}
</style>
