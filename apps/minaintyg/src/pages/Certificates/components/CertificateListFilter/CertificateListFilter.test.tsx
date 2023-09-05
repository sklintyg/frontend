import { fakeCertificateId, faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { server } from '../../../../mocks/server'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { certificateFilterOptionsSchema } from '../../../../schema/certificateListFilter.schema'
import { store } from '../../../../store/store'
import { CertificateListFilter } from './CertificateListFilter'

const options = {
  statuses: Object.values(CertificateStatus),
  certificateTypes: faker.helpers.uniqueArray(fakeCertificateId, 4),
  units: faker.helpers.uniqueArray(faker.company.name, 4),
  years: ['2023', '2022', '2021', '2020'],
}

beforeEach(() => {
  server.use(
    rest.get('/api/filter-certificate', (_, res, ctx) =>
      res(ctx.status(200), ctx.json(fakerFromSchema(certificateFilterOptionsSchema)(options)))
    )
  )
})

describe('Options from API', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <CertificateListFilter onSubmit={vi.fn()} />
      </Provider>
    )
  })

  it.each(['Status', 'Mottagning', 'Intygstyp', 'År'])('Should have corret %s option', async (name) => {
    expect(
      (within(screen.getByLabelText(name)).getByRole('option', { name: `Välj ${name.toLowerCase()}` }) as HTMLOptionElement).selected
    ).toBe(true)
    waitFor(() => {
      expect(within(screen.getByLabelText(name)).getAllByRole('option').length).toBe(Object.values(CertificateStatus).length + 1)
    })
  })
})

it('Should call on submit when "Filtrera" is pressed', async () => {
  const onSubmit = vi.fn()
  render(
    <Provider store={store}>
      <CertificateListFilter onSubmit={onSubmit} />
    </Provider>
  )

  await userEvent.click(screen.getByLabelText('Filtrera'))

  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it('Should reset filters when "Återställ filter" is pressed', async () => {
  render(
    <Provider store={store}>
      <CertificateListFilter onSubmit={vi.fn()} />
    </Provider>
  )

  await waitFor(() => {
    expect(within(screen.getByLabelText('År')).getAllByRole('option').length).toBe(5)
  })

  await Promise.all(
    ['Status', 'Mottagning', 'Intygstyp', 'År'].map((name) =>
      userEvent.selectOptions(screen.getByLabelText(name), within(screen.getByLabelText(name)).getAllByRole('option')[3])
    )
  )

  expect(store.getState().certificateFilter).toEqual({
    statuses: options.statuses[2],
    certificateTypes: options.certificateTypes[2],
    units: options.units[2],
    years: options.years[2],
  })

  await userEvent.click(screen.getByLabelText('Återställ filter'))

  expect(store.getState().certificateFilter).toEqual({})
})
