<script>
import { useAuthStore } from '@/stores/auth'
import { commonNavItems, studentNavItems, teacherNavItems } from '@/data/navItems.js'
import { useUserStore } from '@/stores/user'

export default {
  name: 'AppSidebar',

  data() {
    return {
      auth: useAuthStore(),
      user: useUserStore(),
      collapsed: false,
      commonNavItems,
      studentNavItems,
      teacherNavItems,
    }
  },

  methods: {
    async handleLogout() {
      await this.auth.logout()
      this.$router.push('/')
    },
  },
}
</script>

<template lang="pug">
nav.lp-sidebar(:class="{ 'lp-sidebar--collapsed': collapsed }")
  .lp-sidebar__header
    router-link.lp-sidebar__brand(to="/dashboard") LearnPass
    button.lp-sidebar__toggle.btn(type="button" @click="collapsed = !collapsed")
      span {{ collapsed ? '›' : '‹' }}

  ul.lp-sidebar__nav
    li.lp-sidebar__item(v-for="item in commonNavItems" :key="item.to")
      router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
        component.lp-sidebar__icon(:is="item.icon" v-if="item.icon")
        span.lp-sidebar__emoji(v-else) {{ item.emoji }}
        span.lp-sidebar__label {{ item.label }}
      span.lp-sidebar__tooltip {{ item.label }}

    template(v-if="user.profile?.role === 'student'")
      li.lp-sidebar__item(v-for="item in studentNavItems" :key="item.to")
        router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
          component.lp-sidebar__icon(:is="item.icon" v-if="item.icon")
          span.lp-sidebar__emoji(v-else) {{ item.emoji }}
          span.lp-sidebar__label {{ item.label }}
        span.lp-sidebar__tooltip {{ item.label }}

    template(v-if="user.profile?.role === 'teacher'")
      li.lp-sidebar__item(v-for="item in teacherNavItems" :key="item.to")
        router-link.lp-sidebar__link(:to="item.to" active-class="lp-sidebar__link--active")
          component.lp-sidebar__icon(:is="item.icon" v-if="item.icon")
          span.lp-sidebar__emoji(v-else) {{ item.emoji }}
          span.lp-sidebar__label {{ item.label }}
        span.lp-sidebar__tooltip {{ item.label }}

  .lp-sidebar__footer
    .lp-sidebar__user(v-if="user.profile")
      .lp-sidebar__avatar {{ user.profile.name?.[0] }}{{ user.profile.surname?.[0] }}
      .lp-sidebar__user-info
        .lp-sidebar__user-name {{ user.profile.name }} {{ user.profile.surname }}
        .lp-sidebar__user-role {{ user.profile.role }}
    button.lp-sidebar__logout.btn(type="button" @click="handleLogout") Sign Out
</template>

<style lang="scss" scoped>
.lp-sidebar {
  position: sticky;
  top: 0;
  display: flex;
  width: 260px;
  min-width: 230px;
  height: 100vh;
  flex-shrink: 0; 
  box-sizing: border-box;
  flex-direction: column; 
  padding: 16px 12px;
  border-right: 1px solid #eee;
  background: #fff;
  font-family: 'Fredoka', sans-serif;
  transition: width 0.25s ease, min-width 0.25s ease; 
  z-index: 2;
  &--collapsed {
    width: 64px;
    min-width: 64px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36px;
    margin-bottom: 19.2px;
    gap: 6.4px;
  }

  &__brand {
    overflow: hidden;
    max-width: 160px;
    color: #de7534;
    font-size: 18.4px;
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
    font-size: 16px;
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
    margin: 2.4px 0;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
    padding: 12px 16px;
    border-radius: 8px;
    color: #4a5568;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: .5px;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;

    &:hover {
      background: #de7534;
      color: #fff;
    }

    &--active {
      padding-left: calc(11.2px - 3px);
      border-left: 3px solid #b85e22;
      background: #de7534;
      color: #fff;
      font-weight: 600;
    }
  }

  &__icon {
    width: 32px;
    height: 36px;
    flex-shrink: 0;
  }

  &__emoji {
    min-width: 22px;
    flex-shrink: 0;
    font-size: 16px;
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
    z-index: 99999;
    display: none;
    padding: 5px 11px;
    transform: translateY(-50%);
    border-radius: 7px;
    background: #2d3748;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: #fff;
    font-size: 12.8px;
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
    margin-top: 13.6px;
    padding-top: 13.6px;
    border-top: 1px solid #eee;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 9.6px;
    margin-bottom: 11.2px;
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
    font-size: 12.8px;
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
    font-size: 13.6px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__user-role {
    color: #a0aec0;
    font-size: 11.52px;
    text-transform: capitalize;
  }

  &__logout {
    width: 100%;
    max-width: 220px;
    overflow: hidden;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    background: transparent;
    color: #718096;
    font-family: 'Fredoka', sans-serif;
    font-size: 14.08px;
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
      padding: 8px;
      &--active { 
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
