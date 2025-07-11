import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { fakeCertificate, fakeCertificateValidationError, fakeYearElement } from '../../../../faker'
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
    <Provider store={testStore}>
      <UeYear {...props} />
    </Provider>
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

  it('renders component with correct default values', async () => {
    renderComponent({ disabled: false, question })
    const input = screen.getByRole('textbox')
    const button = screen.getByRole('button')
    await expect(input).toHaveValue(testYear.toString())
    await expect(button).toHaveValue(testYear.toString())
  })

  it('should display picker with correct value selected and correct limits', async () => {
    const element = fakeYearElement({
      config: { id: 'field', maxYear: testYear + 2, minYear: testYear - 2 },
      value: { id: 'field', year: testYear },
      id: QUESTION_ID,
    })[QUESTION_ID]

    renderComponent({ disabled: false, question: element })

    const button = screen.getByRole('button')

    await userEvent.click(button)

    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.querySelector('.react-datepicker-popper') as HTMLElement).toBeInTheDocument()
    })

    const selected = screen.getByText(testYear.toString())
    const minYear = screen.getByText((testYear - 2).toString())
    const maxYear = screen.getByText((testYear + 2).toString())
    const beforeMinYear = screen.getByText((testYear - 4).toString())
    const afterMaxYear = screen.getByText((testYear + 3).toString())
    await expect(selected).toHaveClass('react-datepicker__year-text--selected')
    await expect(minYear).not.toHaveClass('react-datepicker__year-text--disabled')
    await expect(maxYear).not.toHaveClass('react-datepicker__year-text--disabled')
    await expect(beforeMinYear).toHaveClass('react-datepicker__year-text--disabled')
    await expect(afterMaxYear).toHaveClass('react-datepicker__year-text--disabled')
  })

  it('should display server validation errors on question.config.id (field)', async () => {
    const element = fakeYearElement({
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
    expect(await screen.findByText(VALIDATION_ERROR)).toBeInTheDocument()
  })

  it('should display server validation errors on question.id', async () => {
    const element = fakeYearElement({
      id: QUESTION_ID,
      validationErrors: [fakeCertificateValidationError({ text: VALIDATION_ERROR })],
    })[QUESTION_ID]
    testStore.dispatch(updateCertificate(fakeCertificate({ data: { [QUESTION_ID]: element } })))
    renderComponent({ disabled: false, question: element })

    expect(getShowValidationErrors(testStore.getState())).toEqual(false)
    expect(screen.queryByText(VALIDATION_ERROR)).not.toBeInTheDocument()

    testStore.dispatch(showValidationErrors())
    expect(await screen.findByText(VALIDATION_ERROR)).toBeInTheDocument()
  })
})
