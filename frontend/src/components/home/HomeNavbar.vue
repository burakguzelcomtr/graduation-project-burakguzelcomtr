<script setup>
defineProps({
  loggedIn: { type: Boolean, default: false },
})
defineEmits(['loginClick'])
</script>

<template lang="pug">
header.lp-home-nav
    .container
        .row.lp-home-nav__row
            .col-7.col-md-8
              .lp-home-nav__brand
                span.lp-home-nav__brand-icon 🌍
                span.lp-home-nav__brand-name LearnPass
            .col-5.col-md-4
              .lp-home-nav__actions
                button.lp-home-nav__login.btn(type="button" @click="$emit('loginClick')") {{ loggedIn ? 'Go to Dashboard' : 'Login' }} →
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 19.2px 48px;

  &__row {
    align-items: center;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 10.4px;
  }

  &__actions {
    text-align: right;
  }

  &__brand-icon {
    font-size: 28.8px;
  }

  &__brand-name {
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__login {
    padding: 7.2px 19.2px;
    border: 2px solid #fff;
    border-radius: 6px;
    background: transparent;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: #fff;
      color: $text-dark;
    }
  }
}
</style>
