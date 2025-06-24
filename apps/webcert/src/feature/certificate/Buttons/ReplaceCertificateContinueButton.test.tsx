import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect } from 'vitest'
import CustomTooltip from '../../../components/utils/CustomTooltip'
import { fakeCertificateMetaData, fakeCertificateRelation, fakeCertificateRelations } from '../../../faker'
import { CertificateRelationType, CertificateStatus } from '../../../types'
import ReplaceCertificateContinueButton from './ReplaceCertificateContinueButton'

const NAME = 'Replace continue button name'
const DESCRIPTION = 'Replace continue button description'
const CERTIFICATE_ID = 'xxxxxx-yyyyyyy-zzzzzzz'

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
    <MemoryRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CustomTooltip />
              <ReplaceCertificateContinueButton
                name={NAME}
                description={DESCRIPTION}
                enabled={enabled}
                certificateMetadata={getMetadata()}
                functionDisabled={false}
              />
            </>
          }
        />
        <Route path={`/certificate/${CERTIFICATE_ID}`} element="the certificate page" />
      </Routes>
    </MemoryRouter>
  )
}

describe('Replace certificate continue button', () => {
  it('shall enable button when enabled is true', async () => {
    renderDefaultComponent(true)
    const button = screen.queryByRole('button')
    await expect(button).toBeEnabled()
  })

  it('shall disable button when enabled is false', async () => {
    renderDefaultComponent(false)
    const button = screen.queryByRole('button')
    await expect(button).toBeDisabled()
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
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Fortsätt på utkast'))
    expect(screen.getByText(/the certificate page/i)).toBeInTheDocument()
  })

  it("shall not navigate to draft when dialog button 'cancelled' is clicked", async () => {
    renderDefaultComponent(true)
    await userEvent.click(screen.queryByRole('button') as HTMLButtonElement)
    await userEvent.click(screen.getByText('Avbryt'))
    expect(screen.queryByText(/the certificate page/i)).not.toBeInTheDocument()
  })
})
