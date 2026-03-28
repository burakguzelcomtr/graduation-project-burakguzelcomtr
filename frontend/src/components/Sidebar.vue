<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { commonNavItems, studentNavItems, teacherNavItems } from '@/data/navItems.js'

const router = useRouter()
const auth = useAuthStore()
const collapsed = ref(false)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template lang="pug">
nav.lp-sidebar(:class="{ 'lp-sidebar--collapsed': collapsed }")
  .lp-sidebar__header
    router-link.lp-sidebar__brand(to="/dashboard") LearnPass
    button.lp-sidebar__toggle(@click="collapsed = !collapsed")
      span {{ collapsed ? '›' : '‹' }}

  ul.lp-sidebar__nav
    li.lp-sidebar__item(v-for="item in commonNavItems" :key="item.to")
      router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
        component.lp-sidebar__icon(:is="item.icon" v-if="item.icon")
        span.lp-sidebar__emoji(v-else) {{ item.emoji }}
        span.lp-sidebar__label {{ item.label }}
      span.lp-sidebar__tooltip {{ item.label }}

    template(v-if="auth.user?.role === 'student'")
      li.lp-sidebar__item(v-for="item in studentNavItems" :key="item.to")
        router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
          component.lp-sidebar__icon(:is="item.icon" v-if="item.icon")
          span.lp-sidebar__emoji(v-else) {{ item.emoji }}
          span.lp-sidebar__label {{ item.label }}
        span.lp-sidebar__tooltip {{ item.label }}

    template(v-if="auth.user?.role === 'teacher'")
      li.lp-sidebar__item(v-for="item in teacherNavItems" :key="item.to")
        router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
          span.lp-sidebar__emoji {{ item.emoji }}
          span.lp-sidebar__label {{ item.label }}
        span.lp-sidebar__tooltip {{ item.label }}

  .lp-sidebar__footer
    .lp-sidebar__user(v-if="auth.user")
      .lp-sidebar__avatar {{ auth.user.name?.[0] }}{{ auth.user.surname?.[0] }}
      .lp-sidebar__user-info
        .lp-sidebar__user-name {{ auth.user.name }} {{ auth.user.surname }}
        .lp-sidebar__user-role {{ auth.user.role }}
    button.lp-sidebar__logout(@click="handleLogout") Sign Out
</template>

<style lang="scss" scoped>
.lp-sidebar {
  position: sticky;
  top: 0;
  display: flex;
  width: 230px;
  min-width: 230px;
  height: 100vh;
  flex-shrink: 0;
  box-sizing: border-box;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem 0.75rem;
  border-right: 1px solid #eee;
  background: #fff;
  font-family: 'Fredoka', sans-serif;
  transition: width 0.25s ease, min-width 0.25s ease;

  &--collapsed {
    width: 64px;
    min-width: 64px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
    margin-bottom: 1.2rem;
    gap: 0.4rem;
  }

  &__brand {
    overflow: hidden;
    max-width: 160px;
    color: #de7534;
    font-size: 1.15rem;
    font-weight: 800;
    text-decoration: none;
    white-space: nowrap;
    transition: max-width 0.25s ease, opacity 0.2s ease;
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border: 1px solid #ffe0b2;
    border-radius: 8px;
    background: #fff3e0;
    color: #de7534;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #ffe0b2;
    }
  }

  &__nav {
    flex: 1;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    position: relative;
    margin: 0.15rem 0;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    color: #4a5568;
    font-size: 0.92rem;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: #de7534;
      color: #fff;
    }

    &--active {
      padding-left: calc(0.7rem - 3px);
      border-left: 3px solid #b85e22;
      background: #de7534;
      color: #fff;
      font-weight: 700;
    }
  }

  &__icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  &__emoji {
    min-width: 22px;
    flex-shrink: 0;
    font-size: 1rem;
    text-align: center;
  }

  &__label {
    overflow: hidden;
    max-width: 160px;
    white-space: nowrap;
    transition: max-width 0.25s ease, opacity 0.2s ease;
  }

  &__tooltip {
    position: absolute;
    top: 50%;
    left: calc(100% + 6px);
    z-index: 9999;
    display: none;
    padding: 5px 11px;
    transform: translateY(-50%);
    border-radius: 7px;
    background: #2d3748;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    pointer-events: none;
    white-space: nowrap;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-right-color: #2d3748;
    }
  }

  &__footer {
    margin-top: 0.85rem;
    padding-top: 0.85rem;
    border-top: 1px solid #eee;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.7rem;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #de7534;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
  }

  &__user-info {
    overflow: hidden;
    max-width: 160px;
    transition: max-width 0.25s ease, opacity 0.2s ease;
  }

  &__user-name {
    overflow: hidden;
    color: #2d3748;
    font-size: 0.85rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__user-role {
    color: #a0aec0;
    font-size: 0.72rem;
    text-transform: capitalize;
  }

  &__logout {
    width: 100%;
    max-width: 220px;
    overflow: hidden;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    background: transparent;
    color: #718096;
    font-family: 'Fredoka', sans-serif;
    font-size: 0.88rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, color 0.15s, border-color 0.15s, max-width 0.25s ease, opacity 0.2s ease, padding 0.25s ease;

    &:hover {
      border-color: #fc8181;
      background: #fff0f0;
      color: #e53e3e;
    }
  }

  &--collapsed {
    .lp-sidebar__brand {
      max-width: 0;
      opacity: 0;
      pointer-events: none;
    }

    .lp-sidebar__header {
      justify-content: center;
    }

    .lp-sidebar__toggle {
      width: 36px;
      height: 36px;
    }

    .lp-sidebar__label {
      max-width: 0;
      opacity: 0;
    }

    .lp-sidebar__link {
      justify-content: center;
      gap: 0;

      &--active {
        padding-left: 0.55rem;
        border-left: none;
      }
    }

    .lp-sidebar__item:hover .lp-sidebar__tooltip {
      display: block;
    }

    .lp-sidebar__user {
      justify-content: center;
      margin-bottom: 0;
    }

    .lp-sidebar__user-info {
      max-width: 0;
      opacity: 0;
      pointer-events: none;
    }

    .lp-sidebar__logout {
      max-width: 0;
      height: 0;
      padding: 0;
      border: none;
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
