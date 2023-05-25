import { getResourceLinkWithType, getUser, ResourceLinkType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateUser, updateUserResourceLinks } from '../../../store/user/userActions'
import { utilsMiddleware } from '../../../store/utils/utilsMiddleware'
import WarningNormalOriginModal from './WarningNormalOriginModal'

let testStore: EnhancedStore
const INFO_BOX = 'Du har loggat in i fristående Webcert istället för direkt via ditt journalsystem'

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <WarningNormalOriginModal />
    </Provider>
  )
}

describe('WarningNormalOriginModal', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([utilsMiddleware])
  })

  it('should not render modal if resource link is not set', () => {
    testStore.dispatch(updateUser(getUser()))
    renderComponent()

    expect(screen.queryByText(INFO_BOX)).not.toBeInTheDocument()
  })

  it('should not render modal if user is not set', () => {
    setupResourceLinks()
    renderComponent()

    expect(screen.queryByText(INFO_BOX)).not.toBeInTheDocument()
  })

  it('should render modal if resource link is set', () => {
    testStore.dispatch(updateUser(getUser()))
    setupResourceLinks()
    renderComponent()

    expect(screen.getByText(INFO_BOX)).toBeInTheDocument()
  })

  it('should close modal if close button is pressed', async () => {
    testStore.dispatch(updateUser(getUser()))
    setupResourceLinks()
    renderComponent()

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText(INFO_BOX)).not.toBeInTheDocument()
  })
})

const setupResourceLinks = () => {
  testStore.dispatch(updateUserResourceLinks([getResourceLinkWithType(ResourceLinkType.WARNING_NORMAL_ORIGIN)]))
}
