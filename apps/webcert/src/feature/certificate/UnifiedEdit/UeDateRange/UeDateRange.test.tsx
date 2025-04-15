import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { showValidationErrors, updateCertificate } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import UeDateRange from './UeDateRange'
import { fakeCertificate, fakeDateRangeElement } from '../../../../faker'
import type { ValidationError } from '../../../../types'

const QUESTION_ID = 'QUESTION_ID'
const ERROR_TEXT = 'ErrorText'

const renderDefaultComponent = (props: ComponentProps<typeof UeDateRange>) => {
  render(
    <Provider store={store}>
      <UeDateRange {...props} />
    </Provider>
  )
}

const getValidationErrors = (field: string) => [
  {
    id: QUESTION_ID,
    field,
    type: 'EMPTY',
    text: ERROR_TEXT,
    category: '',
  },
]

const getQuestion = (validationErrors: ValidationError[]) =>
  fakeDateRangeElement({
    id: QUESTION_ID,
    config: { id: 'jsonid' },
    validationErrors,
  })[QUESTION_ID]

describe('Date range picker', () => {
  it('renders without crashing', () => {
    const question = getQuestion([])
    expect(() => renderDefaultComponent({ disabled: false, question })).not.toThrow()
  })

  describe('Validation error', () => {
    it('should show validation error of type id.field', () => {
      const validationErrors = getValidationErrors('jsonid.tom')
      const question = getQuestion(validationErrors)
      store.dispatch(showValidationErrors())
      store.dispatch(updateCertificate(fakeCertificate({ data: { QUESTION_ID: question } })))

      renderDefaultComponent({ disabled: false, question })

      expect(screen.getByText(ERROR_TEXT)).toBeInTheDocument()
    })

    it('should show validation error of type id.field for to', () => {
      const validationErrors = getValidationErrors('jsonid.to')
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
