import { CertificateDataElement, ConfigTypes, fakeCertificateValue } from '@frontend/common'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import { vi } from 'vitest'
import UeRadioGroup from '../UeRadioGroup/UeRadioGroup'
import UeRadioGroupOptionalDropdown from './UeRadioGroupOptionalDropdown'

Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() })

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
  value: fakeCertificateValue.code(),
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
      <UeRadioGroupOptionalDropdown question={question} disabled={false} />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = vi.spyOn(redux, 'useSelector')
  const useDispatchSpy = vi.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(vi.fn())
  useSelectorSpy.mockReturnValue(vi.fn())
})

describe('UeRadioGroupOptionalDropdown', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('allows user to switch radio button', async () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).not.toBeChecked())
    await act(() => userEvent.click(radioButtons[0]))
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
    await act(() => userEvent.click(radioButtons[2]))
    expect(radioButtons[2]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    await act(() => userEvent.click(radioButtons[1]))
    expect(radioButtons[1]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
  })

  it('allows user to check and uncheck radiobuttons by clicking on label', async () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio')
    const label = screen.getByText(CODES[0].label)

    expect(radioButtons).toHaveLength(CODES.length)
    expect(radioButtons[0]).not.toBeChecked()
    expect(label).not.toBeNull()
    await act(() => userEvent.click(label))
    expect(radioButtons[0]).toBeChecked()
  })

  it('disables radio buttons when disabled is set', () => {
    render(
      <>
        <UeRadioGroup question={question} disabled={true} />
      </>
    )
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
    expect(radioButtons).toHaveLength(CODES.length)
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).toBeDisabled())
  })
})
