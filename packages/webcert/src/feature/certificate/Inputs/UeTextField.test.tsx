import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import {
  CertificateDataConfig,
  CertificateDataElement,
  CertificateDataValidation,
  CertificateDataValueType,
  CertificateDataValidationType,
} from '@frontend/common'

import UeTextField from './UeTextField'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

const mockQuestionWithLimit = {
  value: { type: CertificateDataValueType.TEXT },
  config: ({ prop: '' } as unknown) as CertificateDataConfig,
  validation: [
    ({
      type: CertificateDataValidationType.TEXT_VALIDATION,
      questionId: 'id',
      limit: 50,
    } as unknown) as CertificateDataValidation,
  ],
} as CertificateDataElement

it('renders a text which has correct value after typing in it', async () => {
  const mockQuestion = {
    value: { type: CertificateDataValueType.TEXT },
    config: ({ prop: '' } as unknown) as CertificateDataConfig,
  } as CertificateDataElement

  render(<UeTextField question={mockQuestion} disabled={false} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'Hello, World!')
  expect(input).toHaveValue('Hello, World!')
})

it('should show character counter if text validation is set', () => {
  render(<UeTextField question={mockQuestionWithLimit} disabled={false} />)
  expect(screen.getByText('Tecken kvar:', { exact: false })).toBeInTheDocument()
})
