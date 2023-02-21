import { CertificateMetadata, CertificateRelationType, CertificateStatus, CustomTooltip } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import * as redux from 'react-redux'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import ReplaceCertificateContinueButton from '../ReplaceCertificateContinueButton'

const NAME = 'Replace continue button name'
const DESCRIPTION = 'Replace continue button description'
const CERTIFICATE_ID = 'xxxxxx-yyyyyyy-zzzzzzz'

const history = createMemoryHistory()

const renderDefaultComponent = (enabled: boolean) => {
  render(
    <Router history={history}>
      <CustomTooltip />
      <ReplaceCertificateContinueButton
        name={NAME}
        description={DESCRIPTION}
        enabled={enabled}
        certificateMetadata={getMetadata()}
        functionDisabled={false}
      />
    </Router>
  )
}

describe('Replace certificate continue button', () => {
  beforeEach(() => {
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValue(getMetadata())
  })

  it('shall enable button when enabled is true', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false', () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    expect(button).toBeDisabled()
  })

  it('shall set the name passed as prop', () => {
    renderDefaultComponent(true)
    const name = screen.queryByText(NAME)
    expect(name).not.toBeNull()
  })

  it('shall set the description passed as prop', () => {
    renderDefaultComponent(true)
    userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).not.toBeNull()
  })

  it('shall open modal when clicked', () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    userEvent.click(button)
    expect(screen.queryByRole('dialog')).not.toBeNull()
  })

  it("shall navigate to draft when dialog button 'continue' is clicked", () => {
    const pushSpy = vi.spyOn(history, 'push')
    renderDefaultComponent(true)
    userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    userEvent.click(screen.getByText('Fortsätt på utkast'))
    expect(pushSpy).toHaveBeenCalledWith('/certificate/' + CERTIFICATE_ID)
  })

  it("shall not navigate to draft when dialog button 'cancelled' is clicked", () => {
    const pushSpy = vi.spyOn(history, 'push')
    renderDefaultComponent(true)
    userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    userEvent.click(screen.getByText('Avbryt'))
    expect(pushSpy).toHaveBeenCalledTimes(0)
  })
})

const getMetadata = () => {
  return {
    relations: {
      parent: null,
      children: [
        {
          certificateId: CERTIFICATE_ID,
          type: CertificateRelationType.REPLACED,
          status: CertificateStatus.UNSIGNED,
          created: new Date().toISOString(),
        },
      ],
    },
  } as CertificateMetadata
}
