import { fakeCategoryElement, fakeCertificate, fakeCertificateValidationError } from '@frontend/common'
import { act, screen } from '@testing-library/react'
import { hideValidationErrors, showValidationErrors, updateCertificate } from '../../store/certificate/certificateActions'
import { renderWithStore } from '../../utils/renderWithStore'
import CertificateValidation from './CertificateValidation'

const GRUND_FOR_MEDICINSKT_UNDERLAG = 'Grund för medicinskt underlag'
const SYSSELSATTNING = 'Sysselsättning'

describe('CertificateValidation component', () => {
  it('Should return null if no errors exist', () => {
    const { container, store } = renderWithStore(<CertificateValidation />)
    act(() => store.dispatch(hideValidationErrors()))

    expect(container.firstChild).toBe(null)
  })

  it('Should display all validation errors', () => {
    const { container, store } = renderWithStore(<CertificateValidation />)
    act(() => {
      store.dispatch(showValidationErrors())
      store.dispatch(
        updateCertificate(
          fakeCertificate({
            data: {
              ...fakeCategoryElement({
                config: { text: GRUND_FOR_MEDICINSKT_UNDERLAG },
                validationErrors: [fakeCertificateValidationError()],
              }),
              ...fakeCategoryElement({ config: { text: SYSSELSATTNING }, validationErrors: [fakeCertificateValidationError()] }),
            },
          })
        )
      )
    })

    expect(screen.getByText(/utkastet saknar uppgifter i följande avsnitt/i)).toBeInTheDocument()
    expect(container.getElementsByClassName('iu-color-error').length).toBe(2)
    expect(screen.getByText(GRUND_FOR_MEDICINSKT_UNDERLAG)).toBeInTheDocument()
    expect(screen.getByText(SYSSELSATTNING)).toBeInTheDocument()
  })
})
