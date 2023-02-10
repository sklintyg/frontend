import { CertificateDataElement, ConfigTypes, fakeCertificateValue } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as redux from 'react-redux'
import UeRadioGroup from './UeRadioGroup'

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
      <UeRadioGroup question={question} disabled={false} />
    </>
  )
}

beforeEach(() => {
  const useSelectorSpy = jest.spyOn(redux, 'useSelector')
  const useDispatchSpy = jest.spyOn(redux, 'useDispatch')
  useDispatchSpy.mockReturnValue(jest.fn())
  useSelectorSpy.mockReturnValue(jest.fn())
})

describe('Radio group component', () => {
  it('renders without crashing', () => {
    renderDefaultComponent()
  })

  it('allows user to switch radio button', () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
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

  it('allows user to check and uncheck radiobuttons by clicking on label', () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons).toHaveLength(CODES.length)
    radioButtons.forEach((r: any, index: number) => {
      const label = screen.getByText(CODES[index].label)
      expect(r).not.toBeChecked()
      expect(label).not.toBeNull()
      userEvent.click(label)
      expect(r).toBeChecked()
    })
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
