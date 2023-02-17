import { ValidationErrorSummary } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import CertificateValidation from './CertificateValidation'

const GRUND_FOR_MEDICINSKT_UNDERLAG = 'Grund för medicinskt underlag'
const SYSSELSATTNING = 'Sysselsättning'

const getValidationErrorSummary = (): ValidationErrorSummary[] => {
  const validationError1: ValidationErrorSummary = { id: '1', text: GRUND_FOR_MEDICINSKT_UNDERLAG, index: 1 }
  const validationError2: ValidationErrorSummary = { id: '2', text: SYSSELSATTNING, index: 2 }
  const validationErrors: ValidationErrorSummary[] = []
  validationErrors.push(validationError1)
  validationErrors.push(validationError2)
  return validationErrors
}

describe('CertificateValidation component', () => {
  it('shall be null if no errors exist', (): void => {
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValue(false)

    const { container } = render(<CertificateValidation />)

    expect(container.firstChild).toBe(null)
  })

  it('shall display all validation errors', (): void => {
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValueOnce(true)
    useSelectorSpy.mockReturnValue(getValidationErrorSummary())

    const { container } = render(<CertificateValidation />)

    expect(screen.getByText(/Utkastet saknar uppgifter i följande avsnitt:/)).toBeInTheDocument()
    expect(container.getElementsByClassName('iu-color-error').length).toBe(2)
    expect(screen.getByText(GRUND_FOR_MEDICINSKT_UNDERLAG)).toBeInTheDocument()
    expect(screen.getByText(SYSSELSATTNING)).toBeInTheDocument()
  })
})
