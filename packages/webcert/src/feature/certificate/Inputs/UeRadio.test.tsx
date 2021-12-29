import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import * as redux from 'react-redux'
import userEvent from '@testing-library/user-event'
import { CertificateDataElement, CertificateDataValueType, ConfigUeRadioBoolean, ValueBoolean } from '@frontend/common'
import UeRadio from './UeRadio'

it('displays two radio buttons that toggle checked mode correctly', async () => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')

  const mockQuestion: CertificateDataElement = {
    value: {
      type: CertificateDataValueType.BOOLEAN,
      selected: true,
      id: 'test',
    } as ValueBoolean,
    config: {
      id: 'test',
      selectedText: 'ja',
      unselectedText: 'nej',
    } as ConfigUeRadioBoolean,
  }

  // TODO: The "checked" value on the input doesn't change until the updated value is dispatched and updated in the store.
  // When we implement a mocked store we can do this correctly
  useSelectorSpy.mockReturnValue({})
  useDispatchSpy.mockReturnValue(jest.fn())

  render(<UeRadio disabled={false} question={mockQuestion} />)

  const radioButton = screen.getByLabelText('ja')
  userEvent.click(radioButton)

  expect(radioButton).toBeChecked()
  expect(screen.getByRole('radio', { name: 'nej' })).not.toBeChecked()
})
