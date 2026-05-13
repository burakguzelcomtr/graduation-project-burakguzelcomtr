<script>
export default {
  name: 'HomeFooter',
}
</script>

<template lang="pug">
footer.lp-home-footer
    .lp-home-footer__inner
      .lp-home-footer__brand
        span.lp-home-footer__brand-name LearnPass
        p Empowering the next generation of global citizens through language and diplomacy education.
      .lp-home-footer__col
        h4 Platform
        ul
          li: a(href="#") About Us
          li: a(href="#") Curriculum
          li: a(href="#") For Schools
          li: a(href="#") Privacy Policy
      .lp-home-footer__col
        h4 Help
        ul
          li: a(href="#") FAQ
          li: a(href="#") Contact
          li: a(href="#") Terms & Conditions
          li: a(href="#") Cookie Policy
      .lp-home-footer__col
        h4 Contact
        p info@learnpass.edu
        p +90 212 000 00 00
    .lp-home-footer__bottom
      p © {{ new Date().getFullYear() }} LearnPass. All rights reserved.
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-footer {
  background: $bg-dark;
  color: #ccc;
  padding: 56px 32px 24px;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 24px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__brand-name {
    display: block;
    margin-bottom: 12px;
    color: #fff;
    font-size: 26px;
    font-weight: 800;
  }

  &__brand p {
    font-size: 15px;
    line-height: 1.6;
    opacity: 0.65;
  }

  &__col {
    h4 {
      color: #fff;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 16px;
      font-weight: 700;
    }

    p {
      font-size: 15px;
      opacity: 0.65;
      margin-bottom: 4px;
    }

    ul {
      list-style: none;
      padding: 0;

      li { margin-bottom: 10px; }

      a {
        color: #ccc;
        text-decoration: none;
        font-size: 15px;
        opacity: 0.65;
        transition: opacity 0.2s;

        &:hover { opacity: 1; }
      }
    }
  }

  &__bottom {
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;

    p {
      font-size: 12px;
      opacity: 0.4;
    }
  }
}
</style>
