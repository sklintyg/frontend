import { getByType } from '@frontend/utils'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeSrsInfo } from '../../../faker'
import { logSrsInteraction, updateSrsInfo } from '../../../store/srs/srsActions'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import type { SrsInfoForDiagnosis } from '../../../types'
import { SrsInformationChoice } from '../../../types'
import SrsPanelFooter from './SrsPanelFooter'
import { SKR_DIAGNOSIS_LINK_MAP, SKR_FALLBACK_LINK } from '../srsUtils'
import { configureApplicationStore } from '../../../store/configureApplicationStore'

let store: EnhancedStore
let srsInfo: SrsInfoForDiagnosis
const renderComponent = (informationChoice: SrsInformationChoice) => {
  render(
    <Provider store={store}>
      <SrsPanelFooter informationChoice={informationChoice} />
    </Provider>
  )
}

describe('SrsPanelFooter', () => {
  beforeEach(() => {
    store = configureApplicationStore([dispatchHelperMiddleware, srsMiddleware])
    srsInfo = fakeSrsInfo({ atgarderDiagnosisCode: 'F32', statistikDiagnosisCode: 'M54.5' })
    store.dispatch(updateSrsInfo(srsInfo))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should set correct link in footer for recommendations', async () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    await expect(screen.getByRole('link')).toHaveAttribute('href', SKR_DIAGNOSIS_LINK_MAP[srsInfo.atgarderDiagnosisCode])
  })

  it('should set correct text in footer for recommendations', () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    expect(screen.getByText(`Information om ${srsInfo.atgarderDiagnosisDescription} hos Rätt Sjukskrivning`)).toBeInTheDocument()
  })

  it('should set correct link in footer for statistics', async () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    await expect(screen.getByRole('link')).toHaveAttribute('href', SKR_DIAGNOSIS_LINK_MAP[srsInfo.statistikDiagnosisCode])
  })

  it('should use fallback link for unknown diagnosis code', async () => {
    store.dispatch(updateSrsInfo(fakeSrsInfo({ statistikDiagnosisCode: 'UNKNOWN' })))
    renderComponent(SrsInformationChoice.STATISTICS)
    await expect(screen.getByRole('link')).toHaveAttribute('href', SKR_FALLBACK_LINK)
  })

  it('should set correct text in footer for statistics', () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    expect(screen.getByText(`Information om ${srsInfo.statistikDiagnosisDescription} hos Rätt Sjukskrivning`)).toBeInTheDocument()
  })

  it('should log when clicking link', async () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    await userEvent.click(screen.getByRole('link'))
    expect(getByType(dispatchedActions, logSrsInteraction.type)).not.toBeUndefined()
  })
})
