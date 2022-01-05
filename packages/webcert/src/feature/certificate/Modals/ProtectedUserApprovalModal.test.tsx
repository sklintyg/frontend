import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { ResourceLink, ResourceLinkType } from '@frontend/common/src'
import CreateCertificateFromCandidateModal from './CreateCertificateFromCandidateModal'
import ProtectedUserApprovalModal from './ProtectedUserApprovalModal'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import userEvent from '@testing-library/user-event'

const NAME = 'Name'
const BODY = 'Body'

const resourceLinkEnabled: ResourceLink = {
  type: ResourceLinkType.PROTECTED_USER_APPROVAL,
  name: NAME,
  body: BODY,
  description: '',
  enabled: true,
}

const resourceLinkDisabled: ResourceLink = {
  type: ResourceLinkType.PROTECTED_USER_APPROVAL,
  name: NAME,
  body: BODY,
  description: '',
  enabled: false,
}

const renderDefaultComponent = () => {
  render(
    <Provider store={store}>
      <ProtectedUserApprovalModal resourceLink={resourceLinkEnabled}></ProtectedUserApprovalModal>
    </Provider>
  )
}

let useDispatchSpy
beforeEach(() => {
  useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
})

describe('Create certificate from candidate modal', () => {
  it('shall render without crashing', () => {
    renderDefaultComponent()
  })

  it('shall show modal if enabled', () => {
    renderDefaultComponent()
    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })

  it('shall not show modal if disabled', () => {
    render(
      <Provider store={store}>
        <CreateCertificateFromCandidateModal resourceLink={resourceLinkDisabled}></CreateCertificateFromCandidateModal>
      </Provider>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shall not show modal if resourcelink is undefined', () => {
    render(
      <Provider store={store}>
        <CreateCertificateFromCandidateModal resourceLink={undefined}></CreateCertificateFromCandidateModal>
      </Provider>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shall set title for modal', () => {
    renderDefaultComponent()
    expect(screen.getByText(NAME)).toBeInTheDocument()
  })

  it('shall set body for modal', () => {
    renderDefaultComponent()
    expect(screen.getByText(BODY)).toBeInTheDocument()
  })

  it('shall show checkbox in modal', () => {
    renderDefaultComponent()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('shall disable confirm button if checkbox is unchecked', () => {
    renderDefaultComponent()
    expect(screen.getByText('Till Webcert')).toBeDisabled()
  })

  it('shall enable confirm button if checkbox is checked', () => {
    renderDefaultComponent()
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall enable confirm button if checkbox is checked', () => {
    renderDefaultComponent()
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText('Till Webcert')).toBeEnabled()
  })

  it('shall dispatch error if cancel button is pressed', () => {
    renderDefaultComponent()
    userEvent.click(screen.getByText('Avbryt'))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(useDispatchSpy).toBeCalled()
  })
})
