import { screen } from '@testing-library/react'
import { beforeEach, expect, vi } from 'vitest'
import { rest } from 'msw'
import userEvent from '@testing-library/user-event'
import { SelectCareUnits } from './SelectCareUnits'
import { fakeUser, fakeUserPreferences } from '../../utils/fake'
import { server } from '../../mocks/server'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { User } from '../../schemas'
import { getUnitsForUser } from '../../utils/getUnitsForUser'

const preferences = fakeUserPreferences()
let onChange: (value: string) => void
let user: User
beforeEach(() => {
  onChange = vi.fn()
  user = fakeUser()
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
})

it('should display Ingen forvald enhet option', async () => {
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

  expect(await screen.findByText('Ingen förvald enhet')).toBeInTheDocument()
})

it('should display options with care units related to user', async () => {
  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)

  expect(await screen.findAllByRole('option')).toHaveLength(getUnitsForUser(user).length + 1)
})

it('should display standardenhet from preferences in select as default value', async () => {
  const unit = getUnitsForUser(user)[0]
  const userPreferences = fakeUserPreferences({ standardenhet: unit.id })

  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={userPreferences} />)

  expect(await screen.findByDisplayValue(unit.namn)).toBeInTheDocument()
})

it('should call onChange if option is selected', async () => {
  const unit = getUnitsForUser(user)[0]

  renderWithRouter(<SelectCareUnits onChange={onChange} preferences={preferences} />)
  const options = await screen.findAllByText(unit.namn)
  const option = options[0]

  await userEvent.selectOptions(await screen.findByRole('combobox'), option)
  expect(onChange).toHaveBeenCalledWith(unit.id)
})
