const slugify = require('slugify')

/**
 * Generates a unique slug for the given title within a Mongoose model.
 * If the base slug already exists, appends an incrementing counter (e.g. my-slug-2).
 *
 * @param {string} title - Source text to slugify
 * @param {import('mongoose').Model} Model - Mongoose model to check uniqueness against
 * @param {string|null} excludeId - Document _id to exclude from the uniqueness check (used on updates)
 */
async function generateUniqueSlug(title, Model, excludeId = null) {
  const base = slugify(title, { lower: true, strict: true, locale: 'tr' })
  let slug = base
  let counter = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-underscore-dangle
    const query = excludeId ? { slug, _id: { $ne: excludeId } } : { slug }

    // eslint-disable-next-line no-await-in-loop
    const existing = await Model.findOne(query)
    if (!existing) break

    slug = `${base}-${counter}`
    counter += 1
  }

  return slug
}

module.exports = { generateUniqueSlug }
