import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import UeTextArea from './UeTextArea'
import { CertificateDataConfig, CertificateDataElement, CertificateDataValidation, CertificateDataValueType } from '@frontend/common'
import { CertificateDataValidationType } from '@frontend/common/src'

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
      limit: 100,
    } as unknown) as CertificateDataValidation,
  ],
} as CertificateDataElement

it('renders a textarea which has correct value after typing in it', async () => {
  const mockQuestion = {
    value: { type: CertificateDataValueType.TEXT },
    config: ({ prop: '' } as unknown) as CertificateDataConfig,
  } as CertificateDataElement

  render(<UeTextArea question={mockQuestion} disabled={false} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'Hello, World!')
  expect(input).toHaveValue('Hello, World!')
  //TODO: Perhaps this will work if we update our testing packages. Can't break to new lines currently
  //   userEvent.type(input, 'Hello,{enter}World!')
  //   expect(input).toHaveValue('Hello,\nWorld!')
})

it('should show character counter if text validation is set', () => {
  render(<UeTextArea question={mockQuestionWithLimit} disabled={false} />)
  expect(screen.getByText('Tecken kvar:', { exact: false })).toBeInTheDocument()
})
