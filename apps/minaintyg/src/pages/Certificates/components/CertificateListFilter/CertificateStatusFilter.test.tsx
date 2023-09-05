import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { CertificateStatus } from '../../../../schema/certificateList.schema'
import { store } from '../../../../store/store'
import { CertificateStatusFilter } from './CertificateStatusFilter'

beforeEach(() => {
  render(
    <Provider store={store}>
      <CertificateStatusFilter options={Object.values(CertificateStatus)} />
    </Provider>
  )
})

it('Should have default value in store', () => {
  expect(store.getState().certificateFilter.statuses).toBe(undefined)
})

it('should have default selected', () => {
  expect((screen.getByRole('option', { name: 'Välj status' }) as HTMLOptionElement).selected).toBe(true)
})

it('Should have correct options', () => {
  expect(screen.getAllByRole('option').length).toBe(Object.values(CertificateStatus).length + 1)
})

it('should update on selection', async () => {
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'Ersätter intyg' }))
  expect((screen.getByRole('option', { name: 'Ersätter intyg' }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.statuses).toBe('Ersätter intyg')
})
