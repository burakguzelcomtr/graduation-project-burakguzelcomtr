<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeNavbar from '@/components/home/HomeNavbar.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomePartners from '@/components/home/HomePartners.vue'
import HomeWhy from '@/components/home/HomeWhy.vue'
import HomeJourney from '@/components/home/HomeJourney.vue'
import HomeTestimonials from '@/components/home/HomeTestimonials.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'

const router = useRouter()
const auth = useAuthStore()

function handleLoginClick() {
  router.push(auth.user ? '/dashboard' : '/login')
}
</script>

<template lang="pug">
.lp-home
  HomeNavbar(:loggedIn="!!auth.user" @loginClick="handleLoginClick")
  HomeHero(:loggedIn="!!auth.user" @loginClick="handleLoginClick")
  HomePartners
  HomeWhy
  HomeJourney
  HomeTestimonials
  HomeFooter
</template>

<style lang="scss" scoped>
.lp-home {
  display: flex;
  flex-direction: column;
}
</style>
