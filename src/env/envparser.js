const env = require('dotenv').config().parsed

module.exports = function () {
  let parsed = {}

  for (let key in env) {
    if (!env.hasOwnProperty(key) || typeof env[key] !== 'string') {
      continue
    }

    parsed[key] = JSON.stringify(env[key])
  }

  return parsed
}
