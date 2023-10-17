import { fakeCertificate, fakeHSA, faker, fakerFromSchema } from '@frontend/fake'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { server } from '../../../../mocks/server'
import { CertificateStatus, CertificateStatusEnum } from '../../../../schema/certificateList.schema'
import { certificateFilterOptionsSchema } from '../../../../schema/certificateListFilter.schema'
import { store } from '../../../../store/store'
import { getStatusBadgeLabel } from '../../utils/getStatusBadgeLabel'
import { CertificateListFilter } from './CertificateListFilter'

const options = {
  statuses: CertificateStatusEnum.options,
  certificateTypes: faker.helpers.uniqueArray(fakeCertificate, 4).map(({ id, label }) => ({ id, name: label })),
  units: faker.helpers.uniqueArray(() => ({ id: fakeHSA(), name: faker.company.name() }), 4),
  years: ['2023', '2022', '2021', '2020'],
}

type FilterOption = (typeof options)[keyof typeof options][number]

function getLabel(key: string, option: FilterOption) {
  if (typeof option === 'string') {
    return key === 'statuses' ? getStatusBadgeLabel(option as CertificateStatus) : option
  }
  return option.name
}

function renderComponent() {
  return render(
    <Provider store={store}>
      <CertificateListFilter listed={10} onSubmit={vi.fn()} />
    </Provider>
  )
}

beforeEach(() => {
  server.use(
    rest.get('/api/filters', (_, res, ctx) => res(ctx.status(200), ctx.json(fakerFromSchema(certificateFilterOptionsSchema)(options))))
  )
})

describe('Options from API', () => {
  it.each(['Status', 'Mottagning', 'Intygstyp', 'År'])('Should have corret %s option', async (name) => {
    const { container } = renderComponent()

    await waitFor(() => expect(container).not.toBeEmptyDOMElement())

    expect(
      (within(screen.getByLabelText(name)).getByRole('option', { name: `Välj ${name.toLowerCase()}` }) as HTMLOptionElement).selected
    ).toBe(true)

    await waitFor(() => {
      expect(within(screen.getByLabelText(name)).getAllByRole('option').length).toBe(CertificateStatusEnum.options.length + 1)
    })
  })
})

it('Should call on submit when "Filtrera" is pressed', async () => {
  const onSubmit = vi.fn()
  const { container } = render(
    <Provider store={store}>
      <CertificateListFilter listed={10} onSubmit={onSubmit} />
    </Provider>
  )

  await waitFor(() => expect(container).not.toBeEmptyDOMElement())

  await userEvent.click(screen.getByLabelText('Filtrera'))

  expect(onSubmit).toHaveBeenCalledTimes(1)
})

it.each([
  ['Status', 'statuses'],
  ['Mottagning', 'units'],
  ['Intygstyp', 'certificateTypes'],
  ['År', 'years'],
] as [string, keyof typeof options][])('Should reset %s when "Återställ filter" is pressed', async (fieldName, key) => {
  const { container } = renderComponent()
  const option = options[key][2]

  await waitFor(() => expect(container).not.toBeEmptyDOMElement())

  await userEvent.selectOptions(
    screen.getByLabelText(fieldName),
    within(screen.getByLabelText(fieldName)).getByRole('option', {
      name: getLabel(key, option),
    })
  )

  expect(store.getState().certificateFilter).toMatchObject({
    [key]: typeof option === 'string' ? option : option.id,
  })

  await userEvent.click(screen.getByLabelText('Återställ filter'))

  expect(store.getState().certificateFilter).toEqual({})
})
