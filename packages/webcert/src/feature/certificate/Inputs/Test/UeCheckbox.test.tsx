import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeCheckbox from '../UeCheckbox'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CHECKBOX_LABEL_CODE = 'Example Label 0123!'
const CHECKBOX_LABEL_BOOLEAN = 'Another Example Label 0123!'
const questionBoolean: CertificateDataElement = {
  id: 'checkbox',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.BOOLEAN },
  config: {
    text: '',
    label: CHECKBOX_LABEL_BOOLEAN,
    description: '',
    type: ConfigTypes.UE_CHECKBOX_BOOLEAN,
  },
}

const questionCode: CertificateDataElement = {
  id: 'checkbox',
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
    label: CHECKBOX_LABEL_CODE,
    description: '',
    type: ConfigTypes.UE_CHECKBOX_CODE,
  },
}
const renderBooleanComponent = () => {
  render(
    <>
      <UeCheckbox question={questionBoolean} disabled={false} id={'checkbox'} />
    </>
  )
}

const renderCodeComponent = () => {
  render(
    <>
      <UeCheckbox question={questionCode} disabled={false} id={'checkbox'} />
    </>
  )
}

const useSelectorSpy = jest.spyOn(redux, 'useSelector')
const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
useDispatchSpy.mockReturnValue(jest.fn())
useSelectorSpy.mockReturnValue(jest.fn())

const testClickOnCheckbox = (label?: string) => {
  let clickable
  if (label) {
    clickable = screen.queryByText(label)
  } else {
    clickable = screen.queryByRole('checkbox')
  }
  const checkbox = screen.queryByRole('checkbox')
  expect(checkbox).not.toBeNull()
  expect(checkbox).not.toBeDisabled()
  expect(checkbox).not.toBeChecked()
  userEvent.click(clickable)
  expect(checkbox).toBeChecked()
  userEvent.click(clickable)
  expect(checkbox).not.toBeChecked()
  userEvent.click(clickable)
  expect(checkbox).toBeChecked()
}

describe('Checkbox component', () => {
  it('renders without crashing', () => {
    renderBooleanComponent()
    renderCodeComponent()
  })

  it('sets the label given in question object', () => {
    renderBooleanComponent()
    renderCodeComponent()
    expect(screen.queryByText(CHECKBOX_LABEL_BOOLEAN)).not.toBeNull()
    expect(screen.queryByText(CHECKBOX_LABEL_CODE)).not.toBeNull()
  })

  it('allows user to check and uncheck by clicking on boolean checkbox', () => {
    renderBooleanComponent()
    testClickOnCheckbox()
  })

  it('allows user to check and uncheck by clicking boolean checkbox label', () => {
    renderBooleanComponent()
    testClickOnCheckbox(CHECKBOX_LABEL_BOOLEAN)
  })

  it('allows user to check and uncheck by clicking on code checkbox', () => {
    renderCodeComponent()
    testClickOnCheckbox()
  })

  it('allows user to check and uncheck by clicking on code label', () => {
    renderCodeComponent()
    testClickOnCheckbox(CHECKBOX_LABEL_CODE)
  })

  it('gets disabled when value is given', () => {
    render(
      <>
        <UeCheckbox question={questionCode} disabled={true} id={'checkbox'} />
        <UeCheckbox question={questionBoolean} disabled={true} id={'checkbox'} />
        <UeCheckbox question={questionCode} disabled={false} id={'checkbox'} />
        <UeCheckbox question={questionBoolean} disabled={false} id={'checkbox'} />
      </>
    )
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(4)
    expect(checkboxes[0]).toBeDisabled()
    expect(checkboxes[1]).toBeDisabled()
    expect(checkboxes[2]).not.toBeDisabled()
    expect(checkboxes[3]).not.toBeDisabled()
  })
})
