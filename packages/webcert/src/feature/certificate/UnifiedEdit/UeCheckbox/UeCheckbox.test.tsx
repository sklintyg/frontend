import { CertificateDataElement, fakeCheckboxBooleanElement, fakeCheckboxCodeElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import UeCheckbox from './UeCheckbox'

const CHECKBOX_LABEL_CODE = 'Example Label 0123!'
const CHECKBOX_LABEL_BOOLEAN = 'Another Example Label 0123!'
const questionBoolean: CertificateDataElement = fakeCheckboxBooleanElement({
  id: 'checkbox',
  config: {
    text: '',
    label: CHECKBOX_LABEL_BOOLEAN,
    description: '',
  },
})['checkbox']

const questionCode: CertificateDataElement = fakeCheckboxCodeElement({
  id: 'checkbox',
  config: {
    text: '',
    label: CHECKBOX_LABEL_CODE,
    description: '',
  },
})['checkbox']

const renderBooleanComponent = () => {
  render(<UeCheckbox question={questionBoolean} disabled={false} id={'checkbox'} />)
}

const renderCodeComponent = () => {
  render(<UeCheckbox question={questionCode} disabled={false} id={'checkbox'} />)
}

beforeEach(() => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
  useSelectorSpy.mockReturnValue(vi.fn())
})

const testClickOnCheckbox = (label?: string) => {
  let clickable
  if (label) {
    clickable = screen.getByText(label)
  } else {
    clickable = screen.getByRole('checkbox')
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
    expect(() => renderBooleanComponent()).not.toThrow()
    expect(() => renderCodeComponent()).not.toThrow()
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
