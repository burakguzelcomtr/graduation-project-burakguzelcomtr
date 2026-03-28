<script setup>
defineProps({
  loggedIn: { type: Boolean, default: false },
})
defineEmits(['loginClick'])
</script>

<template lang="pug">
section.lp-home-hero
    .container
        .row
          .lp-home-hero__overlay.col-12
          .lp-home-hero__content.col-12.mx-auto
            h1
                Your Passport to
                br
                a Better World.
            p  Through engaging tasks and unique English diplomacy courses, LearnPass teaches primary students to find their voice, solve global issues, and build a brighter future. 
            button.lp-home-hero__button(@click="$emit('loginClick')") {{ loggedIn ? 'Go to Dashboard' : 'Login' }} →
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.lp-home-hero {
  position: relative;
  min-height: 90vh;
  background: url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80') center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(10, 20, 40, 0.62);
  }

  &__content {
    position: relative;
    z-index: 1;
    color: #fff;
    max-width: 680px;
    padding: 0 1.5rem;



    p {
      font-size: 1rem;
      opacity: 0.88;
      line-height: 1.6;
      margin-bottom: 1.8rem;
    }
  }

  &__button {
    background: #fff;
    color: $text-dark;
    border: none;
    padding: 0.7rem 2rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
