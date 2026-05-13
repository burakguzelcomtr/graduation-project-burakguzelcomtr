<script>
export default {
  name: 'HomePartners',
}
</script>

<template lang="pug">
section.lp-home-partners
  .lp-home-partners__inner
    p.lp-home-partners__label Trusted by schools & aligned with global organizations
    .lp-home-partners__marquee
      span United Nations
      span UNESCO
      span EdTech Global
      span Peace Corps
      span Oxford Press
      span World Bank
      span IB Schools
      span UNICEF
      span United Nations
      span UNESCO
      span EdTech Global
      span Peace Corps
      span Oxford Press
      span World Bank
      span IB Schools
      span UNICEF
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-partners {
  background: #fff;
  padding: 32px 0;
  overflow: hidden;
  border-top: 1px solid #f0e8e0;
  border-bottom: 1px solid #f0e8e0;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 32px;
  }

  &__label {
    text-align: center;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #aaa;
    margin-bottom: 22px;
  }

  &__marquee {
    display: flex;
    gap: 64px;
    white-space: nowrap;
    animation: scroll 24s linear infinite;

    span {
      color: #bbb;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
  }
}

@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
