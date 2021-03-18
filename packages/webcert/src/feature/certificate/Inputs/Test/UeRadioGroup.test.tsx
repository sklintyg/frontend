import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeRadioGroup from '../UeRadioGroup'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CODES = [
  { label: 'Option1', id: 'Option_1' },
  { label: 'Option-2', id: 'Option_2' },
  { label: 'Option 3', id: 'Option_3' },
]

const question: CertificateDataElement = {
  id: 'radiogroup',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.CODE },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
    list: CODES,
  },
}

const renderDefaultComponent = () => {
  render(
    <>
      <UeRadioGroup question={question} disabled={false} />
    </>
  )
}

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
useDispatchSpy.mockReturnValue(jest.fn())
useSelectorSpy.mockReturnValue(jest.fn())

describe('Radio group component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('allows user to switch radio button', () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio')
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).not.toBeChecked())
    userEvent.click(radioButtons[0])
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
    userEvent.click(radioButtons[2])
    expect(radioButtons[2]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    userEvent.click(radioButtons[1])
    expect(radioButtons[1]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
  })

  it('disables radio buttons when value is set', () => {
    render(
      <>
        <UeRadioGroup question={question} disabled={true} />
      </>
    )
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons).toHaveLength(CODES.length)
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).toBeDisabled())
  })
})
