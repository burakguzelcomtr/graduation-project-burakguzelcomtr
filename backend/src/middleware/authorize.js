const hakki = require('../hakki')

function authorize(resource, permission) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).send({ error: 'Unauthorized' })

    if (!req.user.populated('user')) await req.user.populate('user')

    const { role } = req.user.user
    const allowed = await hakki.areAnyRolesAllowed([role], resource, [permission])

    if (!allowed) return res.status(403).send({ error: 'Forbidden' })

    next()
  }
}

module.exports = authorize
