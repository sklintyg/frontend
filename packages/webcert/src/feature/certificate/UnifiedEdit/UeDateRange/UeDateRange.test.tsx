import { fakeCertificate, fakeDateRangeElement, ValidationError } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import UeDateRange from './UeDateRange'

const QUESTION_ID = 'QUESTION_ID'
const ERROR_TEXT = 'ErrorText'

const renderDefaultComponent = (props: ComponentProps<typeof UeDateRange>) => {
  render(
    <Provider store={store}>
      <UeDateRange {...props} />
    </Provider>
  )
}

const getValidationErrors = (field: string) => {
  return [
    {
      id: QUESTION_ID,
      field: field,
      type: 'EMPTY',
      text: ERROR_TEXT,
      category: '',
    },
  ]
}

const getQuestion = (validationErrors: ValidationError[]) => {
  return fakeDateRangeElement({
    id: QUESTION_ID,
    value: { date: '2022-09-29' },
    config: { id: 'jsonid' },
    validationErrors: validationErrors,
  })[QUESTION_ID]
}

describe('Date range picker', () => {
  it('renders without crashing', () => {
    const question = getQuestion([])
    expect(() => renderDefaultComponent({ disabled: false, question })).not.toThrow()
  })

  describe('Validation error', () => {
    it.skip('shows date range error when end date is before start date', () => {
      const question = getQuestion([])
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(showValidationErrors())

      const fromInput = screen.getByLabelText('Fr.o.m')

      userEvent.type(fromInput, '20210202')
      const toInput = screen.getByLabelText('t.o.m')
      userEvent.type(toInput, '20210102')
      userEvent.click(screen.getByText('t.o.m'))
      setTimeout(() => {
        expect(screen.queryByText('Ange ett slutdatum som infaller efter startdatumet.')).toBeInTheDocument()
      }, 500)

      userEvent.type(toInput, '20210302')
      userEvent.click(screen.getByText('t.o.m'))
      setTimeout(() => {
        expect(screen.queryByText('Ange ett slutdatum som infaller efter startdatumet.')).not.toBeInTheDocument()
      }, 500)
    })

    it('should show validation error of type id.field', () => {
      const validationErrors = getValidationErrors('jsonid.tom')
      const question = getQuestion(validationErrors)
      store.dispatch(showValidationErrors())
      store.dispatch(updateCertificate(fakeCertificate({ data: { QUESTION_ID: question } })))

      renderDefaultComponent({ disabled: false, question })

      expect(screen.getByText(ERROR_TEXT)).toBeInTheDocument()
    })

    it('should show validation error of type field.id', () => {
      const validationErrors = getValidationErrors('tom.jsonid')
      const question = getQuestion(validationErrors)
      store.dispatch(showValidationErrors())
      store.dispatch(updateCertificate(fakeCertificate({ data: { QUESTION_ID: question } })))

      renderDefaultComponent({ disabled: false, question })

      expect(screen.getByText(ERROR_TEXT)).toBeInTheDocument()
    })
  })
})
