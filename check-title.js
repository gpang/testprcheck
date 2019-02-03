module.exports = checkPrTitle

const RE_WIP = /^\[WIP\]/
const RE_SMALLFIX = /^\[SMALLFIX\]/
const RE_DOCFIX = /^\[DOCFIX\]/
const RE_JIRA = /^\[ALLUXIO-\d+\]/
const RE_WS_START = /^\s+/
const RE_WS_END = /\s+$/
const RE_UPPER = /^[A-Z]/
const RE_BRACKET = /\[[^\]]*\]/
const RE_PUNCTUATION = /[\.\?!]$/
const RE_WS = /\s+/

function checkPrTitle(title) {
  var errors = []
  if (RE_WS_START.test(title)) {
    errors.push('Must not start with whitespace')
  }
  if (RE_WS_END.test(title)) {
    errors.push('Must not end with whitespace')
  }
  title = title.trim()

  var done = false
  while (!done) {
    if (title.startsWith('[')) {
      if (!RE_WIP.test(title)
          && !RE_SMALLFIX.test(title)
          && !RE_DOCFIX.test(title)
          && !RE_JIRA.test(title)) {
        errors.push('Supported prefix: [WIP], [SMALLFIX], [DOCFIX], [ALLUXIO-??]')
      }
      title = title.replace(RE_BRACKET, '').trim()
    } else {
      done = true
    }
  }
  
  if (!RE_UPPER.test(title)) {
    errors.push('The first word must be capitalized')
  }
  if (RE_PUNCTUATION.test(title)) {
    errors.push('Must not end with punctuation')
  }
  const splits = title.split(RE_WS)
  if (splits.length < 3) {
    errors.push('Must be at least 3 words')
  }
  return errors
}
