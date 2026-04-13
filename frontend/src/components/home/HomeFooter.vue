<script setup>
</script>

<template lang="pug">
footer.lp-home-footer
  .container
    .lp-home-footer__inner.row
      .lp-home-footer__brand.col-12.col-lg-5
        span.lp-home-footer__brand-name LearnPass
        p Empowering the next generation of global citizens through language and diplomacy education.
      .lp-home-footer__contact.col-12.col-md-6.col-lg-3
        h4 Contact
        p info@learnpass.edu
        p +90 212 000 00 00
      .lp-home-footer__links.col-12.col-md-6.col-lg-4
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
  padding: 48px 32px 24px;

  &__inner {
    --bs-gutter-x: 48px;
    --bs-gutter-y: 32px;
    max-width: 960px;
    margin: 0 auto 32px;
  }

  &__brand-name {
    display: block;
    margin-bottom: 9.6px;
    color: #fff;
    font-size: 22.4px;
    font-weight: 700;
  }

  &__brand p {
    font-size: 13.6px;
    line-height: 1.6;
    opacity: 0.75;
  }

  &__contact,
  &__links {
    h4 {
      color: #fff;
      font-size: 13.6px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 12px;
    }

    p {
      font-size: 13.6px;
      margin-bottom: 4.8px;
      opacity: 0.75;
    }
  }

  &__links ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 5.6px;
    }

    a {
      color: #ccc;
      text-decoration: none;
      font-size: 13.6px;
      opacity: 0.75;
      transition: opacity 0.2s;

      &:hover { opacity: 1; }
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 16px;
    text-align: center;

    p {
      font-size: 12.48px;
      opacity: 0.5;
    }
  }
}
</style>
