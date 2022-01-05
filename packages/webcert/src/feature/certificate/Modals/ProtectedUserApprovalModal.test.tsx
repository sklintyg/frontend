import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import ProtectedUserApprovalModal from './ProtectedUserApprovalModal'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import userEvent from '@testing-library/user-event'

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
  useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Create certificate from candidate modal', () => {
  it('shall render without crashing', () => {
    renderDefaultComponent(true)
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

  it('shall enable confirm button if checkbox is checked', () => {
    renderDefaultComponent(true)
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall enable confirm button if checkbox is checked', () => {
    renderDefaultComponent(true)
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall dispatch error if cancel button is pressed', () => {
    renderDefaultComponent(true)
    userEvent.click(screen.getByText('Avbryt'))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(useDispatchSpy).toBeCalled()
  })
})
