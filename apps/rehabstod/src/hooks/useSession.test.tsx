import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { expect, vi } from 'vitest'
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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Should check session every 30 seconds', async () => {
    const requests = new Map()
    const sessionPingRequest = []
    server.events.on('request:start', (req) => requests.set(req.id, req))

    renderWithRouter(<TestComponent />)

    await act(async () => vi.runOnlyPendingTimersAsync())

    expect(screen.getByText('Start')).toBeInTheDocument()

    await act(async () => vi.advanceTimersByTimeAsync(30e3))
    requests.forEach((request) => {
      const { pathname } = request.url
      if (pathname === '/api/session-auth-check/ping') {
        sessionPingRequest.push(request)
      }
    })
    expect(sessionPingRequest.length).toBe(2)
  })

  it('Should logout once session is over', async () => {
    vi.useRealTimers()
    server.use(
      rest.get('/api/session-auth-check/ping', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            hasSession: true,
            secondsUntilExpire: 0,
            authenticated: false,
          })
        )
      )
    )
    renderWithRouter(<TestComponent />)

    expect(screen.getByText('Start')).toBeInTheDocument()

    expect(await screen.findByText('Welcome')).toBeInTheDocument()
  })
})
