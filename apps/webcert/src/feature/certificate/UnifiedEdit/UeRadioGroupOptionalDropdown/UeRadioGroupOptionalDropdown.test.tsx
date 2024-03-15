import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeRadioGroup from '../UeRadioGroup/UeRadioGroup'
import UeRadioGroupOptionalDropdown from './UeRadioGroupOptionalDropdown'
import { fakeRadioBooleanElement, fakeCertificate } from '../../../../faker'

Object.defineProperty(global.window, 'scrollTo', { value: vi.fn() })

const CODES = [
  { label: 'Option1', id: 'Option_1' },
  { label: 'Option-2', id: 'Option_2' },
  { label: 'Option 3', id: 'Option_3' },
]

let testStore: EnhancedStore

const question = fakeRadioBooleanElement({
  id: 'id',
  value: { selected: true },
  config: {
    list: CODES,
  },
})

beforeEach(() => {
  testStore = configureApplicationStore([certificateMiddleware])

  testStore.dispatch(
    updateCertificate(
      fakeCertificate({
        data: {
          ...question,
        },
      })
    )
  )
})

const renderDefaultComponent = () => {
  render(
    <Provider store={testStore}>
      <UeRadioGroupOptionalDropdown question={question.id} disabled={false} />
    </Provider>
  )
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

  it('allows user to check and uncheck radiobuttons by clicking on label', () => {
    renderDefaultComponent()
    const radioButtons = screen.queryAllByRole('radio')
    expect(radioButtons).toHaveLength(CODES.length)
  })

  it.each(CODES)('allows user to check and uncheck %label', async ({ label }) => {
    renderDefaultComponent()
    expect(screen.getByRole('radio', { name: label })).not.toBeChecked()
    await userEvent.click(screen.getByRole('radio', { name: label }))
    expect(screen.getByRole('radio', { name: label })).toBeChecked()
  })

  it('disables radio buttons when disabled is set', () => {
    render(
      <Provider store={testStore}>
        <UeRadioGroup question={question.id} disabled />
      </Provider>
    )
    const radioButtons = screen.queryAllByRole('radio') as HTMLInputElement[]
    expect(radioButtons).toHaveLength(CODES.length)
    radioButtons.forEach((radio: HTMLInputElement) => expect(radio).toBeDisabled())
  })
})
