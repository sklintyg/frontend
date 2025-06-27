import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import { fakeCertificate, fakeCertificateMetaData } from '../../../faker'
import { apiMiddleware } from '../../../store/api/apiMiddleware'
import { revokeCertificate, updateCertificate } from '../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateQuestions } from '../../../store/question/questionActions'
import { questionMiddleware } from '../../../store/question/questionMiddleware'
import { clearDispatchedActions, dispatchedActions, dispatchHelperMiddleware } from '../../../store/test/dispatchHelperMiddleware'
import type { Certificate } from '../../../types'
import { QuestionType } from '../../../types'
import RevokeCertificateButton from './RevokeCertificateButton'

const NAME = 'Revoke button name'
const DESCRIPTION = 'Revoke button description'
const REVOKE_BUTTON_TEXT = 'Makulera'
const OTHER_REASON_LABEL = 'Annat allvarligt fel'
const WRONG_PATIENT_LABEL = 'Intyget har utfärdats på fel patient'
const UNHANDLED_QUESTIONS_TEXT = 'Om du går vidare och makulerar intyget kommer dina ej hanterade ärenden markeras som hanterade.'

let testStore: EnhancedStore

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <Provider store={testStore}>
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

const openModal = async () => {
  const button = screen.getByRole('button')
  await userEvent.click(button)
}

beforeEach(() => {
  testStore = configureApplicationStore([questionMiddleware])
})

describe('Revoke certificate with unhandled questions', () => {
  it('shall not show unhandled questions text if no unhandled questions', () => {
    renderDefaultComponent(true)
    openModal()

    expect(screen.queryByText(UNHANDLED_QUESTIONS_TEXT, { exact: false })).not.toBeInTheDocument()
  })

  it('shall show unhandled questions text if unhandled questions', async () => {
    testStore.dispatch(
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
          certificateId: '',
        },
      ])
    )

    renderDefaultComponent(true)
    openModal()

    expect(await screen.findByText(UNHANDLED_QUESTIONS_TEXT, { exact: false })).toBeInTheDocument()
  })
})

describe('Revoke continue button', () => {
  it('shall enable button when enabled is true', async () => {
    renderDefaultComponent(true)
    const button = screen.getByRole('button')
    await expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false', async () => {
    renderDefaultComponent(false)
    const button = screen.getByRole('button')
    await expect(button).toBeDisabled()
  })

  it('shall set the name of button', () => {
    renderDefaultComponent(true)
    const name = screen.getByText(NAME)
    expect(name).toBeInTheDocument()
  })

  it('shall set the description of button', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.getByText(DESCRIPTION)
    expect(description).toBeInTheDocument()
  })

  it('shall open modal when clicked', async () => {
    renderDefaultComponent(true)
    openModal()
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('shall have revoke button disabled if radio button is not chosen', async () => {
    renderDefaultComponent(true)
    openModal()
    expect(await screen.findByText(REVOKE_BUTTON_TEXT)).toBeInTheDocument()
    const revokeButton = screen.queryByText(REVOKE_BUTTON_TEXT)
    await expect(revokeButton).toBeDisabled()
  })

  it('shall have revoke button enabled by default if radio button wrong patient is chosen', async () => {
    renderDefaultComponent(true)
    openModal()
    expect(await screen.findByText(WRONG_PATIENT_LABEL)).toBeInTheDocument()
    const radioButton = screen.getByText(WRONG_PATIENT_LABEL)
    await userEvent.click(radioButton)
    await expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeEnabled()
  })

  it('shall have revoke button disabled if radio button other reason is chosen and message is empty', async () => {
    renderDefaultComponent(true)
    openModal()
    expect(await screen.findByText(OTHER_REASON_LABEL)).toBeInTheDocument()
    const radioButton = screen.getByText(OTHER_REASON_LABEL)
    await userEvent.click(radioButton)
    await expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeDisabled()
  })

  it('shall have revoke button enabled if radio button other reason is chosen and message is not empty', async () => {
    renderDefaultComponent(true)
    openModal()
    expect(await screen.findByText(OTHER_REASON_LABEL)).toBeInTheDocument()
    const radioButton = screen.getByText(OTHER_REASON_LABEL)
    await userEvent.click(radioButton)
    await userEvent.type(screen.getByRole('textbox'), 'test')
    await expect(screen.getByLabelText(REVOKE_BUTTON_TEXT)).toBeEnabled()
  })

  it('shall dispatch revoke certificate when revoke is pressed', async () => {
    renderDefaultComponent(true)
    const spy = vi.spyOn(testStore, 'dispatch')
    openModal()
    expect(await screen.findByText(WRONG_PATIENT_LABEL)).toBeInTheDocument()
    const radioButton = screen.getByText(WRONG_PATIENT_LABEL)
    await userEvent.click(radioButton)
    await userEvent.click(screen.getByLabelText(REVOKE_BUTTON_TEXT))
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('shall not dispatch revoke certificate when cancel is pressed', async () => {
    renderDefaultComponent(true)
    const spy = vi.spyOn(testStore, 'dispatch')
    openModal()
    expect(await screen.findByText('Avbryt')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Avbryt'))
    expect(spy).not.toHaveBeenCalled()
  })

  it('shall dispatch with chosen reason, message and title for other reason', async () => {
    renderDefaultComponent(true)
    const spy = vi.spyOn(testStore, 'dispatch')
    openModal()
    expect(await screen.findByText(OTHER_REASON_LABEL)).toBeInTheDocument()
    await userEvent.click(screen.getByText(OTHER_REASON_LABEL))
    await userEvent.type(screen.getByRole('textbox'), 'test')
    await userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))
    expect(spy).toHaveBeenCalledWith({
      payload: { reason: 'ANNAT_ALLVARLIGT_FEL', message: 'test', title: OTHER_REASON_LABEL },
      type: '[CERTIFICATE] Revoke certificate',
    })
  })

  it('shall dispatch with chosen reason, message and title for wrong patient', async () => {
    renderDefaultComponent(true)
    const spy = vi.spyOn(testStore, 'dispatch')
    openModal()
    expect(await screen.findByText(WRONG_PATIENT_LABEL)).toBeInTheDocument()
    await userEvent.click(screen.getByText(WRONG_PATIENT_LABEL))
    await userEvent.type(screen.getByRole('textbox'), 'test')
    await userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))
    expect(spy).toHaveBeenCalledWith({
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

    it('shall enable confirm button if isDodsbevis', async () => {
      renderComponentWithTestStore(true)
      openModal()

      await expect(await screen.findByText(REVOKE_BUTTON_TEXT)).toBeEnabled()
    })

    it('shall dispatch revoke certificate when revoke is pressed', async () => {
      renderComponentWithTestStore(true)
      openModal()
      expect(await screen.findByText(REVOKE_BUTTON_TEXT)).toBeInTheDocument()
      await userEvent.click(screen.getByLabelText(REVOKE_BUTTON_TEXT))

      const revokeCertificateAction = dispatchedActions.find((action) => revokeCertificate.match(action))
      expect(revokeCertificateAction).toBeDefined()
    })

    it('shall dispatch with empty reason, message and title', async () => {
      renderComponentWithTestStore(true)
      openModal()
      expect(await screen.findByText(REVOKE_BUTTON_TEXT)).toBeInTheDocument()
      await userEvent.click(screen.getByText(REVOKE_BUTTON_TEXT))

      const revokeCertificateAction = dispatchedActions.find((action) => revokeCertificate.match(action))
      expect(revokeCertificateAction?.payload).toEqual({ reason: '', message: '', title: '' })
    })
  })
})
