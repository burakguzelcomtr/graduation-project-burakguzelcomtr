<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import PageHeader from '@/components/PageHeader.vue'

const router = useRouter()
const chat = useChatStore()

onMounted(() => {
  chat.fetchSessions()
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function openSession(id) {
  router.push({ name: 'ai-session-detail', params: { sessionId: id } })
}
</script>

<template lang="pug">
section.lp-ai-history
  PageHeader(title="AI Assistant" subtitle="Your conversation history")

  .lp-ai-history__content
    .lp-ai-history__loading(v-if="chat.sessionsLoading")
      .lp-ai-history__spinner
      p Loading your chats...

    .lp-ai-history__error(v-else-if="chat.sessionsError")
      .lp-ai-history__error-icon ⚠️
      p {{ chat.sessionsError }}

    .lp-ai-history__empty(v-else-if="chat.sessions.length === 0")
      .lp-ai-history__empty-art 🤖
      h3 No conversations yet
      p Start chatting with your AI study buddy using the button at the bottom-right!

    .lp-ai-history__list(v-else)
      .lp-ai-history__card(
        v-for="session in chat.sessions"
        :key="session._id"
        @click="openSession(session._id)"
      )
        .lp-ai-history__card-icon 💬
        .lp-ai-history__card-body
          .lp-ai-history__card-title {{ session.title || 'New Chat' }}
          .lp-ai-history__card-meta
            span.lp-ai-history__badge(v-if="session.page") 📄 {{ session.page }}
            span.lp-ai-history__date {{ formatDate(session.updatedAt) }} · {{ formatTime(session.updatedAt) }}
        .lp-ai-history__card-arrow ›
</template>

<style lang="scss" scoped>
.lp-ai-history {
  font-family: 'Fredoka', 'Segoe UI', sans-serif;
  min-height: 100%;

  &__content {
    padding: 24px 8px 0;
    max-width: 720px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    color: #718096;
    gap: 12px;

    p { font-size: 15px; }
  }

  &__spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #ffe0b2;
    border-top-color: #de7534;
    border-radius: 50%;
    animation: lp-spin 0.8s linear infinite;
  }

  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    color: #e53e3e;
    gap: 10px;

    &-icon { font-size: 36px; }
    p { font-size: 15px; }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 0;
    text-align: center;
    gap: 10px;

    &-art { font-size: 64px; }

    h3 {
      font-size: 22px;
      color: #de7534;
      font-weight: 800;
      margin: 0;
    }

    p {
      font-size: 14px;
      color: #718096;
      max-width: 300px;
      line-height: 1.6;
      margin: 0;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #fff;
    border: 2px dashed #de7534;
    border-radius: 10px;
    padding: 16px 18px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(222, 117, 52, 0.1);
    transition: box-shadow 0.15s, transform 0.15s, background 0.15s;

    &:hover {
      background: #fff8f0;
      box-shadow: 0 6px 20px rgba(222, 117, 52, 0.2);
      transform: translateY(-2px);
    }

    &-icon {
      font-size: 26px;
      flex-shrink: 0;
    }

    &-body {
      flex: 1;
      min-width: 0;
    }

    &-title {
      font-size: 16px;
      font-weight: 700;
      color: #de7534;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    &-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    &-arrow {
      font-size: 22px;
      color: #de7534;
      flex-shrink: 0;
      opacity: 0.6;
    }
  }

  &__badge {
    background: #fff3e0;
    color: #de7534;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 160px;
    text-overflow: ellipsis;
    border: 1px solid #ffe0b2;
  }

  &__date {
    font-size: 12px;
    color: #a0aec0;
    white-space: nowrap;
  }
}

@keyframes lp-spin {
  to { transform: rotate(360deg); }
}
</style>
