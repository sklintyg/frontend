import { act, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { server } from '../mocks/server'
import { renderWithRouter } from '../utils/renderWithRouter'
import { useSession } from './useSession'

function TestComponent() {
  useSession()
  return (
    <Routes>
      <Route path="/" element={<p>Start</p>} />
      <Route path="/welcome" element={<p>Welcome</p>} />
    </Routes>
  )
}

describe('useSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.fn()
  })

  // afterEach(() => {
  //   vi.restoreAllMocks()
  // })

  it('Should check session every 30 seconds', async () => {
    const requests = new Map()
    // const pendingUserRequest = waitForRequest('GET', '/api/user')
    // const pendingSessionRequest = waitForRequest('GET', '/api/session-auth-check/ping')
    server.events.on('request:start', (req) => {
      console.log('woop', req)
      requests.set(req.id, req)
    })

    act(() => {
      renderWithRouter(<TestComponent />)
    })

    expect(screen.getByText('Start')).toBeInTheDocument()

    vi.runAllTimers()

    // await waitForRequest('GET', '/api/user')
    // await waitForRequest('GET', '/api/session-auth-check/ping')

    // vi.advanceTimersToNextTimer()
    //   .advanceTimersToNextTimer()
    //   .advanceTimersToNextTimer()
    //   .advanceTimersToNextTimer()
    //   .advanceTimersToNextTimer()
    //   .advanceTimersToNextTimer()

    // const userRequest = await pendingUserRequest
    // const sessionRequest = await pendingSessionRequest

    // console.log(userRequest, sessionRequest)

    // console.log(userRequest, sessionRequest)

    expect(requests.size).toBe(1)
  })

  // it('Should call /logout once session is over', () => {})
})
