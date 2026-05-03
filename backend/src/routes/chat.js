const express = require('express')

const router = express.Router()

const ChatSessionManager = require('../managers/chat-session-manager')
const openaiService = require('../services/openai-service')

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized' })
  return next()
}

/**
 * POST /chat/message
 * Body: { message, page, pageContext?, sessionId? }
 */
router.post('/message', requireAuth, async (req, res) => {
  try {
    const { message, page, pageContext, sessionId: incomingSessionId } = req.body

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).send({ error: 'message is required' })
    }

    const trimmedMessage = message.trim()
    const { sessionId, isNewSession, historyMessages, studentContext } = await ChatSessionManager.prepareUserMessage(
      req.user.user,
      {
        message: trimmedMessage,
        page,
        pageContext,
        sessionId: incomingSessionId,
      }
    )

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    const stream = await openaiService.chatStream(historyMessages, trimmedMessage, pageContext, studentContext)
    let fullReply = ''

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        fullReply += content
        res.write(`data: ${JSON.stringify({ content })}\n\n`)
      }
    }

    const { title } = await ChatSessionManager.finalizeAssistantReply(
      sessionId,
      isNewSession,
      trimmedMessage,
      fullReply
    )

    res.write(`data: ${JSON.stringify({ done: true, sessionId, ...(title ? { title } : {}) })}\n\n`)
    return res.end()
  } catch (error) {
    if (!res.headersSent) {
      return res.status(error.status || 500).send({ error: error.message })
    }
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    return res.end()
  }
})

/**
 * GET /chat/sessions
 * Returns all sessions for the authenticated user (no messages)
 */
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const sessions = await ChatSessionManager.getSessionsByUser(req.user.user)
    return res.send(sessions)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

/**
 * GET /chat/sessions/:sessionId
 * Returns a single session with messages (ownership enforced)
 */
router.get('/sessions/:sessionId', requireAuth, async (req, res) => {
  try {
    const session = await ChatSessionManager.getSessionById(req.params.sessionId, req.user.user)
    return res.send(session)
  } catch (error) {
    return res.status(error.status || 500).send({ error: error.message })
  }
})

module.exports = router
