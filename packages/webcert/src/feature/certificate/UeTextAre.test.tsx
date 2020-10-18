import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitForDomChange } from '@testing-library/react'
import * as utils from '@frontend/common/src/utils/certificateUtils'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import UeTextArea from './UeTextArea'
import { CertificateDataValueType, CertificateDataElement } from '@frontend/common'

it('displays that the certificate is revoked', async () => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

  const mockQuestion: CertificateDataElement = {
    value: { type: CertificateDataValueType.TEXT },
    config: { prop: '' },
  }

  useSelectorSpy.mockReturnValue({})
  useDispatchSpy.mockReturnValue({})

  render(<UeTextArea question={mockQuestion} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'Hello, World!')
  expect(input).toHaveValue('Hello, World!')
  //TODO: Perhaps this will work if we update our testing packages. Can't break to new lines currently
  //   userEvent.type(input, 'Hello,{enter}World!')
  //   expect(input).toHaveValue('Hello,\nWorld!')
})
