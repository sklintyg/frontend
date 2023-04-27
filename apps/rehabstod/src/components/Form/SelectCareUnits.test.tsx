import { screen } from '@testing-library/react'
import { beforeEach, expect, vi } from 'vitest'
import { rest } from 'msw'
import userEvent from '@testing-library/user-event'
import { SelectCareUnits } from './SelectCareUnits'
import { fakeUser, fakeUserPreferences } from '../../utils/fake'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { User } from '../../schemas'

const preferences = fakeUserPreferences()
let onChange: (value: string) => void
let user: User
beforeEach(() => {
  onChange = vi.fn()
  user = fakeUser()
})

function getNumberOfUnitsInFakeUser(): number {
  let numberOfUnits = 1
  user.vardgivare.forEach((careProvider) => {
    careProvider.vardenheter.forEach((careUnit) => {
      numberOfUnits += 1
      if (careUnit.mottagningar && careUnit.mottagningar.length > 0) {
        careUnit.mottagningar.forEach(() => {
          numberOfUnits += 1
        })
      }
    })
  })
  return numberOfUnits
}

it('should display Ingen forvald enhet option', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

  expect(await screen.findByText('Ingen förvald enhet')).toBeInTheDocument()
})

it('should display options with care units related to user', async () => {
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

  expect(await screen.findAllByRole('option')).toHaveLength(getNumberOfUnitsInFakeUser())
})

it('should display standardenhet from preferences in select as default value', async () => {
  const { id } = user.vardgivare[0].vardenheter[0]
  const name = user.vardgivare[0].vardenheter[0].namn
  const userPreferences = fakeUserPreferences({ standardenhet: id })

  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={userPreferences} />)

  expect(await screen.findByDisplayValue(name)).toBeInTheDocument()
})

it('should call onChange if option is selected', async () => {
  const unit = user.vardgivare[0].vardenheter[0]

  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

  await userEvent.selectOptions(await screen.findByRole('combobox'), await screen.findByText(unit.namn))
  expect(onChange).toHaveBeenCalledWith(unit.id)
})
