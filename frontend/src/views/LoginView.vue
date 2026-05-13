<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginView',

  data() {
    return {
      auth: useAuthStore(),
      email: '',
      password: '',
      error: '',
      loading: false,
    }
  },

  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      try {
        await this.auth.login(this.email, this.password)
        this.$router.push('/dashboard')
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template lang="pug">
.lp-login
  .container
    .lp-login__row.row
      .lp-login__col.col-12.col-md-10.col-lg-8.col-xl-6
        .lp-login__card
          .lp-login__logo
            span.lp-login__logo-icon 🌍
            span.lp-login__logo-name LearnPass

          form(@submit.prevent="handleLogin")
            .lp-login__field
              label Email Address
              input(v-model="email" type="email" placeholder="your-email@learnpass.com" required)
            .lp-login__field
              label Password
              input(v-model="password" type="password" placeholder="***************" required)

            p.lp-login__error(v-if="error") {{ error }}

            button.lp-login__submit.btn(type="submit" :disabled="loading") {{ loading ? 'Signing in...' : 'Log In' }}

          router-link.lp-login__back(to="/") ← Back to home
</template>

<style lang="scss" scoped>
.lp-login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 0;
  background: #0d2044;
  font-family: 'Fredoka', sans-serif;

  &__row {
    justify-content: center;
  }

  &__card {
    width: 100%;
    max-width: 480px;
    padding: 44.8px 48px;
    border: 2px solid #e07b39;
    border-radius: 16px;
    background: #fff8f0;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35);
  }

  &__logo {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 4.8px;
    margin-bottom: 32px;
  }

  &__logo-icon {
    font-size: 56px;
  }

  &__logo-name {
    color: #c05c1a;
    font-size: 28.8px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    margin-bottom: 19.2px;

    label {
      margin-bottom: 6.4px;
      color: #e07b39;
      font-size: 16px;
      font-weight: 600;
    }

    input {
      padding: 12px 16px;
      border: 1.5px dashed #e07b39;
      border-radius: 6px;
      outline: none;
      background: #eef2ff;
      color: #1a202c;
      font-family: 'Fredoka', sans-serif;
      font-size: 16px;
      transition: border-color 0.2s, background 0.2s;

      &:focus {
        border-style: solid;
        border-color: #c05c1a;
        background: #e8ecff;
      }

      &::placeholder {
        color: #a0aec0;
      }
    }
  }

  &__error {
    margin: -6.4px 0 12.8px;
    color: #c53030;
    font-size: 14.4px;
  }

  &__submit {
    width: 100%;
    margin-top: 6.4px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #c05c1a;
    color: #fff;
    font-family: 'Fredoka', sans-serif;
    font-size: 17.6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;

    &:hover:not(:disabled) {
      background: #a04a12;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__back {
    display: block;
    margin-top: 22.4px;
    color: #c05c1a;
    font-size: 14.4px;
    text-align: center;
    text-decoration: none;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
}
</style>
