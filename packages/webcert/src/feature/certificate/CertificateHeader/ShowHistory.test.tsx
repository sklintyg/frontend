import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ShowHistory from './ShowHistory'

it('displays history entries', (): void => {
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

  // @ts-expect-error: We don't need to fill the whole object with data
  render(<ShowHistory historyEntries={mockHistoryEntries} certificateMetadata={{}} />)

  fireEvent.click(screen.getByText('Visa alla händelser'))
  screen.getByText(/2020-10-14 14:56 utkastet är skapat/i)
  screen.getByText(/2020-10-14 21:59 intyget är signerat/i)
  screen.getByText(/2020-10-14 21:59 intyget är tillgängligt för patienten/i)
  screen.getByText(/2020-10-14 21:59 intyget är skickat till arbetsförmedlingen/i)
  screen.getByRole('button', { name: /stäng/i })
})
