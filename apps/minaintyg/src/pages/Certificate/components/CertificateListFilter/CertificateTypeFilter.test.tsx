import { fakeCertificate, faker } from '@frontend/fake'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { expect, it } from 'vitest'
import { CertificateTypeFilter } from './CertificateTypeFilter'
import { store } from '../../../../store/store'

const options = faker.helpers.uniqueArray(fakeCertificate, 4).map(({ id, label }) => ({ id, name: label }))

function renderComponent() {
  return render(
    <Provider store={store}>
      <CertificateTypeFilter options={options} />
    </Provider>
  )
}

it('Should have default value in store', () => {
  renderComponent()
  expect(store.getState().certificateFilter.certificateTypes).toBe(undefined)
})

it('Should have correct label', () => {
  renderComponent()
  expect(screen.getByRole('combobox', { name: 'Intygstyp' })).toBeInTheDocument()
})

it('Should have default selected', () => {
  renderComponent()
  expect((screen.getByRole('option', { name: 'Välj intygstyp' }) as HTMLOptionElement).selected).toBe(true)
})

it('Should have correct options', () => {
  renderComponent()
  expect(screen.getAllByRole('option').length).toBe(options.length + 1)
})

it('Should update on selection', async () => {
  renderComponent()
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: options[3].name }))
  expect((screen.getByRole('option', { name: options[3].name }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.certificateTypes).toBe(options[3].id)
})
