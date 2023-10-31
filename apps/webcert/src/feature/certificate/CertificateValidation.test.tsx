import { ValidationErrorSummary } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import { vi } from 'vitest'
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

    expect(container).toBeEmptyDOMElement()
  })

  it('shall display all validation errors', (): void => {
    const useSelectorSpy = vi.spyOn(redux, 'useSelector')
    useSelectorSpy.mockReturnValueOnce(true)
    useSelectorSpy.mockReturnValue(getValidationErrorSummary())

    render(<CertificateValidation />)

    expect(screen.getByText(/Utkastet saknar uppgifter i följande avsnitt:/)).toBeInTheDocument()
    expect(screen.getAllByRole('link').filter((link) => link.className.includes('iu-color-error'))).toHaveLength(2)
    expect(screen.getByText(GRUND_FOR_MEDICINSKT_UNDERLAG)).toBeInTheDocument()
    expect(screen.getByText(SYSSELSATTNING)).toBeInTheDocument()
  })
})
