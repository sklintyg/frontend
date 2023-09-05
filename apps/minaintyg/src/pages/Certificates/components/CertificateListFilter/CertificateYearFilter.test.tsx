import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { store } from '../../../../store/store'
import { CertificateYearFilter } from './CertificateYearFilter'

const options = ['2023', '2022', '2021', '2020']

beforeEach(() => {
  render(
    <Provider store={store}>
      <CertificateYearFilter options={options} />
    </Provider>
  )
})

it('Should have default value in store', () => {
  expect(store.getState().certificateFilter.years).toBe(undefined)
})

it('should have default selected', () => {
  expect((screen.getByRole('option', { name: 'Välj år' }) as HTMLOptionElement).selected).toBe(true)
})

it('Should have correct options', () => {
  expect(screen.getAllByRole('option').length).toBe(options.length + 1)
})

it('should update on selection', async () => {
  await userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: options[3] }))
  expect((screen.getByRole('option', { name: options[3] }) as HTMLOptionElement).selected).toBe(true)
  expect(store.getState().certificateFilter.years).toBe(options[3])
})
