import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import store from '../../../store/store'
import ProtectedUserApprovalModal from './ProtectedUserApprovalModal'

const renderDefaultComponent = (showModal: boolean) => {
  render(
    <Provider store={store}>
      <ProtectedUserApprovalModal showModal={showModal} preferenceKey={'KEY'}></ProtectedUserApprovalModal>
    </Provider>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let useDispatchSpy
beforeEach(() => {
  useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
})

describe('Create certificate from candidate modal', () => {
  it('shall render without crashing', () => {
    expect(() => renderDefaultComponent(true)).not.toThrow()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent(true)
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    renderDefaultComponent(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shall set title for modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Användning av Webcert med skyddade personuppgifter')).toBeInTheDocument()
  })

  it('shall set body for modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Du har skyddade personuppgifter.')).toBeInTheDocument()
  })

  it('shall show checkbox in modal', () => {
    renderDefaultComponent(true)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shall disable confirm button if checkbox is unchecked', () => {
    renderDefaultComponent(true)
    expect(screen.getByText('Till Webcert')).toBeDisabled()
  })

  it('shall enable confirm button if checkbox is checked', async () => {
    renderDefaultComponent(true)
    await act(() => userEvent.click(screen.getByRole('checkbox')))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall dispatch error if cancel button is pressed', async () => {
    renderDefaultComponent(true)
    await act(() => userEvent.click(screen.getByText('Avbryt')))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(useDispatchSpy).toHaveBeenCalled()
  })
})
