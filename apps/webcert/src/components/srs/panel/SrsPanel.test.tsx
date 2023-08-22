import { render, screen } from '@testing-library/react'
import SrsPanel, { SRS_TITLE } from './SrsPanel'
import { Provider } from 'react-redux'
import {
  logSrsInteraction,
  setDiagnosisCodes,
  updateCertificateId,
  updateError,
  updateLoggedCertificateId,
  updateSrsInfo,
  updateSrsPredictions,
  updateSrsQuestions,
} from '../../../store/srs/srsActions'
import { updateCertificate } from '../../../store/certificate/certificateActions'
import { fakeCertificate, fakeDiagnosesElement, fakeSrsInfo, fakeSrsPrediction, fakeSrsQuestion } from '@frontend/common'
import { SRS_OBSERVE_TITLE, SRS_RECOMMENDATIONS_TITLE } from '../recommendations/SrsRecommendations'
import { SRS_RECOMMENDATIONS_BUTTON_TEXT, SRS_STATISTICS_BUTTON_TEXT } from '../choices/SrsInformationChoices'
import userEvent from '@testing-library/user-event'
import { SRS_STATISTICS_TITLE } from '../statistics/SrsNationalStatistics'
import { SICKLEAVE_CHOICES_TEXTS } from '../srsUtils'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { EnhancedStore } from '@reduxjs/toolkit'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import { SRS_RISK_BUTTON_TEXT } from '../risk/SrsRisk'
import { vi } from 'vitest'

const renderComponent = (minimizedView?: boolean) => {
  render(
    <Provider store={store}>
      <SrsPanel minimizedView={minimizedView} isPanelActive />
    </Provider>
  )
}

let store: EnhancedStore

