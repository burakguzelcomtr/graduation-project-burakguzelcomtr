<script setup>
</script>

<template lang="pug">
section.lp-home-partners
  .lp-home-partners__marquee
    span 🇺🇳 United Nations
    span 🌍 UNESCO
    span 🎓 EdTech Global
    span 🤝 Peace Corps
    span 📘 Oxford Press
    span 🌐 World Bank
    span 🏫 IB Schools
    span 🛡 UNICEF
    span 🇺🇳 United Nations
    span 🌍 UNESCO
    span 🎓 EdTech Global
    span 🤝 Peace Corps
    span 📘 Oxford Press
    span 🌐 World Bank
    span 🏫 IB Schools
    span 🛡 UNICEF
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-partners {
  background: #f9f4ef;
  padding: 1.2rem 0;
  overflow: hidden;
  border-top: 1px solid #e8ddd5;
  border-bottom: 1px solid #e8ddd5;

  &__marquee {
    display: flex;
    gap: 3rem;
    white-space: nowrap;
    animation: scroll 22s linear infinite;

    span {
      color: $bg-brown;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
  }
}

@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
</style>
