import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { CertificateStatusEnum } from '../../../../schema/certificateList.schema'
import { store } from '../../../../store/store'
import { CertificateStatusFilter } from './CertificateStatusFilter'

beforeEach(() => {
  render(
    <Provider store={store}>
      <CertificateStatusFilter options={CertificateStatusEnum.options} />
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
  expect(screen.getAllByRole('option').length).toBe(CertificateStatusEnum.options.length + 1)
})

it('should update on selection', async () => {
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'REPLACED' }))
  expect((screen.getByRole('option', { name: 'REPLACED' }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.statuses).toBe('REPLACED')
})
