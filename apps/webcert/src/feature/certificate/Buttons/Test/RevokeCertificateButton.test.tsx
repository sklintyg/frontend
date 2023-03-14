import { Certificate, CustomTooltip, fakeCertificate, fakeCertificateMetaData, QuestionType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { apiMiddleware } from '../../../../store/api/apiMiddleware'
import { revokeCertificate, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import { updateQuestions } from '../../../../store/question/questionActions'
import store from '../../../../store/store'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import RevokeCertificateButton from '../RevokeCertificateButton'

const NAME = 'Revoke button name'
const DESCRIPTION = 'Revoke button description'
const REVOKE_BUTTON_TEXT = 'Makulera'
const OTHER_REASON_LABEL = 'Annat allvarligt fel'
const WRONG_PATIENT_LABEL = 'Intyget har utfärdats på fel patient'
const UNHANDLED_QUESTIONS_TEXT = 'Om du går vidare och makulerar intyget kommer dina ej hanterade ärenden markeras som hanterade.'

let testStore: EnhancedStore

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <Provider store={store}>
      <CustomTooltip />
      <RevokeCertificateButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} />
    </Provider>
  )
}

const renderComponentWithTestStore = (enabled: boolean) => {
  render(
    <Provider store={testStore}>
      <CustomTooltip />
      <RevokeCertificateButton name={NAME} description={DESCRIPTION} enabled={enabled} functionDisabled={false} />
    </Provider>
  )
}

const openModal = () => {
  const button = screen.getByRole('button')
  userEvent.click(button)
}

describe('Revoke certificate with unhandled questions', () => {
  it('shall not show unhandled questions text if no unhandled questions', () => {
    renderDefaultComponent(true)
    openModal()

    expect(screen.queryByText(UNHANDLED_QUESTIONS_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('shall show unhandled questions text if unhandled questions', () => {
    store.dispatch(
      updateQuestions([
        {
          id: 'id',
          type: QuestionType.CONTACT,
          handled: false,
          message: '',
          subject: '',
          author: '',
          sent: '',
          forwarded: false,
          complements: [],
          lastUpdate: '',
          links: [],
          reminders: [],
        },
      ])
    )

    renderDefaultComponent(true)
    openModal()

    expect(screen.queryByText(UNHANDLED_QUESTIONS_TEXT, { exact: false })).toBeInTheDocument()
  })
})

describe('Revoke continue button', () => {
  beforeEach(() => {
    store.dispatch = vi.fn()
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

  describe('isDodsbevis', () => {
    const createCertificate = (): Certificate => fakeCertificate({ metadata: fakeCertificateMetaData({ type: 'db' }) })

    beforeEach(() => {
      testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, certificateMiddleware])

      const certificate = createCertificate()
      testStore.dispatch(updateCertificate(certificate))
    })

    afterEach(() => clearDispatchedActions())

    it('shall enable confirm button if isDodsbevis', () => {
      renderComponentWithTestStore(true)
      openModal()

      const revokeButton = screen.queryByText(REVOKE_BUTTON_TEXT)
      expect(revokeButton).toBeEnabled()
    })

    it('shall dispatch revoke certificate when revoke is pressed', () => {
      renderComponentWithTestStore(true)
      openModal()
      userEvent.click(screen.getByLabelText(REVOKE_BUTTON_TEXT))

      const revokeCertificateAction = dispatchedActions.find((action) => revokeCertificate.match(action))
      expect(revokeCertificateAction).toBeDefined()
    })

    it('shall dispatch with empty reason, message and title', () => {
      renderComponentWithTestStore(true)
      openModal()
      userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))

      const revokeCertificateAction = dispatchedActions.find((action) => revokeCertificate.match(action))
      expect(revokeCertificateAction?.payload).toEqual({ reason: '', message: '', title: '' })
    })
  })
})
