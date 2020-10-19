import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import { CertificateDataValueType, CertificateDataElement, CertificateBooleanValue } from '@frontend/common'
import UeRadio from './UeRadio'

it('displays two radio buttons that toggle checked mode correctly', async () => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

  const mockQuestion: CertificateDataElement = {
    value: {
      type: CertificateDataValueType.BOOLEAN,
      selected: true,
      selectedText: 'Ja',
      unselectedText: 'Nej',
    } as CertificateBooleanValue,
    // @ts-expect-error we don't need to fill the object
    config: { prop: '' },
  }

  useSelectorSpy.mockReturnValue({})
  useDispatchSpy.mockReturnValue(jest.fn())

  render(<UeRadio question={mockQuestion} />)

  const radioButton = screen.getByRole('radio', { name: (mockQuestion.value as CertificateBooleanValue).selectedText })
  userEvent.click(radioButton)

  expect(radioButton).toBeChecked()
  expect(screen.getByRole('radio', { name: (mockQuestion.value as CertificateBooleanValue).unselectedText })).not.toBeChecked()
})
