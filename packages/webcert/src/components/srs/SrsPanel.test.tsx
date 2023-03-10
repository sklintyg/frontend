import { render, screen } from '@testing-library/react'
import SrsPanel, { SRS_TITLE } from './SrsPanel'
import { Provider } from 'react-redux'
import store from '../../store/store'
import { setDiagnosisCodes, updateError, updateSrsInfo } from '../../store/srs/srsActions'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { fakeCertificate, fakeDiagnosesElement, fakeSrsInfo } from '@frontend/common'
import { SICKLEAVE_CHOICES_TEXTS } from './SrsSickLeaveChoices'
import { SRS_OBSERVE_TITLE, SRS_RECOMMENDATIONS_TITLE } from './SrsRecommendations'
import { SRS_RECOMMENDATIONS_BUTTON_TEXT, SRS_STATISTICS_BUTTON_TEXT } from './SrsInformationChoices'
import userEvent from '@testing-library/user-event'
import { SRS_STATISTICS_INFO, SRS_STATISTICS_TITLE } from './SrsNationalStatistics'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsPanel />
    </Provider>
  )
}

describe('SrsPanel', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
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

    it('should not show footer if no diagnois is chosen', () => {
      renderComponent()
      store.dispatch(updateError(false))
      expect(screen.queryByText('Mer information')).not.toBeInTheDocument()
    })
  })

  describe('no support', () => {
    it('should show no support if diagnosis without support is chosen', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.getByText('För den angivna diagnosen finns för tillfället inget stöd för sjukskrivning.')).toBeInTheDocument()
    })

    it('should not show footer if diagnosis without support is chosen', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.queryByText('Mer information')).not.toBeInTheDocument()
    })
  })

  describe('has support', () => {
    it('should show support info is chosen if diagnosis has support', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.getByText('Riskberäkningen gäller:')).toBeInTheDocument()
    })

    it('should show footer with more information if chosen diagnosis has support', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.getByText('Mer information')).toBeInTheDocument()
    })

    it('should show radio buttons if chosen diagnosis has support', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      expect(screen.getByText(SICKLEAVE_CHOICES_TEXTS[0])).toBeInTheDocument()
    })

    it('should show recommendations if chosen diagnosis has support', () => {
      renderComponent()
      const element = fakeDiagnosesElement({ value: { list: [{ code: 'J20' }] } })
      store.dispatch(setDiagnosisCodes(['J20']))
      store.dispatch(updateCertificate(fakeCertificate({ data: element })))
      store.dispatch(updateSrsInfo(fakeSrsInfo()))
      expect(screen.getByText(SRS_OBSERVE_TITLE)).toBeInTheDocument()
    })
  })

  describe('SRS Information Choices', () => {
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

    it('should render statistics choice', () => {
      renderComponent()
      const button = screen.getByText(SRS_STATISTICS_BUTTON_TEXT)
      expect(button).not.toHaveClass('ic-button--primary')
      expect(button).toHaveClass('ic-button--secondary')
    })

    it('should render recommendations if that choice is chosen', () => {
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
  })
})
