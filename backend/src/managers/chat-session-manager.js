const ChatSession = require('../models/chat-session')
const User = require('../models/user')
const openaiService = require('../utils/openai-service')

class ChatSessionManager {
  static async createSession(userId, page, pageContext) {
    return ChatSession.create({ userId, page, pageContext })
  }

  static async addMessage(sessionId, role, content) {
    return ChatSession.findByIdAndUpdate(sessionId, { $push: { messages: { role, content } } }, { new: true })
  }

  static async updateTitle(sessionId, title) {
    return ChatSession.findByIdAndUpdate(sessionId, { title }, { new: true })
  }

  static async getSessionsByUser(userId) {
    return ChatSession.find({ userId }, { messages: 0 }).sort({ updatedAt: -1 })
  }

  static async getSessionById(sessionId, userId) {
    const session = await ChatSession.findOne({ _id: sessionId, userId })
    if (!session) {
      const error = new Error('Chat session not found')
      error.status = 404
      throw error
    }
    return session
  }

  static async getLastNMessages(sessionId, n = 5) {
    const session = await ChatSession.findById(sessionId, { messages: 1 })
    if (!session) return []
    return session.messages.slice(-n)
  }

  static async fetchStudentContext(userId) {
    // include hero and country so assistant can mention student's assigned hero/country
    const user = await User.findById(userId)
      .select('name surname grade section campus role hero country')
      .populate('hero country')
      .lean()
    if (!user) return null
    const { name, surname, grade, section, campus, role, hero, country } = user
    return { name, surname, grade, section, campus, role, hero, country }
  }

  static async prepareUserMessage(userId, { message, page, pageContext, sessionId: incomingSessionId }) {
    const isNewSession = !incomingSessionId
    let sessionId = incomingSessionId

    if (isNewSession) {
      const session = await ChatSessionManager.createSession(userId, page, pageContext)
      sessionId = session.id
    }

    await ChatSessionManager.addMessage(sessionId, 'user', message)

    const recentMessages = await ChatSessionManager.getLastNMessages(sessionId, 5)
    const historyMessages = recentMessages.slice(0, -1)

    const studentContext = await ChatSessionManager.fetchStudentContext(userId)

    return { sessionId, isNewSession, historyMessages, studentContext }
  }

  static async finalizeAssistantReply(sessionId, isNewSession, userMessage, fullReply) {
    await ChatSessionManager.addMessage(sessionId, 'assistant', fullReply)
    if (!isNewSession) return {}

    const title = await openaiService.generateTitle(userMessage, fullReply)
    await ChatSessionManager.updateTitle(sessionId, title)
    return { title }
  }
}

module.exports = ChatSessionManager
