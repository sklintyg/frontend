import { getByType } from '@frontend/utils'
import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeSrsInfo } from '../../../faker'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { logSrsInteraction, updateSickLeaveChoice, updateSrsInfo } from '../../../store/srs/srsActions'
import { srsMiddleware } from '../../../store/srs/srsMiddleware'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../store/test/dispatchHelperMiddleware'
import { SrsSickLeaveChoice } from '../../../types'
import SrsRecommendations, { SRS_EXTENSION_TITLE, SRS_OBSERVE_TITLE, SRS_RECOMMENDATIONS_TITLE } from './SrsRecommendations'

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
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION))
      renderComponent()
      expect(screen.getByText(SRS_EXTENSION_TITLE)).toBeInTheDocument()
    })

    it('should show title for extension recommendations if extension after 60 days is chosen', () => {
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION_AFTER_60_DAYS))
      renderComponent()
      expect(screen.getByText(SRS_EXTENSION_TITLE)).toBeInTheDocument()
    })

    it('should not show title for extension recommendations if new is chosen', () => {
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.NEW))
      renderComponent()
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
      store.dispatch(updateSickLeaveChoice(SrsSickLeaveChoice.EXTENSION))
      renderComponent()
      expect(screen.getByText(srsInfo.atgarderFrl[0].recommendationTitle)).toBeInTheDocument()
    })

    it('should show text to show more', () => {
      renderComponent()
      expect(screen.getAllByText('Visa mer').length > 0).toBeTruthy()
    })

    it('should show text to show less if show more is pressed', async () => {
      renderComponent()
      await userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(screen.getByText('Visa mindre')).toBeInTheDocument()
    })

    it('should log when pressing show more', async () => {
      renderComponent()
      await userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(getByType(dispatchedActions, logSrsInteraction.type)).not.toBeUndefined()
    })

    it('should show measure description if show more is pressed', async () => {
      renderComponent()
      expect(screen.queryByText(srsInfo.atgarderObs[0].recommendationText)).not.toBeInTheDocument()
      await userEvent.click(screen.getAllByText('Visa mer')[0])
      expect(screen.getByText(srsInfo.atgarderObs[0].recommendationText)).toBeInTheDocument()
    })

    it('should render show more recommendations if more than 4 in array', () => {
      renderComponent()
      expect(screen.getAllByText('Se fler').length > 0).toBeTruthy()
    })

    it('should log when pressing show more recommendations', async () => {
      renderComponent()
      await userEvent.click(screen.getAllByText('Se fler')[0])
      expect(getByType(dispatchedActions, logSrsInteraction.type)).not.toBeUndefined()
    })
  })
})
