import { render, screen } from '@testing-library/react'
import SRSPanel, { SRS_TITLE } from './SRSPanel'
import { Provider } from 'react-redux'
import store from '../../store/store'
import { setDiagnosisCodes, updateError } from '../../store/srs/srsActions'
import { updateCertificate } from '../../store/certificate/certificateActions'
import { fakeCertificate, fakeDiagnosesElement } from '@frontend/common'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SRSPanel />
    </Provider>
  )
}

describe('SRSPanel', () => {
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
  })
})
