import { useEffect } from 'react'

export const useSessionWorker = () => {
  useEffect(() => {
    const worker = new Worker(new URL('../workers/sessionWorker.js', import.meta.url), {
      type: 'module',
    })

    worker.postMessage({ type: 'start', interval: 30000 })

    worker.onmessage = (e) => {
      if (e.data.type === 'logout') {
        window.dispatchEvent(new Event('session-expired'))
      }
    }

    return () => {
      worker.postMessage({ type: 'stop' })
      worker.terminate()
    }
  }, [])
}
