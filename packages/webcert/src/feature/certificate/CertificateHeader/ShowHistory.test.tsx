import React from 'react'
import { render, screen, waitForDomChange } from '@testing-library/react'
import ShowHistory from './ShowHistory'
import userEvent from '@testing-library/user-event'

it('displays history entries', async () => {
  // @ts-expect-error: We don't need to fill the whole object with data
  const mockHistoryEntries: CertificateEvent[] = [
    {
      certificateId: '',
      type: 'CREATED',
      timestamp: '2020-10-14T12:56:58.523Z',
    },
    {
      type: 'SIGNED',
      timestamp: '2020-10-14T19:59:17.565Z',
    },
    {
      type: 'AVAILABLE_FOR_PATIENT',
      timestamp: '2020-10-14T19:59:17.565Z',
    },
    {
      type: 'SENT',
      timestamp: '2020-10-14T19:59:17.565Z',
    },
  ]

  // @ts-expect-error: We don't need to send all props
  render(<ShowHistory historyEntries={mockHistoryEntries} />)

  expect(screen.getByText('Visa alla händelser')).toBeInTheDocument()
  userEvent.click(screen.getByText('Visa alla händelser'))

  expect(screen.getByText(/2020-10-14 14:56 utkastet är skapat/i)).toBeInTheDocument()
  expect(screen.getByText(/2020-10-14 21:59 intyget är signerat/i)).toBeInTheDocument()
  expect(screen.getByText(/2020-10-14 21:59 intyget är tillgängligt för patienten/i)).toBeInTheDocument()
  expect(screen.getByText(/2020-10-14 21:59 intyget är skickat till arbetsförmedlingen/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /stäng/i })).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /stäng/i }))
  await waitForDomChange()

  expect(screen.queryByText(/2020-10-14 14:56 utkastet är skapat/i)).not.toBeInTheDocument()
})
