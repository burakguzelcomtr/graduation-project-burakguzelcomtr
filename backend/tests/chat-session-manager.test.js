/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const mongoose = require('mongoose')

// Explicit mock factories prevent the real modules from loading (no DB, no OpenAI client init)
jest.mock('../src/models/chat-session', () => ({
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
}))

jest.mock('../src/models/user', () => ({
  findById: jest.fn(),
}))

jest.mock('../src/services/openai-service', () => ({
  chat: jest.fn(),
  chatStream: jest.fn(),
  generateTitle: jest.fn(),
}))

const ChatSession = require('../src/models/chat-session')
const User = require('../src/models/user')
const openaiService = require('../src/services/openai-service')
const ChatSessionManager = require('../src/managers/chat-session-manager')

// Sets up the User.findById().select().lean() query chain mock
const mockUserFindById = returnValue => {
  const lean = jest.fn().mockResolvedValue(returnValue)
  const select = jest.fn().mockReturnValue({ lean })
  User.findById.mockReturnValue({ select })
}

describe('ChatSessionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ─── createSession ────────────────────────────────────────────────────────

  describe('createSession', () => {
    it('delegates to ChatSession.create with correct args', async () => {
      const userId = new mongoose.Types.ObjectId()
      const page = 'lesson-1'
      const pageContext = { title: 'Algebra', description: 'Variables and expressions' }
      const created = { _id: new mongoose.Types.ObjectId(), id: 'sess-abc', userId, page, pageContext }

      ChatSession.create.mockResolvedValue(created)

      const result = await ChatSessionManager.createSession(userId, page, pageContext)

      expect(ChatSession.create).toHaveBeenCalledWith({ userId, page, pageContext })
      expect(result).toBe(created)
    })
  })

  // ─── addMessage ───────────────────────────────────────────────────────────

  describe('addMessage', () => {
    it('pushes the message into the session document', async () => {
      const sessionId = new mongoose.Types.ObjectId()
      const updated = { _id: sessionId, messages: [{ role: 'user', content: 'Hello' }] }

      ChatSession.findByIdAndUpdate.mockResolvedValue(updated)

      const result = await ChatSessionManager.addMessage(sessionId, 'user', 'Hello')

      expect(ChatSession.findByIdAndUpdate).toHaveBeenCalledWith(
        sessionId,
        { $push: { messages: { role: 'user', content: 'Hello' } } },
        { new: true }
      )
      expect(result).toBe(updated)
    })
  })

  // ─── updateTitle ──────────────────────────────────────────────────────────

  describe('updateTitle', () => {
    it('sets the title field on the session', async () => {
      const sessionId = new mongoose.Types.ObjectId()
      const updated = { _id: sessionId, title: 'Photosynthesis Basics' }

      ChatSession.findByIdAndUpdate.mockResolvedValue(updated)

      const result = await ChatSessionManager.updateTitle(sessionId, 'Photosynthesis Basics')

      expect(ChatSession.findByIdAndUpdate).toHaveBeenCalledWith(sessionId, { title: 'Photosynthesis Basics' }, { new: true })
      expect(result).toBe(updated)
    })
  })

  // ─── getSessionsByUser ────────────────────────────────────────────────────

  describe('getSessionsByUser', () => {
    it('returns sessions without messages, sorted by updatedAt descending', async () => {
      const userId = new mongoose.Types.ObjectId()
      const sessions = [{ _id: new mongoose.Types.ObjectId(), title: 'Chat A' }]

      const sort = jest.fn().mockResolvedValue(sessions)
      ChatSession.find.mockReturnValue({ sort })

      const result = await ChatSessionManager.getSessionsByUser(userId)

      expect(ChatSession.find).toHaveBeenCalledWith({ userId }, { messages: 0 })
      expect(sort).toHaveBeenCalledWith({ updatedAt: -1 })
      expect(result).toBe(sessions)
    })
  })

  // ─── getSessionById ───────────────────────────────────────────────────────

  describe('getSessionById', () => {
    it('returns the session when it belongs to the requesting user', async () => {
      const sessionId = new mongoose.Types.ObjectId()
      const userId = new mongoose.Types.ObjectId()
      const session = { _id: sessionId, userId }

      ChatSession.findOne.mockResolvedValue(session)

      const result = await ChatSessionManager.getSessionById(sessionId, userId)

      expect(ChatSession.findOne).toHaveBeenCalledWith({ _id: sessionId, userId })
      expect(result).toBe(session)
    })

    it('throws a 404 error when session is not found or belongs to another user', async () => {
      ChatSession.findOne.mockResolvedValue(null)

      await expect(
        ChatSessionManager.getSessionById(new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId())
      ).rejects.toMatchObject({ message: 'Chat session not found', status: 404 })
    })
  })

  // ─── getLastNMessages ─────────────────────────────────────────────────────

  describe('getLastNMessages', () => {
    it('returns the last N messages from the session', async () => {
      const messages = [
        { role: 'user', content: 'First' },
        { role: 'assistant', content: 'Second' },
        { role: 'user', content: 'Third' },
      ]

      ChatSession.findById.mockResolvedValue({ messages })

      const result = await ChatSessionManager.getLastNMessages(new mongoose.Types.ObjectId(), 2)

      expect(result).toEqual([
        { role: 'assistant', content: 'Second' },
        { role: 'user', content: 'Third' },
      ])
    })

    it('uses 5 as the default N', async () => {
      const messages = Array.from({ length: 8 }, (_, i) => ({ role: 'user', content: `msg-${i}` }))

      ChatSession.findById.mockResolvedValue({ messages })

      const result = await ChatSessionManager.getLastNMessages(new mongoose.Types.ObjectId())

      expect(result).toHaveLength(5)
      expect(result[0].content).toBe('msg-3')
    })

    it('returns empty array when session is not found', async () => {
      ChatSession.findById.mockResolvedValue(null)

      const result = await ChatSessionManager.getLastNMessages(new mongoose.Types.ObjectId())

      expect(result).toEqual([])
    })
  })

  // ─── fetchStudentContext ──────────────────────────────────────────────────

  describe('fetchStudentContext', () => {
    it('returns a context object when the user exists', async () => {
      const userId = new mongoose.Types.ObjectId()
      const userDoc = { name: 'Ali', surname: 'Yılmaz', grade: 5, section: 'A', campus: 'Main', role: 'student' }

      mockUserFindById(userDoc)

      const result = await ChatSessionManager.fetchStudentContext(userId)

      expect(User.findById).toHaveBeenCalledWith(userId)
      expect(result).toEqual(userDoc)
    })

    it('returns null when the user does not exist', async () => {
      mockUserFindById(null)

      const result = await ChatSessionManager.fetchStudentContext(new mongoose.Types.ObjectId())

      expect(result).toBeNull()
    })
  })

  // ─── prepareUserMessage ───────────────────────────────────────────────────

  describe('prepareUserMessage', () => {
    const userId = new mongoose.Types.ObjectId()
    const message = 'What is photosynthesis?'
    const page = 'biology'
    const pageContext = { title: 'Plants', description: 'How plants produce energy' }
    const studentDoc = { name: 'Ali', surname: 'K', grade: 6, section: 'B', campus: 'Main', role: 'student' }

    it('creates a new session and returns isNewSession true when no sessionId is given', async () => {
      ChatSession.create.mockResolvedValue({ id: 'new-sess-123' })
      ChatSession.findByIdAndUpdate.mockResolvedValue({})
      ChatSession.findById.mockResolvedValue({ messages: [{ role: 'user', content: message }] })
      mockUserFindById(studentDoc)

      const result = await ChatSessionManager.prepareUserMessage(userId, { message, page, pageContext })

      expect(ChatSession.create).toHaveBeenCalledWith({ userId, page, pageContext })
      expect(result.sessionId).toBe('new-sess-123')
      expect(result.isNewSession).toBe(true)
      // Only the user message was in history → slice(0, -1) = []
      expect(result.historyMessages).toEqual([])
      expect(result.studentContext).toEqual(studentDoc)
    })

    it('reuses the existing session and returns isNewSession false when sessionId is given', async () => {
      const existingSessionId = new mongoose.Types.ObjectId().toString()

      ChatSession.findByIdAndUpdate.mockResolvedValue({})
      ChatSession.findById.mockResolvedValue({
        messages: [
          { role: 'user', content: 'Previous question' },
          { role: 'assistant', content: 'Previous answer' },
          { role: 'user', content: message },
        ],
      })
      mockUserFindById(studentDoc)

      const result = await ChatSessionManager.prepareUserMessage(userId, {
        message,
        page,
        pageContext,
        sessionId: existingSessionId,
      })

      expect(ChatSession.create).not.toHaveBeenCalled()
      expect(result.sessionId).toBe(existingSessionId)
      expect(result.isNewSession).toBe(false)
      // Last 5 messages returned 3 total → slice(0, -1) = first 2
      expect(result.historyMessages).toHaveLength(2)
    })
  })

  // ─── finalizeAssistantReply ───────────────────────────────────────────────

  describe('finalizeAssistantReply', () => {
    it('saves the reply and returns empty object for an existing session', async () => {
      const sessionId = new mongoose.Types.ObjectId()

      ChatSession.findByIdAndUpdate.mockResolvedValue({})

      const result = await ChatSessionManager.finalizeAssistantReply(sessionId, false, 'Q', 'A')

      expect(ChatSession.findByIdAndUpdate).toHaveBeenCalledTimes(1) // only addMessage
      expect(openaiService.generateTitle).not.toHaveBeenCalled()
      expect(result).toEqual({})
    })

    it('saves reply, generates a title, and returns it for a new session', async () => {
      const sessionId = new mongoose.Types.ObjectId()

      ChatSession.findByIdAndUpdate.mockResolvedValue({})
      openaiService.generateTitle.mockResolvedValue('Photosynthesis Explained Simply')

      const result = await ChatSessionManager.finalizeAssistantReply(
        sessionId,
        true,
        'What is photosynthesis?',
        'Photosynthesis is the process...'
      )

      expect(openaiService.generateTitle).toHaveBeenCalledWith(
        'What is photosynthesis?',
        'Photosynthesis is the process...'
      )
      expect(ChatSession.findByIdAndUpdate).toHaveBeenCalledTimes(2) // addMessage + updateTitle
      expect(result).toEqual({ title: 'Photosynthesis Explained Simply' })
    })
  })
})
