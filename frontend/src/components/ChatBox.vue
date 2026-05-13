<script>
import { nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

export default {
  data() {
    return {
      chat: useChatStore(),
      isOpen: false,
      inputText: '',
    }
  },

  watch: {
    isOpen(val) {
      if (val) this.scrollToBottom()
    },
  },

  methods: {
    getPageContext() {
      return {
        page: this.$route.name || this.$route.path,
        pageContext: this.$route.meta?.pageContext || null,
      }
    },

    async sendMessage() {
      const text = this.inputText.trim()
      if (!text || this.chat.loading) return
      this.inputText = ''
      const { page, pageContext } = this.getPageContext()
      await this.chat.sendMessage(text, page, pageContext)
      this.scrollToBottom()
    },

    startNewChat() {
      this.chat.startNewChat()
    },

    handleKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    },

    async scrollToBottom() {
      await nextTick()
      this.$refs.messagesEnd?.scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>

<template lang="pug">
teleport(to="body")
  .lp-chatbox
    //- Floating trigger button
    button.lp-chatbox__trigger(
      @click="isOpen = !isOpen"
      :class="{ 'lp-chatbox__trigger--open': isOpen }"
      aria-label="AI Assistant"
    )
      svg(v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        path(d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z")
        circle(cx="9" cy="10" r="1" fill="currentColor" stroke="none")
        circle(cx="12" cy="10" r="1" fill="currentColor" stroke="none")
        circle(cx="15" cy="10" r="1" fill="currentColor" stroke="none")
      svg(v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round")
        line(x1="18" y1="6" x2="6" y2="18")
        line(x1="6" y1="6" x2="18" y2="18")

    //- Chat panel
    transition(name="lp-chatbox-slide")
      .lp-chatbox__panel(v-if="isOpen")
        .lp-chatbox__header
          .lp-chatbox__header-info
            .lp-chatbox__avatar 🤖
            .lp-chatbox__header-text
              strong Study Buddy
              span Your AI learning assistant
          button.lp-chatbox__new-btn(@click="startNewChat" title="New chat") ＋ New chat

        .lp-chatbox__body
          .lp-chatbox__welcome(v-if="chat.messages.length === 0")
            .lp-chatbox__welcome-emoji 👋
            p Hello! I'm your study buddy.
            p Ask me anything about your lessons!

          .lp-chatbox__messages(v-else)
            .lp-chatbox__message(
              v-for="(msg, i) in chat.messages"
              :key="i"
              :class="`lp-chatbox__message--${msg.role}`"
            )
              .lp-chatbox__message-avatar(v-if="msg.role === 'assistant'") 🤖
              .lp-chatbox__message-bubble {{ msg.content }}

            .lp-chatbox__thinking(v-if="chat.loading")
              .lp-chatbox__message-avatar 🤖
              .lp-chatbox__message-bubble.lp-chatbox__thinking-dots
                span
                span
                span

            div(ref="messagesEnd")

        .lp-chatbox__footer
          .lp-chatbox__input-row
            textarea.lp-chatbox__input(
              v-model="inputText"
              placeholder="Ask me anything..."
              rows="1"
              @keydown="handleKeydown"
              :disabled="chat.loading"
            )
            button.lp-chatbox__send-btn(
              @click="sendMessage"
              :disabled="chat.loading || !inputText.trim()"
            )
              svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor")
                path(d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z")
</template>

<style lang="scss" scoped>
.lp-chatbox {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: 'Fredoka', 'Segoe UI', sans-serif;

  &__trigger {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #de7534;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(222, 117, 52, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-left: auto;

    svg {
      width: 26px;
      height: 26px;
      color: #fff;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 22px rgba(222, 117, 52, 0.55);
    }

    &--open {
      background: #c05c1a;
      box-shadow: 0 4px 16px rgba(192, 92, 26, 0.45);
    }
  }

  &__panel {
    position: absolute;
    bottom: 68px;
    right: 0;
    width: 360px;
    max-height: 540px;
    background: #fff;
    border: 2px dashed #de7534;
    border-radius: 10px;
    box-shadow: 0 6px 32px rgba(222, 117, 52, 0.15), 0 2px 10px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 480px) {
      width: calc(100vw - 32px);
      right: -8px;
    }
  }

  &__header {
    background: #de7534;
    color: #fff;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    &-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &-text {
      display: flex;
      flex-direction: column;

      strong {
        font-size: 16px;
        font-weight: 700;
        line-height: 1.2;
      }

      span {
        font-size: 12px;
        opacity: 0.88;
      }
    }
  }

  &__avatar {
    font-size: 28px;
    line-height: 1;
  }

  &__new-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: #fff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.35);
    }
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    min-height: 240px;
    max-height: 360px;
    background: #fff8f0;
  }

  &__welcome {
    text-align: center;
    padding: 20px 8px;
    color: #718096;

    &-emoji {
      font-size: 40px;
      margin-bottom: 10px;
    }

    p {
      margin: 4px 0;
      font-size: 14px;
      line-height: 1.5;
      color: #5c3317;
    }
  }

  &__messages {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__message {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    &--user {
      flex-direction: row-reverse;

      .lp-chatbox__message-bubble {
        background: #de7534;
        color: #fff;
        border-bottom-right-radius: 4px;
      }
    }

    &--assistant {
      .lp-chatbox__message-bubble {
        background: #fff;
        color: #052852;
        border: 1px dashed #ffe0b2;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 4px rgba(222, 117, 52, 0.08);
      }
    }

    &-avatar {
      font-size: 20px;
      flex-shrink: 0;
    }

    &-bubble {
      max-width: 260px;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
      white-space: pre-wrap;
    }
  }

  &__thinking {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    &-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
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
  }

  &__footer {
    border-top: 1px solid #ffe0b2;
    padding: 12px;
    background: #fff;
  }

  &__input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  &__input {
    flex: 1;
    border: 1.5px solid #ffe0b2;
    border-radius: 10px;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 13.5px;
    resize: none;
    outline: none;
    color: #052852;
    background: #fff8f0;
    max-height: 100px;
    overflow-y: auto;
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
    width: 40px;
    height: 40px;
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

.lp-chatbox-slide-enter-active,
.lp-chatbox-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.lp-chatbox-slide-enter-from,
.lp-chatbox-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

@keyframes lp-bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
