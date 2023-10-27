import { CertificateDataElement, ConfigTypes, fakeCertificateValue } from '@frontend/common'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithStore } from '../../../../utils/renderWithStore'
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
  renderWithStore(<UeRadioGroupOptionalDropdown question={question} disabled={false} />)
}

describe('UeRadioGroupOptionalDropdown', () => {
  it('renders without crashing', () => {
    expect(() => renderDefaultComponent()).not.toThrow()
  })

  it('allows user to switch radio button', async () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).not.toBeChecked())
    await userEvent.click(radioButtons[0])
    expect(radioButtons[0]).toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
    await userEvent.click(radioButtons[2])
    expect(radioButtons[2]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[1]).not.toBeChecked()
    await userEvent.click(radioButtons[1])
    expect(radioButtons[1]).toBeChecked()
    expect(radioButtons[0]).not.toBeChecked()
    expect(radioButtons[2]).not.toBeChecked()
  })

  it.each(CODES)('allows user to check and uncheck radiobutton $label by clicking on label', async ({ label }) => {
    renderDefaultComponent()
    expect(screen.getByRole('radio', { name: label })).not.toBeChecked()
    expect(screen.getByText(label)).not.toBeNull()
    await userEvent.click(screen.getByText(label))
    expect(screen.getByRole('radio', { name: label })).toBeChecked()
  })

  it('disables radio buttons when disabled is set', () => {
    renderWithStore(<UeRadioGroup question={question} disabled={true} />)
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
    expect(radioButtons).toHaveLength(CODES.length)
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).toBeDisabled())
  })
})
