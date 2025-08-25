import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '../../../../store/store'
import { CertificateTypeFilter } from './CertificateTypeFilter'

const options = Array.from({ length: 4 }, (_, i) => ({ id: `${i}`, name: `name ${i}` }))

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
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'name 3' }))
  expect((screen.getByRole('option', { name: 'name 3' }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.certificateTypes).toBe('3')
})
