import {
  getChangeUnitResourceLink,
  getUser,
  getUserStatistics,
  getUserStatisticsWithNoDraftsOnOtherUnits,
  getUserWithInactiveUnit,
} from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { apiMiddleware } from '../../store/api/apiMiddleware'
import { configureApplicationStore } from '../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions } from '../../store/test/dispatchHelperMiddleware'
import { updateUser, updateUserResourceLinks, updateUserStatistics } from '../../store/user/userActions'
import { userMiddleware } from '../../store/user/userMiddleware'
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

  it('should display what care unit the user is logged in to', () => {
    act(() => testStore.dispatch(updateUser(getUser())))
    renderComponent()

    expect(screen.getByText(/Care unit/i)).toBeInTheDocument()
  })

  it('should open the dropdown with the button for changing unit when clicking on expand button', async () => {
    act(() => testStore.dispatch(updateUser(getUser())))
    renderComponent()

    act(() => testStore.dispatch(updateUserResourceLinks(getChangeUnitResourceLink())))

    await act(() => userEvent.click(screen.getAllByTestId('arrowToggle')[0]))
    expect(screen.getByText(/Byt vårdenhet/i)).toBeInTheDocument()
  })

  it('should expand/collapse when clicked on expandableBox', async () => {
    act(() => testStore.dispatch(updateUser(getUser())))
    act(() => testStore.dispatch(updateUserResourceLinks(getChangeUnitResourceLink())))
    renderComponent()
    const expandableBox = screen.getByTestId('expandableBox')
    await act(() => userEvent.click(expandableBox))
    expect(screen.getByText(/Byt vårdenhet/i)).toBeInTheDocument()
    await act(() => userEvent.click(expandableBox))
    expect(screen.queryByText(/Byt vårdenhet/i)).not.toBeInTheDocument()
  })

  it('should not display care provider name for private practitioner', () => {
    const user = getUser()
    const careProvider = { ...user.loggedInCareProvider }
    user.role = 'Privatläkare'
    careProvider.unitName = 'Care provider unit'
    user.loggedInCareProvider = careProvider

    act(() => testStore.dispatch(updateUser(user)))
    renderComponent()

    expect(screen.queryByText(user.loggedInCareProvider.unitName, { exact: false })).not.toBeInTheDocument()
  })

  it('should display care provider name for normal doctor', () => {
    const user = getUser()
    const careProvider = { ...user.loggedInCareProvider }
    user.role = 'Läkare'
    careProvider.unitName = 'Care provider unit'
    user.loggedInCareProvider = careProvider

    act(() => testStore.dispatch(updateUser(user)))
    renderComponent()

    expect(screen.getByText(user.loggedInCareProvider.unitName, { exact: false })).toBeInTheDocument()
  })

  describe('Inactive unit', () => {
    it('should not display inactive message for active unit', () => {
      act(() => testStore.dispatch(updateUser(getUser())))
      renderComponent()

      expect(screen.queryByText(/Inaktiv enhet/i)).not.toBeInTheDocument()
    })

    it('should display inactive message for inactive unit', () => {
      act(() => testStore.dispatch(updateUser(getUserWithInactiveUnit())))
      renderComponent()

      expect(screen.getByText(/Inaktiv enhet/i, { exact: false })).toBeInTheDocument()
    })
  })

  describe('Statistics', () => {
    it('should show statistics on other units if resource link exists', () => {
      act(() => testStore.dispatch(updateUser(getUser())))
      act(() => testStore.dispatch(updateUserStatistics(getUserStatistics())))

      renderComponent()

      act(() => testStore.dispatch(updateUserResourceLinks(getChangeUnitResourceLink())))

      expect(screen.getByText('17 ej hanterade ärenden och ej signerade utkast på andra vårdenheter')).toBeInTheDocument()
    })

    it('should not show statistics on other units if there are none', () => {
      act(() => testStore.dispatch(updateUser(getUser())))
      act(() => testStore.dispatch(updateUserStatistics(getUserStatisticsWithNoDraftsOnOtherUnits())))
      act(() => testStore.dispatch(updateUserResourceLinks(getChangeUnitResourceLink())))

      renderComponent()

      expect(screen.queryByText('17 ej hanterade ärenden och ej signerade utkast på andra vårdenheter')).not.toBeInTheDocument()
    })
  })
})
