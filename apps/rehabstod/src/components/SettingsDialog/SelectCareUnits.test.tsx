import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { beforeEach, expect, vi } from 'vitest'
import { server } from '../../mocks/server'
import { User } from '../../schemas'
import { fakeUser } from '../../utils/fake'
import { getUnitsForUser } from '../../utils/getUnitsForUser'
import { renderWithRouter } from '../../utils/renderWithRouter'
import { SelectCareUnits } from './SelectCareUnits'

let user: User
beforeEach(() => {
  user = fakeUser()
  server.use(rest.get('/api/user', (_, res, ctx) => res(ctx.status(200), ctx.json(user))))
})

it('should display Ingen forvald enhet option', async () => {
  renderWithRouter(<SelectCareUnits onChange={vi.fn()} />)

  expect(await screen.findByText('Ingen förvald enhet')).toBeInTheDocument()
})

it('should display options with care units related to user', async () => {
  renderWithRouter(<SelectCareUnits onChange={vi.fn()} />)

  expect(await screen.findAllByRole('option')).toHaveLength(getUnitsForUser(user).length + 1)
})

it('should display standardenhet from preferences in select as default value', async () => {
  const unit = getUnitsForUser(user)[0]

  renderWithRouter(<SelectCareUnits onChange={vi.fn()} standardenhet={unit.id} />)

  expect(await screen.findByDisplayValue(unit.namn)).toBeInTheDocument()
})

it('should call onChange if option is selected', async () => {
  const unit = getUnitsForUser(user)[0]
  const onChange = vi.fn()

  renderWithRouter(<SelectCareUnits onChange={onChange} />)
  const options = await screen.findAllByText(unit.namn)
  const option = options[0]

  await userEvent.selectOptions(await screen.findByRole('combobox'), option)
  expect(onChange).toHaveBeenCalledWith(unit.id)
})
