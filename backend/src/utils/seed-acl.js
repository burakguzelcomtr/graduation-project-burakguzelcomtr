const hakki = require('../hakki')

async function seedAcl() {
  const readResources = [
    'lessons',
    'units',
    'lesson-materials',
    'questions',
    'students',
    'teachers',
    'users',
    'heros',
    'countries',
  ]

  await hakki.allow('student', readResources, ['read'])
  await hakki.allow('student', ['chat'], ['use'])

  await hakki.allow('teacher', readResources, ['read'])
  await hakki.allow('teacher', ['students'], ['update'])
  await hakki.allow('teacher', ['chat'], ['use'])
  await hakki.addRoleParents('teacher', 'student')

  await hakki.addRoleParents('admin', 'teacher')
  await hakki.allow('admin', [...readResources, 'accounts'], ['read', 'create', 'update', 'delete'])
  await hakki.allow('admin', ['chat'], ['use'])

  console.log('[ACL] seeded')
}

module.exports = seedAcl
