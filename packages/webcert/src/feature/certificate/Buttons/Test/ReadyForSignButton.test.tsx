import { CustomTooltip, getCertificate } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { readyForSign, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import dispatchHelperMiddleware, { clearDispatchedActions, dispatchedActions } from '../../../../store/test/dispatchHelperMiddleware'
import ReadyForSignButton from '../ReadyForSignButton'

const NAME = 'ReadyForSign button name'
const DESCRIPTION = 'ReadyForSign button description'

describe('ReadyForSign button', () => {
  let testStore: EnhancedStore

  beforeEach(() => {
    clearDispatchedActions()
    testStore = configureApplicationStore([dispatchHelperMiddleware, certificateMiddleware])
  })

  const renderDefaultComponent = (enabled: boolean, isValidForSigning: boolean, functionDisabled = false) => {
    testStore.dispatch(updateCertificate(getCertificate()))
    render(
      <Provider store={testStore}>
        <CustomTooltip />
        <ReadyForSignButton
          name={NAME}
          description={DESCRIPTION}
          enabled={enabled}
          isValidForSigning={isValidForSigning}
          functionDisabled={functionDisabled}
        />
      </Provider>
    )
  }

  it('shall enable button when enabled is true and isValidForSigning is true', () => {
    renderDefaultComponent(true, true)
    const button = screen.queryByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false and isValidForSigning is true', () => {
    renderDefaultComponent(false, true)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall set the name passed as prop and isValidForSigning is true', () => {
    renderDefaultComponent(true, true)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('shall set the description passed as prop and isValidForSigning is true', async () => {
    renderDefaultComponent(true, true)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).not.toBeNull()
  })

  it("shall dispatch readyForSign when button 'readyForSign' is clicked and isValidForSigning is true", async () => {
    renderDefaultComponent(true, true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText(NAME))
    expect(dispatchedActions.find((action) => readyForSign.match(action))).toBeDefined()
  })

  it('shall enable button when enabled is true and isValidForSigning is false', () => {
    renderDefaultComponent(true, false)
    const button = screen.queryByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false and isValidForSigning is false', () => {
    renderDefaultComponent(false, false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall disable button when functionDisabled, enabled and isValidForSigning is true', () => {
    renderDefaultComponent(true, true, true)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall set the name passed as prop and isValidForSigning is false', () => {
    renderDefaultComponent(true, false)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('shall set the description passed as prop and isValidForSigning is false', async () => {
    renderDefaultComponent(true, false)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).not.toBeNull()
  })

  it('shall open modal when clicked and isValidForSigning is false', async () => {
    renderDefaultComponent(true, false)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
  })

  it("shall dispatch readyForSign when modal dialog button 'readyForSign' is clicked", async () => {
    renderDefaultComponent(true, false)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Markera klart för signering'))
    expect(dispatchedActions.find((action) => readyForSign.match(action))).toBeDefined()
  })

  it("shall not dispatch readyForSign when modal dialog button 'cancelled' is clicked", async () => {
    renderDefaultComponent(true, false)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(dispatchedActions.find((action) => readyForSign.match(action))).not.toBeDefined()
  })
})
