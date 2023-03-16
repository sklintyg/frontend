import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import SrsPanelFooter from './SrsPanelFooter'
import { fakeSrsInfo, SrsInformationChoice } from '@frontend/common'
import { updateSrsInfo } from '../../../store/srs/srsActions'

const renderComponent = (informationChoice: SrsInformationChoice) => {
  render(
    <Provider store={store}>
      <SrsPanelFooter informationChoice={informationChoice} />
    </Provider>
  )
}

describe('SrsPanelFooter', () => {
  const srsInfo = fakeSrsInfo()
  store.dispatch(updateSrsInfo(srsInfo))

  it('should set correct link in footer for recommendations', () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://skr.se/' + srsInfo.atgarderDiagnosisCode)
  })

  it('should set correct text in footer for recommendations', () => {
    renderComponent(SrsInformationChoice.RECOMMENDATIONS)
    expect(screen.getByText('Information om ' + srsInfo.atgarderDiagnosisDescription + ' hos Rätt Sjukskrivning'))
  })

  it('should set correct link in footer for statistics', () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://skr.se/' + srsInfo.statistikDiagnosisCode)
  })

  it('should set correct text in footer for statistics', () => {
    renderComponent(SrsInformationChoice.STATISTICS)
    expect(screen.getByText('Information om ' + srsInfo.statistikDiagnosisDescription + ' hos Rätt Sjukskrivning'))
  })
})
