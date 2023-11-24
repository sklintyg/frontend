import { CertificateDataElement, ConfigUeVisualAcuity, fakeCertificate, fakeVisualAcuityElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate, updateValidationErrors } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeVisualAcuity from './UeVisualAcuity'

const QUESTION_ID = 'visualAcuity'

let testStore: EnhancedStore

const question: CertificateDataElement = fakeVisualAcuityElement({
  id: QUESTION_ID,
})[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeVisualAcuity>) => {
  render(
    <Provider store={testStore}>
      <UeVisualAcuity {...props} />
    </Provider>
  )
}

describe('Visual Acuity component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])

    testStore.dispatch(
      updateCertificate(
        fakeCertificate({
          data: {
            [QUESTION_ID]: question,
          },
        })
      )
    )
  })

  it('renders without crashing', () => {
    expect(() => renderComponent({ disabled: false, question })).not.toThrow()
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
    textboxes.forEach((textbox) => expect(textbox).toBeEnabled())
    checkboxes.forEach((checkbox) => expect(checkbox).toBeEnabled())
  })

  it('disables component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const textboxes = screen.getAllByRole('textbox')
    const checkboxes = screen.getAllByRole('checkbox')
    textboxes.forEach((textbox) => expect(textbox).toBeDisabled())
    checkboxes.forEach((checkbox) => expect(checkbox).toBeDisabled())
  })

  it('formats input into float with decimal comma', async () => {
    renderComponent({ disabled: false, question })
    const input = screen.getAllByRole('textbox')[0]
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('')
    await userEvent.clear(input)
    await userEvent.type(input, '1.5')
    expect(input).toHaveValue('1,5')
    await userEvent.clear(input)
    await userEvent.type(input, '0,3')
    expect(input).toHaveValue('0,3')
    await userEvent.clear(input)
    await userEvent.type(input, '0,35')
    expect(input).toHaveValue('0,3')
  })

  const config = question.config as ConfigUeVisualAcuity

  it('should display validation error', () => {
    testStore.dispatch(showValidationErrors())
    testStore.dispatch(
      updateValidationErrors([
        {
          id: QUESTION_ID,
          category: 'category',
          field: config.rightEye.withoutCorrectionId,
          type: 'EMPTY',
          text: 'Ange ett svar.',
        },
      ])
    )
    renderComponent({ question })
    expect(screen.getByText('Ange ett svar.')).toBeInTheDocument()
  })
})
