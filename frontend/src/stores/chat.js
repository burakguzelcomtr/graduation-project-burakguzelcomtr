import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/api'

export const useChatStore = defineStore('chat', () => {
  // ── ChatBox state ──────────────────────────────────────────────
  const sessionId = ref(null)
  const messages = ref([])
  const loading = ref(false)

  // ── History state ──────────────────────────────────────────────
  const sessions = ref([])
  const sessionsLoading = ref(false)
  const sessionsError = ref(null)

  // ── Session detail state ───────────────────────────────────────
  const activeSession = ref(null)
  const activeMessages = ref([])
  const activeLoading = ref(false)
  const activeError = ref(null)
  const activeSending = ref(false)

  // ── ChatBox actions ────────────────────────────────────────────

  async function sendMessage(text, page, pageContext) {
    if (!text || loading.value) return

    messages.value.push({ role: 'user', content: text })
    loading.value = true

    let assistantContent = ''

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: text, page, pageContext, ...(sessionId.value ? { sessionId: sessionId.value } : {}) }),
      })

      if (!response.ok) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.content) assistantContent += data.content
          if (data.done) sessionId.value = data.sessionId
          if (data.error) assistantContent = 'Sorry, something went wrong. Please try again.'
        }
      }
    } catch {
      assistantContent = 'Sorry, something went wrong. Please try again.'
    } finally {
      messages.value.push({ role: 'assistant', content: assistantContent })
      loading.value = false
    }
  }

  function startNewChat() {
    sessionId.value = null
    messages.value = []
  }

  // ── History actions ────────────────────────────────────────────

  async function fetchSessions() {
    sessionsLoading.value = true
    sessionsError.value = null
    try {
      const { data } = await api.get('/chat/sessions')
      sessions.value = data
    } catch {
      sessionsError.value = 'Could not load your chat history. Please try again.'
    } finally {
      sessionsLoading.value = false
    }
  }

  // ── Session detail actions ─────────────────────────────────────

  async function fetchSession(id) {
    activeLoading.value = true
    activeError.value = null
    activeSession.value = null
    activeMessages.value = []
    try {
      const { data } = await api.get(`/chat/sessions/${id}`)
      activeSession.value = data
      activeMessages.value = data.messages || []
    } catch (err) {
      activeError.value = err.response?.status === 404
        ? 'This conversation was not found.'
        : 'Could not load this conversation.'
    } finally {
      activeLoading.value = false
    }
  }

  async function sendSessionMessage(text) {
    if (!text || activeSending.value || !activeSession.value) return

    activeMessages.value.push({ role: 'user', content: text, createdAt: new Date().toISOString() })
    activeSending.value = true

    let assistantContent = ''

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: text,
          page: activeSession.value.page,
          pageContext: activeSession.value.pageContext || null,
          sessionId: activeSession.value._id,
        }),
      })

      if (!response.ok) throw new Error('Request failed')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))

          if (data.content) assistantContent += data.content
          if (data.error) assistantContent = 'Sorry, something went wrong. Please try again.'
          if (data.done && data.title) activeSession.value.title = data.title
        }
      }
    } catch {
      assistantContent = 'Sorry, something went wrong. Please try again.'
    } finally {
      activeMessages.value.push({ role: 'assistant', content: assistantContent, createdAt: new Date().toISOString() })
      activeSending.value = false
    }
  }

  return {
    // ChatBox
    sessionId,
    messages,
    loading,
    sendMessage,
    startNewChat,
    // History
    sessions,
    sessionsLoading,
    sessionsError,
    fetchSessions,
    // Session detail
    activeSession,
    activeMessages,
    activeLoading,
    activeError,
    activeSending,
    fetchSession,
    sendSessionMessage,
  }
})
