import { CertificateDataValidation, CertificateDataValidationType, fakeTextAreaElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import * as redux from 'react-redux'
import UeTextArea from '../UeTextArea'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

it('renders a textarea which has correct value after typing in it', async () => {
  const mockQuestion = fakeTextAreaElement({ id: '1', value: { text: null } })['1']

  render(<UeTextArea question={mockQuestion} disabled={false} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'Hello, World!')
  expect(input).toHaveValue('Hello, World!')
  //TODO: Perhaps this will work if we update our testing packages. Can't break to new lines currently
  //   userEvent.type(input, 'Hello,{enter}World!')
  //   expect(input).toHaveValue('Hello,\nWorld!')
})

it('should show character counter if text validation is set', () => {
  const mockQuestionWithLimit = fakeTextAreaElement({
    id: '1',
    value: { text: null },
    validation: [
      ({
        type: CertificateDataValidationType.TEXT_VALIDATION,
        questionId: 'id',
        limit: 100,
      } as unknown) as CertificateDataValidation,
    ],
  })['1']
  render(<UeTextArea question={mockQuestionWithLimit} disabled={false} />)
  expect(screen.getByText('Tecken kvar:', { exact: false })).toBeInTheDocument()
})
