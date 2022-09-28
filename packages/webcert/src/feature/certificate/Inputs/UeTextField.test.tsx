import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import { CertificateDataConfig, CertificateDataElement, CertificateDataValueType } from '@frontend/common'

import UeTextField from './UeTextField'

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

useSelectorSpy.mockReturnValue({})
useDispatchSpy.mockReturnValue(jest.fn())

const mockQuestion = {
  value: { type: CertificateDataValueType.TEXT },
  config: ({ prop: '' } as unknown) as CertificateDataConfig,
} as CertificateDataElement

it('renders a text which has correct value after typing in it', async () => {
  render(<UeTextField question={mockQuestion} disabled={false} />)
  const input = screen.getByRole('textbox')
  userEvent.type(input, 'Hello, World!')
  expect(input).toHaveValue('Hello, World!')
})

it('disables component if disabled is set', () => {
  render(<UeTextField question={mockQuestion} disabled={true} />)
  const input = screen.getByRole('textbox')
  expect(input).toBeDisabled()
})
