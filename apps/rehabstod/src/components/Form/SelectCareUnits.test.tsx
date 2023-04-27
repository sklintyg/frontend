import { screen } from '@testing-library/react'
import { describe, expect } from 'vitest'
import { rest } from 'msw'
import { SelectCareUnits } from './SelectCareUnits'
import { fakeUser, fakeUserPreferences } from '../../utils/fake'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'

const preferences = fakeUserPreferences()
let onChange: (value: string) => void

describe('SelectCareUnits tests', () => {
  it('should display care units related to user', async () => {
    const user = fakeUser()
    server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
    renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

    const userUnits = user.vardgivare.reduce(
      (total, careProvider) =>
        total + careProvider.vardenheter.reduce((subtotal, careUnit) => subtotal + (careUnit.mottagningar?.length || 0), 0),
      0
    )
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })
})
