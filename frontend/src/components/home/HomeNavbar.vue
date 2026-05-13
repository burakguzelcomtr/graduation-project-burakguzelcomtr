<script>
export default {
  name: 'HomeNavbar',

  emits: ['loginClick'],

  props: {
    loggedIn: { type: Boolean, default: false },
  },
}
</script>

<template lang="pug">
header.lp-home-nav
  .lp-home-nav__inner
    .lp-home-nav__brand
      span.lp-home-nav__brand-icon 🌍
      span.lp-home-nav__brand-name LearnPass
    nav.lp-home-nav__links
      a(href="#") Home
      a(href="#why") Features
      a(href="#journey") How It Works
      a(href="#testimonials") Stories
      a(href="#about") About
    .lp-home-nav__actions
      button.lp-home-nav__login.btn(type="button" @click="$emit('loginClick')") {{ loggedIn ? 'Dashboard →' : 'Login →' }}
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #f7f2e8;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
    height: 72px;
    display: flex;
    align-items: center;
    gap: 40px;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__brand-icon {
    font-size: 30px;
  }

  &__brand-name {
    color: $text-dark;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 32px;
    flex: 1;
    justify-content: center;
    a {
      color: #3a2a1a;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      transition: color 0.2s;

      &:hover {
        color: $primary;
      }
    }
  }

  &__actions {
    flex-shrink: 0;
  }

  &__login {
    padding: 10px 26px;
    border-radius: 24px;
    background: $primary;
    color: #fff;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: $primary-dark;
      color: #fff;
    }
  }
}
</style>
