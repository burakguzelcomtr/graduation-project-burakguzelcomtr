const REGEX_SPECIAL_CHARACTERS = /[|\\{}()[\]^$+?.-]/g

function escapeRegexSegment(segment) {
  return segment.replace(REGEX_SPECIAL_CHARACTERS, '\\$&')
}

const esref = {
  patternToRegex(pattern) {
    const regexSource = String(pattern).split('*').map(escapeRegexSegment).join('.*')

    return new RegExp(`^${regexSource}$`)
  },

  matches(pattern, key) {
    return esref.patternToRegex(pattern).test(String(key))
  },
}

module.exports = esref
