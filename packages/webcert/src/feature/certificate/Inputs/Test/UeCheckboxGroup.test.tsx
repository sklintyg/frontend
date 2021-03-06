import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UeCheckboxGroup from '../UeCheckboxGroup'
import { CertificateDataElement, CertificateDataValueType, ConfigTypes } from '@frontend/common/src/types/certificate'
import * as redux from 'react-redux'

const CHECKBOXES = [
  { label: 'Checkbox1', id: 'Checkbox_1' },
  { label: 'Checkbox-2', id: 'Checkbox_2' },
  { label: 'Checkbox 3', id: 'Checkbox_3' },
]

const question: CertificateDataElement = {
  id: 'checkbox',
  mandatory: true,
  index: 0,
  parent: '',
  visible: true,
  readOnly: false,
  validation: [],
  validationErrors: [],
  value: { type: CertificateDataValueType.CODE_LIST, list: [] },
  config: {
    text: '',
    description: '',
    type: ConfigTypes.UE_CHECKBOX_MULTIPLE_CODE,
    list: CHECKBOXES,
  },
}

const renderDefaultComponent = () => {
  render(
    <>
      <UeCheckboxGroup question={question} disabled={false} />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
  useSelectorSpy.mockReturnValue(jest.fn())
})

describe('Checkbox group component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('disables correctly all checkboxes', () => {
    render(
      <>
        <UeCheckboxGroup question={question} disabled={true} />
      </>
    )
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(CHECKBOXES.length)
    checkboxes.forEach((c: any) => {
      expect(c).toBeDisabled()
    })
  })

  it('allows user to check and uncheck checkboxes', () => {
    renderDefaultComponent()
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(CHECKBOXES.length)
    checkboxes.forEach((c: any) => {
      expect(c).not.toBeDisabled()
      expect(c).not.toBeChecked()
      userEvent.click(c)
      expect(c).toBeChecked()
    })
  })

  it('allows user to check and uncheck checkboxes by clicking on label', () => {
    renderDefaultComponent()
    const checkboxes = screen.queryAllByRole('checkbox')
    expect(checkboxes).toHaveLength(CHECKBOXES.length)
    checkboxes.forEach((c: any, index: number) => {
      const label = screen.queryByText(CHECKBOXES[index].label)
      expect(c).not.toBeChecked()
      expect(label).not.toBeNull()
      userEvent.click(label)
      expect(c).toBeChecked()
    })
  })
})
