<script>
import { nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'AiSessionDetailView',

  components: {
    PageHeader,
  },

  data() {
    return {
      chat: useChatStore(),
      newMessage: '',
    }
  },

  watch: {
    'chat.activeMessages.length'() {
      this.scrollToBottom()
    },
  },

  async mounted() {
    await this.chat.fetchSession(this.$route.params.sessionId)
    this.scrollToBottom()
  },

  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },

    async scrollToBottom() {
      await nextTick()
      this.$refs.messagesEnd?.scrollIntoView({ behavior: 'smooth' })
    },

    handleKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    },

    async sendMessage() {
      const text = this.newMessage.trim()
      if (!text) return
      this.newMessage = ''
      await this.chat.sendSessionMessage(text)
      this.scrollToBottom()
    },

    goBackToHistory() {
      this.$router.push({ name: 'ai-history' })
    },
  },
}
</script>

<template lang="pug">
section.lp-ai-session
  .lp-ai-session__back
    button.lp-ai-session__back-btn(@click="goBackToHistory")
      | ← Back to History

  .lp-ai-session__loading(v-if="chat.activeLoading")
    .lp-ai-session__spinner
    p Loading conversation...

  .lp-ai-session__error(v-else-if="chat.activeError")
    .lp-ai-session__error-icon ⚠️
    p {{ chat.activeError }}

  template(v-else-if="chat.activeSession")
    PageHeader(:title="chat.activeSession.title || 'Chat Session'")

    .lp-ai-session__meta
      span.lp-ai-session__badge(v-if="chat.activeSession.page") 📄 {{ chat.activeSession.page }}
      span.lp-ai-session__date {{ formatDate(chat.activeSession.updatedAt) }}

    .lp-ai-session__messages
      .lp-ai-session__message(
        v-for="(msg, i) in chat.activeMessages"
        :key="i"
        :class="`lp-ai-session__message--${msg.role}`"
      )
        .lp-ai-session__message-avatar(v-if="msg.role === 'assistant'") 🤖
        .lp-ai-session__message-avatar(v-else) 🧑‍🎓
        .lp-ai-session__message-block
          .lp-ai-session__message-bubble(v-text="msg.content")
          .lp-ai-session__message-time {{ formatDate(msg.createdAt) }}

      .lp-ai-session__thinking(v-if="chat.activeSending")
        .lp-ai-session__message-avatar 🤖
        .lp-ai-session__thinking-dots
          span
          span
          span

      div(ref="messagesEnd")

    .lp-ai-session__composer
      textarea.lp-ai-session__input(
        v-model="newMessage"
        placeholder="Continue the conversation..."
        rows="2"
        @keydown="handleKeydown"
        :disabled="chat.activeSending"
      )
      button.lp-ai-session__send-btn(
        @click="sendMessage"
        :disabled="chat.activeSending || !newMessage.trim()"
      )
        svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor")
          path(d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z")
</template>

<style lang="scss" scoped>
.lp-ai-session {
  font-family: 'Fredoka', 'Segoe UI', sans-serif;
  min-height: 100%;

  &__back {
    margin-bottom: 16px;
  }

  &__back-btn {
    background: #fff8f0;
    border: 1.5px dashed #de7534;
    color: #de7534;
    font-family: inherit;
    font-size: 14px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #ffe0b2;
    }
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    gap: 12px;
    color: #718096;
  }

  &__error { color: #e53e3e; }
  &__error-icon { font-size: 36px; }

  &__spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #ffe0b2;
    border-top-color: #de7534;
    border-radius: 50%;
    animation: lp-spin 0.8s linear infinite;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }

  &__badge {
    background: #fff3e0;
    color: #de7534;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid #ffe0b2;
  }

  &__date {
    font-size: 13px;
    color: #a0aec0;
  }

  &__messages {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-bottom: 16px;
  }

  &__thinking {
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }

  &__thinking-dots {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 18px;
    background: #fff;
    border: 1px dashed #ffe0b2;
    border-radius: 10px;
    border-bottom-left-radius: 4px;

    span {
      width: 7px;
      height: 7px;
      background: #de7534;
      border-radius: 50%;
      display: inline-block;
      opacity: 0.5;
      animation: lp-bounce 1.2s infinite ease-in-out;

      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }
  }

  &__message {
    display: flex;
    align-items: flex-start;
    gap: 12px;

    &--user {
      flex-direction: row-reverse;

      .lp-ai-session__message-bubble {
        background: #de7534;
        color: #fff;
        border-bottom-right-radius: 4px;
        box-shadow: 0 2px 8px rgba(222, 117, 52, 0.25);
      }

      .lp-ai-session__message-time {
        text-align: right;
      }
    }

    &--assistant {
      .lp-ai-session__message-bubble {
        background: #fff;
        color: #052852;
        border: 1px dashed #ffe0b2;
        border-bottom-left-radius: 4px;
        box-shadow: 0 2px 8px rgba(222, 117, 52, 0.08);
      }
    }

    &-avatar {
      font-size: 24px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    &-block {
      max-width: 640px;
    }

    &-bubble {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }

    &-time {
      font-size: 11px;
      color: #a0aec0;
      margin-top: 4px;
      padding: 0 4px;
    }
  }

  &__composer {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    margin-top: 20px;
    padding: 16px;
    background: #fff;
    border: 2px dashed #de7534;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(222, 117, 52, 0.1);
  }

  &__input {
    flex: 1;
    border: 1.5px solid #ffe0b2;
    border-radius: 10px;
    padding: 10px 14px;
    font-family: inherit;
    font-size: 14px;
    resize: none;
    outline: none;
    color: #052852;
    background: #fff8f0;
    transition: border-color 0.15s, background 0.15s;

    &:focus {
      border-color: #de7534;
      background: #fff;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  &__send-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #de7534;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: opacity 0.15s, transform 0.15s;

    svg {
      width: 18px;
      height: 18px;
      color: #fff;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }

    &:not(:disabled):hover {
      transform: scale(1.08);
    }
  }
}

@keyframes lp-spin {
  to { transform: rotate(360deg); }
}

@keyframes lp-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
</style>

