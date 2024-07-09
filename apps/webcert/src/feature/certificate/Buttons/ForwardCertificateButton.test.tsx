import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import dispatchHelperMiddleware from '../../../store/test/dispatchHelperMiddleware'
import { ResourceLinkType } from '../../../types'
import ForwardCertificateButton from './ForwardCertificateButton'
import { utilsMiddleware } from '../../../store/utils/utilsMiddleware'
import { updateConfig } from '../../../store/utils/utilsActions'

const NAME = 'Forward button name'
const DESCRIPTION = 'Forward button description'
const UNIT_NAME = 'Vårdenhet'
const CARE_PROVIDER_NAME = 'Vårdgivare'
const CERTIFICATE_ID = 'xxx'
const CERTIFICATE_TYPE = 'type'

let testStore: EnhancedStore

let location: Location

const renderDefaultComponent = (type: ResourceLinkType = ResourceLinkType.FORWARD_CERTIFICATE) =>
  render(
    <Provider store={testStore}>
      <ForwardCertificateButton
        name={NAME}
        description={DESCRIPTION}
        unitName={UNIT_NAME}
        careProviderName={CARE_PROVIDER_NAME}
        certificateId={CERTIFICATE_ID}
        type={type}
        certificateType={CERTIFICATE_TYPE}
        enabled
        forwarded={false}
        functionDisabled={false}
      />
    </Provider>
  )

Object.defineProperty(global.window, 'open', { value: vi.fn() })

describe('Forward certificate button', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([dispatchHelperMiddleware, utilsMiddleware])
  })

  it('opens email with text about draft', () => {
    const openSpy = vi.spyOn(window, 'open')
    renderDefaultComponent()
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('utkast'), '_blank')
  })

  it('opens email with text about question', () => {
    const openSpy = vi.spyOn(window, 'open')
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('%A4rende'), '_blank')
  })

  it('opens email with correct link', () => {
    const openSpy = vi.spyOn(window, 'open')
    const forwardDraftOrQuestionUrl = 'https://wc2.wc.localtest.me/webcert/web/user/launch/'

    testStore.dispatch(
      updateConfig({
        version: '',
        banners: [],
        cgiFunktionstjansterIdpUrl: '',
        sakerhetstjanstIdpUrl: '',
        ppHost: '',
        forwardDraftOrQuestionUrl,
      })
    )
    renderDefaultComponent(ResourceLinkType.FORWARD_QUESTION)
    screen.getByText(NAME).click()
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining(encodeURIComponent(`${forwardDraftOrQuestionUrl}xxx/question`)), '_blank')
  })
})
