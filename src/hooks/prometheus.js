
module.exports = () => {
  return async context => {
    if (context.type === 'before') {
      const labels = {
        path: context.path,
        method: context.method
      }

      context.endTimer = context.app.get('prometheusFeathersRequestsDurationSeconds').startTimer(labels)
    }

    if (context.type === 'after') {
      context.endTimer()
    }

    return context
  }
}
