import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PPRegistrationDone } from './PPRegistrationDone'

it('Should navigate back to startpage on button click', async () => {
  render(
    <MemoryRouter initialEntries={['/done']}>
      <Routes>
        <Route path="/done" element={<PPRegistrationDone />} />
        <Route path="/" element="Start" />
      </Routes>
    </MemoryRouter>
  )

  await userEvent.click(screen.getByRole('button', { name: 'Till Webcert' }))
  expect(screen.getByText('Start')).toBeInTheDocument()
})
