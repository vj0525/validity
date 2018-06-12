const request = require('superagent')
const config = require('../../config')
const transform = require('./transform')

module.exports = async function (htmlFile) {
  let results
  let validatorUrl = await config.get('validatorUrl')
  let formData = new FormData()

  formData.append('file', htmlFile)

  try {
    let { text } = await request.post(validatorUrl)
      .query({out: 'json'})
      .set('Content-type', 'text/html')
      .send(htmlFile)

    results = JSON.parse(text).messages
    results = transform(results)
  } catch (e) {
    throw e
  }

  return results
}
