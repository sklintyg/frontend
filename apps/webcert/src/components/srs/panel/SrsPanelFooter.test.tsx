import { SrsInfoForDiagnosis, SrsInformationChoice, fakeSrsInfo } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { expect, it, describe, beforeEach, afterEach } from 'vitest'
import SrsPanelFooter from './SrsPanelFooter'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { logSrsInteraction, updateSrsInfo } from '../../../store/srs/srsActions'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'

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
    srsInfo = fakeSrsInfo()
    store.dispatch(updateSrsInfo(srsInfo))
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should set correct link in footer for recommendations', () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    expect(screen.getByRole('link')).toHaveAttribute('href', `https://skr.se/${srsInfo.atgarderDiagnosisCode}`)
  })

  it('should set correct text in footer for recommendations', () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    expect(screen.getByText(`Information om ${srsInfo.atgarderDiagnosisDescription} hos Rätt Sjukskrivning`)).toBeInTheDocument()
  })

  it('should set correct link in footer for statistics', () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    expect(screen.getByRole('link')).toHaveAttribute('href', `https://skr.se/${srsInfo.statistikDiagnosisCode}`)
  })

  it('should set correct text in footer for statistics', () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    expect(screen.getByText(`Information om ${srsInfo.statistikDiagnosisDescription} hos Rätt Sjukskrivning`)).toBeInTheDocument()
  })

  it('should log when clicking link', async () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    await userEvent.click(screen.getByRole('link'))
    expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
  })
})
