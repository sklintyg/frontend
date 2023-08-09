import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { Route, RouterProvider, createMemoryRouter, createRoutesFromChildren, useNavigate } from 'react-router-dom'
import { vi } from 'vitest'
import { store } from '../../../../store/store'
import { PatientContext, usePatientState } from '../../hooks/usePatient'
import { OpenTabsDialog } from './OpenTabsDialog'

function TestComponent() {
  const patientState = usePatientState()
  const navigate = useNavigate()

  return (
    <PatientContext.Provider value={patientState}>
      <OpenTabsDialog />
      <button type="button" aria-label="Open webcert" onClick={() => patientState.navigateToWebcert('test')} />
      <button type="button" aria-label="Navigate" onClick={() => navigate('/welcome')} />
    </PatientContext.Provider>
  )
}

function renderComponent() {
  render(
    <Provider store={store}>
      <RouterProvider
        router={createMemoryRouter(
          createRoutesFromChildren([
            <Route key="1" path="/" element={<TestComponent />} />,
            <Route key="2" path="/welcome" element={<p>Welcome</p>} />,
          ])
        )}
      />
    </Provider>
  )
}

beforeEach(() => {
  function fakeWindow() {
    let closed = false
    return {
      closed,
      close: () => {
        closed = !closed
      },
    }
  }
  vi.spyOn(window, 'open').mockReturnValue(fakeWindow() as Window)
})

it('Should stop navigation when there are open tabs', async () => {
  renderComponent()

  await userEvent.click(screen.getByRole('button', { name: 'Open webcert' }))
  expect(screen.getByTestId('open-tabs-dialog')).toBeInTheDocument()
  expect(screen.getByTestId('open-tabs-dialog')).toHaveAttribute('show', 'false')

  await userEvent.click(screen.getByRole('button', { name: 'Navigate' }))
  expect(screen.getByTestId('open-tabs-dialog')).toHaveAttribute('show', 'true')
  expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
})

it('Should hide the dialog when cancel is pressed', async () => {
  renderComponent()

  await userEvent.click(screen.getByRole('button', { name: 'Open webcert' }))
  await userEvent.click(screen.getByRole('button', { name: 'Navigate' }))
  expect(screen.getByTestId('open-tabs-dialog')).toHaveAttribute('show', 'true')

  await userEvent.click(screen.getByText('Avbryt'))
  expect(screen.getByTestId('open-tabs-dialog')).toHaveAttribute('show', 'false')
  expect(screen.queryByText('Welcome')).not.toBeInTheDocument()
})

it('Should close tabs and navigate away when close is pressed', async () => {
  renderComponent()

  await userEvent.click(screen.getByRole('button', { name: 'Open webcert' }))
  await userEvent.click(screen.getByRole('button', { name: 'Navigate' }))
  expect(screen.getByTestId('open-tabs-dialog')).toHaveAttribute('show', 'true')

  await userEvent.click(screen.getByText('Stäng patientvy'))
  expect(screen.getByText('Welcome')).toBeInTheDocument()
})
