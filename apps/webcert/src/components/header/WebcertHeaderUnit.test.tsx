import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { fakeResourceLink, fakeUnit, fakeUnitStatistic, fakeUser } from '../../faker'
import { fakeUserStatistics } from '../../faker/user/fakeUserStatistics'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
import { ResourceLinkType } from '../../types'
import WebcertHeaderUnit from './WebcertHeaderUnit'

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <WebcertHeaderUnit />
    </Provider>
  )
}

describe('Webcert header unit', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, apiMiddleware, userMiddleware])
  })

  afterEach(() => {
    clearDispatchedActions()
  })

  it('should display what care unit the user is logged in to', (): void => {
    testStore.dispatch(updateUser(fakeUser({ loggedInUnit: fakeUnit({ unitName: 'Care unit' }) })))
    renderComponent()

    expect(screen.getByText(/Care unit/i)).toBeInTheDocument()
  })

  it('should open the dropdown with the button for changing unit when clicking on expand button', async () => {
    testStore.dispatch(updateUser(fakeUser()))
    renderComponent()

    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]))

    await userEvent.click(screen.getAllByTestId('arrowToggle')[0])
    expect(screen.getByText(/Byt vårdenhet/i)).toBeInTheDocument()
  })

  it('should expand/collapse when clicked on expandableBox', async () => {
    testStore.dispatch(updateUser(fakeUser()))
    testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]))
    renderComponent()
    const expandableBox = screen.getByTestId('expandableBox')
    await userEvent.click(expandableBox)
    expect(screen.getByText(/Byt vårdenhet/i)).toBeInTheDocument()
    await userEvent.click(expandableBox)
    expect(screen.queryByText(/Byt vårdenhet/i)).not.toBeInTheDocument()
  })

  it('should not display care provider name for private practitioner', (): void => {
    const user = fakeUser()
    const careProvider = { ...user.loggedInCareProvider }
    user.role = 'Privatläkare'
    careProvider.unitName = 'Care provider unit'
    user.loggedInCareProvider = careProvider

    testStore.dispatch(updateUser(user))
    renderComponent()

    expect(screen.queryByText(user.loggedInCareProvider.unitName, { exact: false })).not.toBeInTheDocument()
  })

  it('should display care provider name for normal doctor', (): void => {
    const user = fakeUser()
    const careProvider = { ...user.loggedInCareProvider }
    user.role = 'Läkare'
    careProvider.unitName = 'Care provider unit'
    user.loggedInCareProvider = careProvider

    testStore.dispatch(updateUser(user))
    renderComponent()

    expect(screen.getByText(user.loggedInCareProvider.unitName, { exact: false })).toBeInTheDocument()
  })

  describe('Inactive unit', () => {
    it('should not display inactive message for active unit', (): void => {
      testStore.dispatch(updateUser(fakeUser()))
      renderComponent()

      expect(screen.queryByText(/Inaktiv enhet/i)).not.toBeInTheDocument()
    })

    it('should display inactive message for inactive unit', (): void => {
      testStore.dispatch(updateUser(fakeUser({ loggedInUnit: fakeUnit({ isInactive: true }) })))
      renderComponent()

      expect(screen.getByText(/Inaktiv enhet/i, { exact: false })).toBeInTheDocument()
    })
  })

  describe('Statistics', () => {
    it('should show statistics on other units if resource link exists', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(
        updateUserStatistics(
          fakeUserStatistics({
            unitStatistics: Object.fromEntries(['1234a', '1234b', '1234c'].map((id) => [id, fakeUnitStatistic()])),
          })
        )
      )

      renderComponent()

      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]))

      expect(screen.getByText('17 ej hanterade ärenden och ej signerade utkast på andra vårdenheter')).toBeInTheDocument()
    })

    it('should not show statistics on other units if there are none', () => {
      testStore.dispatch(updateUser(fakeUser()))
      testStore.dispatch(
        updateUserStatistics(
          fakeUserStatistics({
            totalDraftsAndUnhandledQuestionsOnOtherUnits: 0,
            unitStatistics: {
              '1234a': fakeUnitStatistic(),
              '1234b': fakeUnitStatistic(),
            },
          })
        )
      )
      testStore.dispatch(updateUserResourceLinks([fakeResourceLink({ type: ResourceLinkType.CHANGE_UNIT })]))

      renderComponent()

      expect(screen.queryByText('17 ej hanterade ärenden och ej signerade utkast på andra vårdenheter')).not.toBeInTheDocument()
    })
  })
})
