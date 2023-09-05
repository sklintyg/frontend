import { fakeCertificateId, faker } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '../../../../store/store'
import { CertificateTypeFilter } from './CertificateTypeFilter'

const options = faker.helpers.uniqueArray(fakeCertificateId, 4)

beforeEach(() => {
  render(
    <Provider store={store}>
      <CertificateTypeFilter options={options} />
    </Provider>
  )
})

it('Should have default value in store', () => {
  expect(store.getState().certificateFilter.certificateTypes).toBe(undefined)
})

it('should have default selected', () => {
  expect((screen.getByRole('option', { name: 'Välj intygstyp' }) as HTMLOptionElement).selected).toBe(true)
})

it('Should have correct options', () => {
  expect(screen.getAllByRole('option').length).toBe(options.length + 1)
})

it('should update on selection', async () => {
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: options[3] }))
  expect((screen.getByRole('option', { name: options[3] }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.certificateTypes).toBe(options[3])
})
