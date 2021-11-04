import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import UeTextArea from './UeTextArea'
import { CertificateDataValueType, CertificateDataElement } from '@frontend/common'
import { CertificateDataValidationType } from '@frontend/common/src'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

const mockQuestionWithLimit: CertificateDataElement = {
  value: { type: CertificateDataValueType.TEXT },
  // @ts-expect-error
  config: { prop: '' },
  validation: [
    {
      type: CertificateDataValidationType.TEXT_VALIDATION,
      questionId: 'id',
      limit: 100,
    },
  ],
}

it('renders a textarea which has correct value after typing in it', async () => {
  const mockQuestion: CertificateDataElement = {
    value: { type: CertificateDataValueType.TEXT },
    // @ts-expect-error
    config: { prop: '' },
  }

  render(<UeTextArea question={mockQuestion} />)

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
