import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import SrsRecommendations, { SRS_EXTENSION_TITLE, SRS_OBSERVE_TITLE, SRS_RECOMMENDATIONS_TITLE } from './SrsRecommendations'
import { logSrsInteraction, updateSickLeaveChoice, updateSrsInfo } from '../../../store/srs/srsActions'
import { fakeSrsInfo, SrsSickLeaveChoice } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { EnhancedStore } from '@reduxjs/toolkit'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'

let store: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsRecommendations />
    </Provider>
  )
}

const srsInfo = fakeSrsInfo()

describe('SRS Recommendations', () => {
  beforeEach(() => {
    store = configureApplicationStore([dispatchHelperMiddleware, srsMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  beforeEach(() => {
    store.dispatch(updateSrsInfo(srsInfo))
    store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.NEW))
  })

  describe('general', () => {
    it('should render without problems', () => {
      expect(() => renderComponent()).not.toThrow()
    })

    it('should show title for observe recommendations', () => {
      renderComponent()
      expect(screen.getByText(SRS_OBSERVE_TITLE)).toBeInTheDocument()
    })

    it('should show title for normal recommendations', () => {
      renderComponent()
      expect(screen.getByText(SRS_RECOMMENDATIONS_TITLE)).toBeInTheDocument()
    })

    it('should show title for extension recommendations if extension is chosen', () => {
      renderComponent()
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION))
      expect(screen.getByText(SRS_EXTENSION_TITLE)).toBeInTheDocument()
    })

    it('should show title for extension recommendations if extension after 60 days is chosen', () => {
      renderComponent()
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS))
      expect(screen.getByText(SRS_EXTENSION_TITLE)).toBeInTheDocument()
    })

    it('should not show title for extension recommendations if new is chosen', () => {
      renderComponent()
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.NEW))
      expect(screen.queryByText(SRS_EXTENSION_TITLE)).not.toBeInTheDocument()
    })
  })

  describe('recommendations', () => {
    it('should show srs observe recommendation title', () => {
      renderComponent()
      expect(screen.getByText(srsInfo.atgarderObs[0].recommendationTitle)).toBeInTheDocument()
    })

    it('should show srs normal recommendation title', () => {
      renderComponent()
      expect(screen.getByText(srsInfo.atgarderRek[0].recommendationTitle)).toBeInTheDocument()
    })

    it('should show srs extension recommendation title', () => {
      renderComponent()
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION))
      expect(screen.getByText(srsInfo.atgarderFrl[0].recommendationTitle)).toBeInTheDocument()
    })

    it('should show text to show more', () => {
      renderComponent()
      expect(screen.getAllByText('Visa mer').length > 0).toBeTruthy()
    })

    it('should show text to show less if show more is pressed', () => {
      renderComponent()
      userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(screen.getByText('Visa mindre')).toBeTruthy()
    })

    it('should log when pressing show more', () => {
      renderComponent()
      userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
    })

    it('should show measure description if show more is pressed', () => {
      renderComponent()
      expect(screen.queryByText(srsInfo.atgarderObs[0].recommendationText)).not.toBeInTheDocument()
      userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(screen.getByText(srsInfo.atgarderObs[0].recommendationText)).toBeInTheDocument()
    })

    it('should render show more recommendations if more than 4 in array', () => {
      renderComponent()
      expect(screen.getAllByText('Se fler').length > 0).toBeTruthy()
    })

    it('should log when pressing show more recommendations', () => {
      renderComponent()
      userEvent.click(screen.getAllByText('Se fler')[0])
      expect(dispatchedActions.find((a) => a.type === logSrsInteraction.type)).not.toBeUndefined()
    })
  })
})
