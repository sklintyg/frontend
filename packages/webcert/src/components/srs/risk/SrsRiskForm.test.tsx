import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../../../store/store'
import { updateSrsQuestions } from '../../../store/srs/srsActions'
import { fakeSrsAnswerOption, fakeSrsQuestion } from '@frontend/common'
import userEvent from '@testing-library/user-event'
import SrsRiskForm from './SrsRiskForm'

const renderComponent = () => {
  render(
    <Provider store={store}>
      <SrsRiskForm />
    </Provider>
  )
}

describe('SrsRiskForm', () => {
  it('should render without problems', () => {
    expect(() => renderComponent()).not.toThrow()
  })

  describe('questions', () => {
    it('should show radio button for each answer option', () => {
      const answerOptions = [fakeSrsAnswerOption(), fakeSrsAnswerOption()]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      store.dispatch(updateSrsQuestions([question]))
      expect(screen.getAllByRole('radio')).toHaveLength(2)
    })

    it('should show label for each answer option', () => {
      const answerOptions = [fakeSrsAnswerOption(), fakeSrsAnswerOption()]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      store.dispatch(updateSrsQuestions([question]))
      expect(screen.getByText(answerOptions[0].text)).toBeInTheDocument()
      expect(screen.getByText(answerOptions[1].text)).toBeInTheDocument()
    })

    it('should check default option', () => {
      const answerOptions = [fakeSrsAnswerOption(true), fakeSrsAnswerOption(false)]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      store.dispatch(updateSrsQuestions([question]))
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons[0]).toBeChecked()
      expect(radioButtons[1]).not.toBeChecked()
    })

    it('should check pressed radio button', () => {
      const answerOptions = [fakeSrsAnswerOption(true), fakeSrsAnswerOption(false)]
      const question = fakeSrsQuestion(answerOptions)
      renderComponent()
      store.dispatch(updateSrsQuestions([question]))
      const radioButtons = screen.getAllByRole('radio')
      userEvent.click(radioButtons[1])
      expect(radioButtons[0]).not.toBeChecked()
      expect(radioButtons[1]).toBeChecked()
    })

    it('should show calculate button', () => {
      renderComponent()
      expect(screen.getByText('Beräkna')).toBeInTheDocument()
    })
  })
})
