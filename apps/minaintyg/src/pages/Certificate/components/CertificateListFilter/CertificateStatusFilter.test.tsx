import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { CertificateStatusEnum } from '../../../../schema/certificate.schema'
import { store } from '../../../../store/store'
import { CertificateStatusFilter } from './CertificateStatusFilter'

function renderComponent() {
  return render(
    <Provider store={store}>
      <CertificateStatusFilter options={CertificateStatusEnum.options} />
    </Provider>
  )
}

it('Should have default value in store', () => {
  renderComponent()
  expect(store.getState().certificateFilter.statuses).toBe(undefined)
})

it('Should have correct label', () => {
  renderComponent()
  expect(screen.getByRole('combobox', { name: 'Status' })).toBeInTheDocument()
})

it('Should have default selected', () => {
  renderComponent()
  expect((screen.getByRole('option', { name: 'Välj status' }) as HTMLOptionElement).selected).toBe(true)
})

it('Should have correct options', () => {
  renderComponent()
  expect(screen.getAllByRole('option').length).toBe(CertificateStatusEnum.options.length + 1)
})

it('Should update on selection', async () => {
  renderComponent()
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'Ersätter intyg' }))
  expect((screen.getByRole('option', { name: 'Ersätter intyg' }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.statuses).toBe('REPLACED')
})
