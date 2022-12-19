import { fakeVisualAcuityElement } from '@frontend/common'
import { CertificateDataElement } from '@frontend/common/src/types/certificate'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import store from '../../../../store/store'
import UeVisualAcuity from './UeVisualAcuity'

const QUESTION_ID = 'visualAcuity'

const question: CertificateDataElement = fakeVisualAcuityElement({
  id: QUESTION_ID,
})[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeVisualAcuity>) => {
  render(
    <Provider store={store}>
      <UeVisualAcuity {...props} />
    </Provider>
  )
}

describe('Visual Acuity component', () => {
  it('renders without crashing', () => {
    renderComponent({ disabled: false, question })
  })

  it('renders text inputs and checkboxes', () => {
    renderComponent({ disabled: false, question })
    const textboxes = screen.getAllByRole('textbox')
    const checkboxes = screen.getAllByRole('checkbox')
    expect(textboxes).toHaveLength(6)
    expect(checkboxes).toHaveLength(2)
  })

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const textboxes = screen.getAllByRole('textbox')
    const checkboxes = screen.getAllByRole('checkbox')
    textboxes.forEach((textbox) => expect(textbox).not.toBeDisabled())
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeDisabled())
  })

  it('disables component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const textboxes = screen.getAllByRole('textbox')
    const checkboxes = screen.getAllByRole('checkbox')
    textboxes.forEach((textbox) => expect(textbox).toBeDisabled())
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled())
  })

  it('formats input into float with decimal comma', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getAllByRole('textbox')[0]
    userEvent.type(input, 'abc')
    expect(input).toHaveValue('')
    userEvent.clear(input)
    userEvent.type(input, '1.5')
    expect(input).toHaveValue('1,5')
    userEvent.clear(input)
    userEvent.type(input, '0,3')
    expect(input).toHaveValue('0,3')
    userEvent.clear(input)
    userEvent.type(input, '0,35')
    expect(input).toHaveValue('0,3')
  })
})
