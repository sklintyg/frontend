let intervalId
/* eslint-disable no-restricted-globals */
/* eslint-disable-next-line func-names */
self.onmessage = function (e) {
  if (e.data.type === 'start') {
    const pollingInterval = e.data.interval || 30000

    intervalId = setInterval(async () => {
      const response = await fetch('/api/session/ping', { credentials: 'include' })
      const data = await response.json()

      if (data.secondsUntilExpire <= 30) {
        self.postMessage({ type: 'logout' })
      }
    }, pollingInterval)
  }

  if (e.data.type === 'stop') {
    clearInterval(intervalId)
  }
}
