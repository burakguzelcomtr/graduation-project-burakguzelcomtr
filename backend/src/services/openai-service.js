// eslint-disable-next-line import/no-extraneous-dependencies
const { OpenAI } = require('openai')

const baseSystemPrompt = `You are a friendly and knowledgeable educational assistant for Learnpass, a learning platform for students.

Scope:
- Answer educational questions on any topic relevant to school-aged students
- When lesson context is provided, prioritize and focus on that content
- When no specific context is given, answer using your general knowledge in a student-friendly way
- Do not answer questions unrelated to learning or education

Language:
- Always respond in the same language the student uses (Turkish or English)
- Short, clear sentences
- Use simple words appropriate for the student's grade level
- Use present tense

Response Style:
- Warm, supportive, encouraging
- Gently correct mistakes
- Keep answers short and clear
- Ask simple questions when helpful (Do you…? Can you…?)
- Use values: fairness, kindness, sharing, care for Earth
- Emojis allowed but minimal (🌍📖👍)

Behavior:
- If student is wrong:
  "Good try. Let's check again."
- If you genuinely don't know something:
  "I'm not sure about that. Let's look it up together!"
- Never say "I don't know" for common educational questions you can answer`

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function buildSystemContent(pageContext, studentContext) {
  let content = baseSystemPrompt

  if (studentContext?.name) {
    content += `\n\nStudent info:\nName: ${studentContext.name} ${studentContext.surname ?? ''}`
    if (studentContext.grade) content += `\nGrade: ${studentContext.grade}`
    if (studentContext.section) content += `, Section: ${studentContext.section}`
    if (studentContext.campus) content += `, Campus: ${studentContext.campus}`
    if (studentContext.role) content += `\nRole: ${studentContext.role}`
    // student hero and countery
    if (studentContext.hero) content += `\nFavorite Hero: ${studentContext.hero.name}`
    if (studentContext.country) content += `\nCountry: ${studentContext.country.name}`
  }

  if (pageContext?.title) {
    content += `\n\nCurrent lesson/page:\n${pageContext.title}`
    if (pageContext.description) content += `\n${pageContext.description}`
  }

  return content
}

/**
 * @param {Array<{role: string, content: string}>} historyMessages - previous messages (max 5 without current)
 * @param {string} userMessage - the current user message
 * @param {{ title?: string, description?: string }|null} pageContext - current page context
 * @param {{ name?: string, surname?: string, grade?: number, section?: string, campus?: string, role?: string }|null} studentContext
 * @returns {Promise<string>} assistant reply
 */
async function chat(historyMessages, userMessage, pageContext, studentContext) {
  const systemContent = buildSystemContent(pageContext, studentContext)

  const messages = [
    { role: 'system', content: systemContent },
    ...historyMessages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-nano-2025-04-14',
    messages,
  })

  return completion.choices[0].message.content
}

/**
 * Generates a short 4–6 word title for the session based on the first exchange.
 * @param {string} firstUserMessage
 * @param {string} firstAssistantReply
 * @returns {Promise<string>}
 */
async function generateTitle(firstUserMessage, firstAssistantReply) {
  const completion = await client.chat.completions.create({
    model: 'gpt-5-nano',
    messages: [
      {
        role: 'system',
        content:
          'Generate a concise 4-6 word title for this conversation. Reply with only the title, no quotes or punctuation.',
      },
      {
        role: 'user',
        content: `User: ${firstUserMessage}\nAssistant: ${firstAssistantReply}`,
      },
    ],
    max_completion_tokens: 20,
  })

  return completion.choices[0].message.content.trim()
}

/**
 * @param {Array<{role: string, content: string}>} historyMessages
 * @param {string} userMessage
 * @param {{ title?: string, description?: string }|null} pageContext
 * @param {{ name?: string, surname?: string, grade?: number, section?: string, campus?: string, role?: string }|null} studentContext
 * @returns {AsyncIterable} OpenAI stream
 */
async function chatStream(historyMessages, userMessage, pageContext, studentContext) {
  const systemContent = buildSystemContent(pageContext, studentContext)

  const messages = [
    { role: 'system', content: systemContent },
    ...historyMessages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  return client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4.1-nano-2025-04-14',
    messages,
    stream: true,
  })
}

module.exports = { chat, chatStream, generateTitle }
