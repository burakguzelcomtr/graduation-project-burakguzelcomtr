<script setup>
</script>

<template lang="pug">
footer.lp-home-footer
  .lp-home-footer__inner
    .lp-home-footer__brand
      span.lp-home-footer__brand-name LearnPass
      p Empowering the next generation of global citizens through language and diplomacy education.
    .lp-home-footer__contact
      h4 Contact
      p info@learnpass.edu
      p +90 212 000 00 00
    .lp-home-footer__links
      h4 Platform
      ul
        li: a(href="#") About Us
        li: a(href="#") Curriculum
        li: a(href="#") For Schools
        li: a(href="#") Privacy Policy
  .lp-home-footer__bottom
    p © {{ new Date().getFullYear() }} LearnPass. All rights reserved.
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-footer {
  background: $bg-dark;
  color: #ccc;
  padding: 3rem 2rem 1.5rem;

  &__inner {
    display: flex;
    gap: 3rem;
    max-width: 960px;
    margin: 0 auto 2rem;
    flex-wrap: wrap;
  }

  &__brand {
    flex: 2 1 240px;
  }

  &__brand-name {
    display: block;
    margin-bottom: 0.6rem;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
  }

  &__brand p {
    font-size: 0.85rem;
    line-height: 1.6;
    opacity: 0.75;
  }

  &__contact,
  &__links {
    flex: 1 1 140px;

    h4 {
      color: #fff;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
    }

    p {
      font-size: 0.85rem;
      margin-bottom: 0.3rem;
      opacity: 0.75;
    }
  }

  &__links ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 0.35rem;
    }

    a {
      color: #ccc;
      text-decoration: none;
      font-size: 0.85rem;
      opacity: 0.75;
      transition: opacity 0.2s;

      &:hover { opacity: 1; }
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1rem;
    text-align: center;

    p {
      font-size: 0.78rem;
      opacity: 0.5;
    }
  }
}
</style>