describe('SrsPanel', () => {
  beforeEach(() => {
    store = configureApplicationStore([dispatchHelperMiddleware, srsMiddleware])
    HTMLElement.prototype.scrollIntoView = vi.fn()

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  beforeEach(() => {
    clearDispatchedActions()
  })

  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  it('should log if panel is active and loggedCertificate does not match certificateId', () => {
    const certiticateId = 'certiticateId'
    const loggedCertificateId = 'certiticateId2'
    store.dispatch(updateCertificateId(certiticateId))
    store.dispatch(updateLoggedCertificateId(loggedCertificateId))
    renderComponent()
    expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
  })

  it('should not log if panel is active and loggedCertificate matches certificateId', () => {
    const certiticateId = 'certiticateId'
    const loggedCertificateId = 'certiticateId'
    store.dispatch(updateCertificateId(certiticateId))
    store.dispatch(updateLoggedCertificateId(loggedCertificateId))
    renderComponent()
    expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).toBeUndefined()
  })

  it('should not log if panel is inactive', () => {
    render(
      <Provider store={store}>
        <SrsPanel minimizedView isPanelActive={false} />
      </Provider>
    )
    expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).toBeUndefined()
  })

  it('should show title', () => {
    renderComponent()
    expect(screen.getByText(SRS_TITLE)).toBeInTheDocument()
  })

  describe('error', () => {
    it('should show error if state has error set', () => {
      renderComponent()
      store.dispatch(updateError(true))
      expect(screen.getByText('Tekniskt fel', { exact: false })).toBeInTheDocument()
    })

    it('should not show footer if state has error set', () => {
      renderComponent()
      store.dispatch(updateError(true))
      expect(screen.queryByText('Mer information')).not.toBeInTheDocument()
    })
  })

  describe('empty', () => {
    it('should show empty message if no diagnosis is chosen', () => {
      renderComponent()
      store.dispatch(updateError(false))
      expect(screen.getByText('Ange minst en diagnos för att få stöd för sjukskrivning.')).toBeInTheDocument()
    })

    it('should show empty message if diagnosis is chosen but it is not main diagnosis', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '1' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(updateError(false))
      expect(screen.getByText('Ange minst en diagnos för att få stöd för sjukskrivning.')).toBeInTheDocument()
    })

    it('should show empty message if diagnosis has empty code', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: '', id: '0' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(updateError(false))
      expect(screen.getByText('Ange minst en diagnos för att få stöd för sjukskrivning.')).toBeInTheDocument()
    })

    it('should not show footer if no diagnois is chosen', () => {
      renderComponent()
      store.dispatch(updateError(false))
      expect(screen.queryByText('Mer information')).not.toBeInTheDocument()
    })
  })

  describe('no support', () => {
    it('should show no support if diagnosis without support is chosen', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '0' }] } })
      store.dispatch(setDiagnosisCodes([]))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.getByText('För den angivna diagnosen finns för tillfället inget stöd för sjukskrivning.')).toBeInTheDocument()
    })

    it('should not show footer if diagnosis without support is chosen', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '0' }] } })
      store.dispatch(setDiagnosisCodes([]))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.queryByText('Mer information')).not.toBeInTheDocument()
    })
  })

  describe('parent diagnosis has support', () => {
    beforeEach(() => {
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'M792', id: '0' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(setDiagnosisCodes(['M79']))
    })

    it('should show support info is sub diagnosis has parent diagnosis with support', () => {
      renderComponent()
      expect(screen.getByText('Riskberäkningen gäller:')).toBeInTheDocument()
    })
  })

  describe('has support and minimized view', () => {
    beforeEach(() => {
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '0' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateSrsInfo(fakeSrsInfo()))
    })

    it('should show footer', () => {
      renderComponent(true)
      expect(screen.getByText('Mer information')).toBeInTheDocument()
    })

    it('should not show radio buttons', () => {
      renderComponent(true)
      expect(screen.queryByText(SICKLEAVE_CHOICES_TEXTS[0])).not.toBeInTheDocument()
    })

    it('should show recommendations for reko', () => {
      renderComponent(true)
      store.dispatch(updateSrsInfo(fakeSrsInfo()))
      expect(screen.getByText('Som rehabkoordinator, tänk på att')).toBeInTheDocument()
    })

    it('should recommendations for doctor', () => {
      renderComponent(true)
      expect(screen.getByText('Som läkare, tänk på att')).toBeInTheDocument()
    })

    it('should general recommendations', () => {
      renderComponent(true)
      expect(screen.getByText('Åtgärdsrekommendationer')).toBeInTheDocument()
    })
  })

  describe('has support and full view', () => {
    beforeEach(() => {
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '0' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(setDiagnosisCodes(['J20']))
    })

    it('should show support info is chosen if diagnosis has support', () => {
      renderComponent()
      expect(screen.getByText('Riskberäkningen gäller:')).toBeInTheDocument()
    })

    it('should show footer with more information if chosen diagnosis has support', () => {
      renderComponent()
      expect(screen.getByText('Mer information')).toBeInTheDocument()
    })

    it('should show radio buttons if chosen diagnosis has support', () => {
      renderComponent()
      expect(screen.getByText(SICKLEAVE_CHOICES_TEXTS[0])).toBeInTheDocument()
    })

    it('should show recommendations if chosen diagnosis has support', () => {
      renderComponent()
      store.dispatch(updateSrsInfo(fakeSrsInfo()))
      expect(screen.getByText(SRS_OBSERVE_TITLE)).toBeInTheDocument()
    })

    it('should show risk if chosen diagnosis has support', () => {
      renderComponent()
      expect(screen.getByText('Risken gäller', { exact: false })).toBeInTheDocument()
    })

    it('should enable risk form button if switching sick leave choice', async () => {
      renderComponent()
      store.dispatch(updateSrsPredictions([fakeSrsPrediction()]))
      store.dispatch(updateSrsQuestions([fakeSrsQuestion()]))

      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      await userEvent.click(screen.getByText('Beräkna'))
      await userEvent.click(screen.getByText(SRS_RISK_BUTTON_TEXT))
      expect(screen.getByText('Beräkna')).toBeDisabled()
      await userEvent.click(screen.getByLabelText('Förlängning'))
      expect(screen.getByText('Beräkna')).toBeEnabled()
    })
  })

  describe('SRS Information Choices', () => {
    beforeEach(() => {
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20', id: '0' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(setDiagnosisCodes(['J20']))
    })

    it('should render recommendation choice', () => {
      renderComponent()
      expect(screen.getByText(SRS_RECOMMENDATIONS_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('should render statistics choice', () => {
      renderComponent()
      expect(screen.getByText(SRS_STATISTICS_BUTTON_TEXT)).toBeInTheDocument()
    })

    it('should set primary button style on clicked button', () => {
      renderComponent()
      const button = screen.getByText(SRS_RECOMMENDATIONS_BUTTON_TEXT)
      userEvent.click(button)
      expect(button).toHaveClass('ic-button--primary')
    })

    it('should set statistics button to secondary button as default', () => {
      renderComponent()
      const button = screen.getByText(SRS_STATISTICS_BUTTON_TEXT)
      expect(button).not.toHaveClass('ic-button--primary')
      expect(button).toHaveClass('ic-button--secondary')
    })

    it('should render recommendations if that choice is chosen', () => {
      store.dispatch(updateSrsInfo(fakeSrsInfo()))
      renderComponent()
      const button = screen.getByText(SRS_RECOMMENDATIONS_BUTTON_TEXT)
      userEvent.click(button)
      expect(screen.getByText(SRS_RECOMMENDATIONS_TITLE)).toBeInTheDocument()
      expect(screen.queryByText(SRS_STATISTICS_TITLE)).not.toBeInTheDocument()
    })

    it('should render statistics if that choice is chosen', () => {
      renderComponent()
      const button = screen.getByText(SRS_STATISTICS_BUTTON_TEXT)
      userEvent.click(button)
      expect(screen.queryByText(SRS_RECOMMENDATIONS_TITLE)).not.toBeInTheDocument()
      expect(screen.getByText(SRS_STATISTICS_TITLE)).toBeInTheDocument()
    })

    it('should log when pressing statistics button', () => {
      renderComponent()
      userEvent.click(screen.getByText(SRS_STATISTICS_BUTTON_TEXT))
      expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
    })
  })
})
