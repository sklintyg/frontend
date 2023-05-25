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

  it('allows user to check and uncheck by clicking on boolean checkbox', async () => {
    renderBooleanComponent()
    expect(screen.queryByRole('checkbox')).not.toBeNull()
    expect(screen.queryByRole('checkbox')).not.toBeDisabled()
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).toBeChecked()
  })

  it('allows user to check and uncheck by clicking boolean checkbox label', async () => {
    renderBooleanComponent()
    expect(screen.queryByRole('checkbox')).not.toBeNull()
    expect(screen.queryByRole('checkbox')).not.toBeDisabled()
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_BOOLEAN))
    expect(screen.queryByRole('checkbox')).toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_BOOLEAN))
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_BOOLEAN))
    expect(screen.queryByRole('checkbox')).toBeChecked()
  })

  it('allows user to check and uncheck by clicking on code checkbox', async () => {
    renderCodeComponent()
    expect(screen.queryByRole('checkbox')).not.toBeNull()
    expect(screen.queryByRole('checkbox')).not.toBeDisabled()
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByRole('checkbox')).toBeChecked()
  })

  it('allows user to check and uncheck by clicking on code label', async () => {
    renderCodeComponent()
    expect(screen.queryByRole('checkbox')).not.toBeNull()
    expect(screen.queryByRole('checkbox')).not.toBeDisabled()
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_CODE))
    expect(screen.queryByRole('checkbox')).toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_CODE))
    expect(screen.queryByRole('checkbox')).not.toBeChecked()
    await userEvent.click(screen.getByText(CHECKBOX_LABEL_CODE))
    expect(screen.queryByRole('checkbox')).toBeChecked()
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
