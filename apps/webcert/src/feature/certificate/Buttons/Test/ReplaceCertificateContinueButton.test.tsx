import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { vi } from 'vitest'
import CustomTooltip from '../../../../components/utils/CustomTooltip'
import { fakeCertificateMetaData, fakeCertificateRelation, fakeCertificateRelations } from '../../../../faker'
import { CertificateRelationType, CertificateStatus } from '../../../../types'
import ReplaceCertificateContinueButton from '../ReplaceCertificateContinueButton'

const NAME = 'Replace continue button name'
const DESCRIPTION = 'Replace continue button description'
const CERTIFICATE_ID = 'xxxxxx-yyyyyyy-zzzzzzz'

const history = createMemoryHistory()

const getMetadata = () =>
  fakeCertificateMetaData({
    relations: fakeCertificateRelations({
      children: [
        fakeCertificateRelation({
          certificateId: CERTIFICATE_ID,
          type: CertificateRelationType.REPLACED,
          status: CertificateStatus.UNSIGNED,
        }),
      ],
    }),
  })

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
    expect(name).toBeInTheDocument()
  })

  it('shall set the description passed as prop', async () => {
    renderDefaultComponent(true)
    await userEvent.hover(screen.getByText(NAME))
    const description = screen.queryByText(DESCRIPTION)
    expect(description).toBeInTheDocument()
  })

  it('shall open modal when clicked', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button') as HTMLButtonElement
    await userEvent.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it("shall navigate to draft when dialog button 'continue' is clicked", async () => {
    const pushSpy = vi.spyOn(history, 'push')
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Fortsätt på utkast'))
    expect(pushSpy).toHaveBeenCalledWith(`/certificate/${CERTIFICATE_ID}`)
  })

  it("shall not navigate to draft when dialog button 'cancelled' is clicked", async () => {
    const pushSpy = vi.spyOn(history, 'push')
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(pushSpy).toHaveBeenCalledTimes(0)
  })
})
