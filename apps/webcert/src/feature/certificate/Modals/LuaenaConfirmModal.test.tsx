import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { fakePatient } from '../../../faker'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { errorMiddleware } from '../../../store/error/errorMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { LuaenaConfirmModal } from './LuaenaConfirmModal'

let mockDispatchFn = vi.fn()
let testStore: EnhancedStore
const patient = fakePatient()
const setOpen = () => true

const renderComponent = (isOpen: boolean) => {
  render(
    <Provider store={testStore}>
      <MemoryRouter>
        <LuaenaConfirmModal patient={patient} setOpen={setOpen} open={isOpen} />
      </MemoryRouter>
    </Provider>
  )
}

describe('LuaenaConfirmModal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, errorMiddleware])
    mockDispatchFn = vi.fn()
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should show modal if open is true', () => {
    renderComponent(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    renderComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should display patients person id', () => {
    renderComponent(true)
    expect(screen.getByText(patient.personId.id, { exact: false })).toBeInTheDocument()
  })

  it('should display patients full name', () => {
    renderComponent(true)
    expect(screen.getByText(patient.fullName, { exact: false })).toBeInTheDocument()
  })
})

describe('Confirm button', () => {
  it('should show button to proceed', () => {
    renderComponent(true)
    expect(screen.getByText('Gå vidare')).toBeInTheDocument()
  })

  it('should disable confirm button when checkbox in not checked', async () => {
    renderComponent(true)
    const confirmButton = screen.getByText('Gå vidare')

    await expect(confirmButton).toBeDisabled()
  })

  it('should enable confirm button when checkbox in checked', async () => {
    renderComponent(true)
    const confirmCheckbox = screen.getByRole('checkbox')
    await userEvent.click(confirmCheckbox)

    const confirmButton = screen.getByText('Gå vidare')
    await expect(confirmButton).toBeEnabled()
  })

  it('should dispatch create new certificate on proceed', async () => {
    const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)

    const confirmCheckbox = screen.getByRole('checkbox')
    await userEvent.click(confirmCheckbox)

    const confirmButton = screen.getByText('Gå vidare')
    await userEvent.click(confirmButton)
    expect(mockDispatchFn).toHaveBeenCalledTimes(1)
  })
})

describe('Cancel button', () => {
  beforeEach(() => {
    mockDispatchFn = vi.fn()
  })

  it('should show button to cancel', () => {
    renderComponent(true)
    expect(screen.getByText('Avbryt')).toBeInTheDocument()
  })

  it('Cancelling shall not create certificate', async () => {
    const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
    useDispatchSpy.mockReturnValue(mockDispatchFn)

    renderComponent(true)
    const cancelButton = screen.getByText('Avbryt')
    await userEvent.click(cancelButton)

    expect(mockDispatchFn).toHaveBeenCalledTimes(0)
  })
})
