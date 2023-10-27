import { fakeCertificate, fakeYearElement } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import { certificateMiddleware } from '../../../../store/certificate/certificateMiddleware'
import { getShowValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { configureApplicationStore } from '../../../../store/configureApplicationStore'
import UeYear from './UeYear'

let testStore: EnhancedStore
const VALIDATION_ERROR = 'Ange ett år mellan patientens födelseår och aktuellt år.'
const QUESTION_ID = 'yearpicker'
const testYear = 2021
const question = fakeYearElement({ id: QUESTION_ID, value: { year: testYear } })[QUESTION_ID]

const renderComponent = (props: ComponentProps<typeof UeYear>) => {
  render(
    <>
      <Provider store={testStore}>
        <UeYear {...props} />
      </Provider>
    </>
  )
}

describe('YearPicker component', () => {
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

  it('does not disable component if disabled is not set', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).not.toBeDisabled()
    expect(button).not.toBeDisabled()
  })

  it('disables component if disabled is set', () => {
    renderComponent({ disabled: true, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toBeDisabled()
    expect(button).toBeDisabled()
  })

  it('renders component with correct default values', () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    expect(input).toHaveValue(testYear.toString())
    expect(button).toHaveValue(testYear.toString())
  })

  it('should display picker with correct value selected and correct limits', async () => {
    const question = fakeYearElement({
      config: { id: 'field', maxYear: testYear + 2, minYear: testYear - 2 },
      value: { id: 'field', year: testYear },
      id: QUESTION_ID,
    })[QUESTION_ID]

    renderComponent({ disabled: false, question })

    const button = screen.getByRole('button')

    userEvent.click(button)

    await waitFor(() => {
      expect(document.querySelector('.react-datepicker-popper') as HTMLElement).toBeInTheDocument()
    })

    const selected = screen.getByText(testYear.toString())
    const minYear = screen.getByText((testYear - 2).toString())
    const maxYear = screen.getByText((testYear + 2).toString())
    const beforeMinYear = screen.getByText((testYear - 4).toString())
    const afterMaxYear = screen.getByText((testYear + 3).toString())
    expect(selected).toHaveClass('react-datepicker__year-text--selected')
    expect(minYear).not.toHaveClass('react-datepicker__year-text--disabled')
    expect(maxYear).not.toHaveClass('react-datepicker__year-text--disabled')
    expect(beforeMinYear).toHaveClass('react-datepicker__year-text--disabled')
    expect(afterMaxYear).toHaveClass('react-datepicker__year-text--disabled')
  })

  it('should display server validation errors on question.config.id (field)', () => {
    const question = fakeYearElement({
      config: { id: 'field' },
      id: QUESTION_ID,
      validationErrors: [
        {
          field: 'field',
          id: QUESTION_ID,
          text: VALIDATION_ERROR,
        },
      ],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
    renderComponent({ disabled: false, question })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).toBeNull()

    act(() => testStore.dispatch(showValidationErrors()))
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })

  it('should display server validation errors on question.id', () => {
    const question = fakeYearElement({
      id: QUESTION_ID,
      validationErrors: [{ text: VALIDATION_ERROR }],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: question } })))
    renderComponent({ disabled: false, question })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).toBeNull()

    act(() => testStore.dispatch(showValidationErrors()))
    expect(screen.getByText(VALIDATION_ERROR)).toBeInTheDocument()
  })
})
