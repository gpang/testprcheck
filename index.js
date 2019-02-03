const checkPrTitle = require('./check-title.js')

module.exports = app => {
  app.on(['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], check)

  // https://developer.github.com/v3/repos/statuses/#create-a-status
  // error, failure, pending, or success
  async function check (context) {
    const { title, body } = context.payload.pull_request

    const titleErrors = checkPrTitle(title)
    var state = 'success'
    var description = 'PR title looks good!'
    if (titleErrors.length > 0) {
      state = 'failure'
      description = titleErrors.join('; ')
    }
    
    context.github.repos.createStatus(context.repo({
      sha: context.payload.pull_request.head.sha,
      state: state,
      description: description,
      context: 'PR-TITLE',
    }))

  }
}
