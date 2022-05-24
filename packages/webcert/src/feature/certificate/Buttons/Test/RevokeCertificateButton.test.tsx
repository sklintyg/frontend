import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { CustomTooltip } from '@frontend/common/src'
import RevokeCertificateButton from '../RevokeCertificateButton'
import store from '../../../../store/store'

const NAME = 'Revoke button name'
const DESCRIPTION = 'Revoke button description'
const REVOKE_BUTTON_TEXT = 'Makulera'
const OTHER_REASON_LABEL = 'Annat allvarligt fel'
const WRONG_PATIENT_LABEL = 'Intyget har utfärdats på fel patient'

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <Provider store={store}>
      <CustomTooltip />
      <RevokeCertificateButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} />
    </Provider>
  )
}

const openModal = () => {
  const button = screen.getByRole('button')
  userEvent.click(button)
}

describe('Revoke continue button', () => {
  beforeEach(() => {
    store.dispatch = jest.fn()
  })

  it('shall enable button when enabled is true', () => {
    renderDefaultComponent(true)
    const button = screen.getByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false', () => {
    renderDefaultComponent(false)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall set the name of button', () => {
    renderDefaultComponent(true)
    const name = screen.getByText(NAME)
    expect(name).toBeInTheDocument()
  })

  it('shall set the description of button', () => {
    renderDefaultComponent(true)
    userEvent.hover(screen.getByText(NAME))
    const description = screen.getByText(DESCRIPTION)
    expect(description).toBeInTheDocument()
  })

  it('shall open modal when clicked', () => {
    renderDefaultComponent(true)
    openModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shall have revoke button disabled if radio button is not chosen', () => {
    renderDefaultComponent(true)
    openModal()
    const revokeButton = screen.queryByText(REVOKE_BUTTON_TEXT)
    expect(revokeButton).toBeDisabled()
  })

  it('shall have revoke button enabled by default if radio button wrong patient is chosen', () => {
    renderDefaultComponent(true)
    openModal()
    const radioButton = screen.getByText(WRONG_PATIENT_LABEL)
    userEvent.click(radioButton)
    expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeEnabled()
  })

  it('shall have revoke button disabled if radio button other reason is chosen and message is empty', () => {
    renderDefaultComponent(true)
    openModal()
    const radioButton = screen.getByText(OTHER_REASON_LABEL)
    userEvent.click(radioButton)
    expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeDisabled()
  })

  it('shall have revoke button enabled if radio button other reason is chosen and message is not empty', () => {
    renderDefaultComponent(true)
    openModal()
    const radioButton = screen.getByText(OTHER_REASON_LABEL)
    userEvent.click(radioButton)
    userEvent.type(screen.getByRole('textbox'), 'test')
    expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeEnabled()
  })

  it('shall have revoke button enabled if radio button other reason is chosen and message is not empty', () => {
    renderDefaultComponent(true)
    openModal()
    const radioButton = screen.getByText(OTHER_REASON_LABEL)
    userEvent.click(radioButton)
    userEvent.type(screen.getByRole('textbox'), 'test')
    expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeEnabled()
  })

  it('shall dispatch revoke certificate when revoke is pressed', () => {
    renderDefaultComponent(true)
    openModal()
    const radioButton = screen.getByText(WRONG_PATIENT_LABEL)
    userEvent.click(radioButton)
    userEvent.click(screen.getByLabelText(REVOKE_BUTTON_TEXT))
    expect(store.dispatch).toHaveBeenCalledTimes(1)
  })

  it('shall not dispatch revoke certificate when cancel is pressed', () => {
    renderDefaultComponent(true)
    openModal()
    userEvent.click(screen.getByText('Avbryt'))
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('shall dispatch with chosen reason, message and title for other reason', () => {
    renderDefaultComponent(true)
    openModal()
    userEvent.click(screen.getByText(OTHER_REASON_LABEL))
    userEvent.type(screen.getByRole('textbox'), 'test')
    userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { reason: 'ANNAT_ALLVARLIGT_FEL', message: 'test', title: OTHER_REASON_LABEL },
      type: '[CERTIFICATE] Revoke certificate',
    })
  })

  it('shall dispatch with chosen reason, message and title for wrong patient', () => {
    renderDefaultComponent(true)
    openModal()
    userEvent.click(screen.getByText(WRONG_PATIENT_LABEL))
    userEvent.type(screen.getByRole('textbox'), 'test')
    userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))
    expect(store.dispatch).toHaveBeenCalledWith({
      payload: { reason: 'FEL_PATIENT', message: 'test', title: WRONG_PATIENT_LABEL },
      type: '[CERTIFICATE] Revoke certificate',
    })
  })
})
