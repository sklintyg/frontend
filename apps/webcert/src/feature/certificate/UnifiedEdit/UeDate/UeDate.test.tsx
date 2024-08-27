import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCertificateValidationError, fakeDateElement } from '../../../../faker'
import { showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeDate from './UeDate'

let testStore: EnhancedStore
const VALIDATION_ERROR = 'Ange ett datum, samma som eller tidigare än "Dödsdatum".'
const QUESTION_ID = 'datepicker'

const question = fakeDateElement({ id: QUESTION_ID, value: { date: '2022-09-29' } })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeDate>) => {
  render(
    <Provider store={testStore}>
      <UeDate {...props} />
    </Provider>
  )
}

describe('DatePicker component', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([certificateMiddleware])
  })

  it('renders without crashing', () => {
    expect(() => renderComponent({ disabled: false, question })).not.toThrow()
  })

  it('renders textinput and calendar button', () => {
    renderComponent({ disabled: false, question })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('does not disable component if disabled is not set', async () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    await expect(input).toBeEnabled()
    await expect(button).toBeEnabled()
  })

  it('disables component if disabled is set', async () => {
    renderComponent({ disabled: true, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    await expect(input).toBeDisabled()
    await expect(button).toBeDisabled()
  })

  it('formats input into yyyy-mm-dd', async () => {
    renderComponent({ disabled: false, question })

    const inputDate = '20220929'
    const expected = '2022-09-29'
    const input = screen.getByRole('textbox')

    await userEvent.type(input, inputDate)
    await expect(input).toHaveValue(expected)
  })

  it('renders component with correct default values', async () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    await expect(input).toHaveValue('2022-09-29')
    await expect(button).toHaveValue('2022-09-29')
  })

  it('should display server validation errors on question.config.id (field)', () => {
    const element = fakeDateElement({
      config: { id: 'field' },
      id: QUESTION_ID,
      validationErrors: [
        fakeCertificateValidationError({
          field: 'field',
          id: QUESTION_ID,
          text: VALIDATION_ERROR,
        }),
      ],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: element } })))
    renderComponent({ disabled: false, question: element })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).not.toBeInTheDocument()

    testStore.dispatch(showValidationErrors())
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })

  it('should display server validation errors on question.id', () => {
    const element = fakeDateElement({
      id: QUESTION_ID,
      validationErrors: [fakeCertificateValidationError({ text: VALIDATION_ERROR })],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: element } })))
    renderComponent({ disabled: false, question: element })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).not.toBeInTheDocument()

    testStore.dispatch(showValidationErrors())
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })

  it('Should disable options past max date', async () => {
    renderComponent({
      disabled: false,
      question: fakeDateElement({
        id: 'id',
        config: { maxDate: '2023-02-17' },
        value: { date: '2023-02-17' },
      }).id,
    })

    await userEvent.click(screen.getByLabelText('Öppna kalendern'))

    expect(screen.getAllByLabelText(/Not available .* februari 2023/)).toHaveLength(11)
  })
})
