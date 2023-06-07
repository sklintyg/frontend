import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria'
import { DateField } from './DateField'

it('should render without errors', () => {
  expect(() => render(<DateField label="datumfält" />)).not.toThrow()
})

it('should render placeholders', () => {
  render(<DateField label="datumfält" />)
  expect(screen.getByText('mm')).toBeInTheDocument()
  expect(screen.getByText('dd')).toBeInTheDocument()
  expect(screen.getByText('yyyy')).toBeInTheDocument()
})

it('should render placeholders with swedish locales', () => {
  render(
    <I18nProvider locale="sv-SE">
      <DateField label="datumfält" />
    </I18nProvider>
  )
  expect(screen.getByText('åååå')).toBeInTheDocument()
  expect(screen.getByText('mm')).toBeInTheDocument()
  expect(screen.getByText('dd')).toBeInTheDocument()
})

it('Should be possible to enter a year', async () => {
  userEvent.setup()
  render(
    <I18nProvider locale="sv-SE">
      <DateField label="datumfält" />
    </I18nProvider>
  )
  await userEvent.type(screen.getByLabelText('år'), '1999')
  expect(screen.getByLabelText('år')).toHaveTextContent('1999')
})

it('Should be possible to enter a month', async () => {
  userEvent.setup()
  render(
    <I18nProvider locale="sv-SE">
      <DateField label="datumfält" />
    </I18nProvider>
  )
  await userEvent.type(screen.getByLabelText('månad'), '09')
  expect(screen.getByLabelText('månad')).toHaveTextContent('09')
})

it('Should be possible to enter a day', async () => {
  userEvent.setup()
  render(
    <I18nProvider locale="sv-SE">
      <DateField label="datumfält" />
    </I18nProvider>
  )
  await userEvent.type(screen.getByLabelText('dag'), '11')
  expect(screen.getByLabelText('dag')).toHaveTextContent('11')
})
