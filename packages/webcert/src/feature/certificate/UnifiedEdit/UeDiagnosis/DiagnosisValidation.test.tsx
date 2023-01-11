import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DiagnosisValidation from './DiagnosisValidation'
import { ValidationError } from '@frontend/common/src'

const EXPECTED_ERROR = 'expected error message'
const handleErrorStyling = jest.fn()
const renderDefaultComponent = (field: string, errors: ValidationError[], disabled: boolean, id: string) => {
  render(
    <>
      <DiagnosisValidation fieldId={field} validationErrors={errors} disabled={disabled} id={id} handleErrorStyling={handleErrorStyling} />
    </>
  )
}

describe('Diagnosis validation component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent('field', [], false, '0')
  })

  it('should render validation error for specific field and id', () => {
    renderDefaultComponent('field', getValidationErrors('field', 1), false, '1')
    expect(screen.queryByText(EXPECTED_ERROR)).toBeInTheDocument()
  })

  it('should not render validation error for specific field and id if disabled is true', () => {
    renderDefaultComponent('field', getValidationErrors('field', 1), true, '1')
    expect(screen.queryByText(EXPECTED_ERROR)).not.toBeInTheDocument()
  })

  it('should not render validation error  if id of error and component prop do not match', () => {
    renderDefaultComponent('field', getValidationErrors('field', 2), true, '1')
    expect(screen.queryByText(EXPECTED_ERROR)).not.toBeInTheDocument()
  })

  it('should not render validation error if field of error and component prop do not match', () => {
    renderDefaultComponent('row', getValidationErrors('field', 1), true, '1')
    expect(screen.queryByText(EXPECTED_ERROR)).not.toBeInTheDocument()
  })

  it('should style instant error messages regardless of disabled value', () => {
    renderDefaultComponent('row', getValidationErrors('row', 1), true, '1')
    expect(handleErrorStyling).toBeCalledWith(true, '1')
  })

  it('should not style non instant error messages if disabled is true', () => {
    renderDefaultComponent('row', getValidationErrors('field', 1), true, '1')
    expect(handleErrorStyling).toBeCalledWith(false, '1')
  })

  it('should style non instant error messages if disabled is false', () => {
    renderDefaultComponent('row', getValidationErrors('row', 1), false, '1')
    expect(handleErrorStyling).toBeCalledWith(true, '1')
  })
})

const getValidationErrors = (field: string, id: number) => {
  return [
    {
      id: 'questionId',
      text: EXPECTED_ERROR,
      field: 'diagnosis.' + (id - 1) + '.' + field,
      category: 'category',
      type: 'type',
    },
  ]
}
