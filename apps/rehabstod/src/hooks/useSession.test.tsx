import { act, screen } from '@testing-library/react'
import { rest } from 'msw'
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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Should check session every 30 seconds', async () => {
    const requests = new Map()
    server.events.on('request:start', (req) => requests.set(req.id, req))

    renderWithRouter(<TestComponent />)

    await act(() => vi.runOnlyPendingTimers())

    expect(screen.getByText('Start')).toBeInTheDocument()

    expect(requests.size).toBe(2)

    await act(() => vi.advanceTimersByTime(30e3))

    expect(requests.size).toBe(3)
  })

  it('Should logout once session is over', async () => {
    vi.useRealTimers()
    server.use(
      rest.get('/api/session-auth-check/ping', (_, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({
            hasSession: false,
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
