import { act, screen } from '@testing-library/react'
import { matchRequestUrl, rest } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { server } from '../mocks/server'
import { api } from '../store/api'
import { store } from '../store/store'
import { fakeUser } from '../utils/fake/fakeUser'
import { renderWithRouter } from '../utils/renderWithRouter'
import { useSession } from './useSession'

function TestComponent() {
  const { isLoading } = useSession()
  return (
    <Routes>
      <Route path="/" element={<p>{isLoading ? <span>Loading</span> : <span>Start</span>}</p>} />
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
    server.events.on('request:start', (req) => {
      if (matchRequestUrl(req.url, '/api/session-auth-check/ping').matches) {
        requests.set(req.id, req)
      }
    })

    renderWithRouter(<TestComponent />)

    await act(() => vi.runOnlyPendingTimers())

    expect(screen.getByText('Loading')).toBeInTheDocument()

    await act(async () => vi.runOnlyPendingTimersAsync())

    expect(screen.getByText('Start')).toBeInTheDocument()

    expect(requests.size).toBe(1)

    await act(() => vi.advanceTimersByTime(30e3))

    expect(requests.size).toBe(2)
  })

  it('Should logout once session is over', async () => {
    vi.useRealTimers()

    server.use(
      rest.get(`/api/user`, (_, res, ctx) =>
        res(ctx.status(200), ctx.json(fakeUser({ pdlConsentGiven: true, authenticationScheme: 'urn:inera:rehabstod:siths:fake' })))
      )
    )

    renderWithRouter(<TestComponent />)

    expect(await screen.findByText('Start')).toBeInTheDocument()

    act(() => {
      store.dispatch(
        api.util.updateQueryData('getSessionPing', undefined, () => ({
          hasSession: false,
          secondsUntilExpire: 0,
          authenticated: false,
        }))
      )
    })

    expect(await screen.findByText('Welcome')).toBeInTheDocument()
  })
})
