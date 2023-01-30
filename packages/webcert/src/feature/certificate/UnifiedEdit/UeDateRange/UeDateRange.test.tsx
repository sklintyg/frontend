import { fakeDateRangeElement } from '@frontend/common'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { hideValidationErrors, showValidationErrors } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import UeDateRange from './UeDateRange'

const QUESTION_ID = 'Intervall'

//const INVALID_DATE_MESSAGE = 'Ange datum i formatet åååå-mm-dd.'

const question = fakeDateRangeElement({ id: QUESTION_ID, value: { date: '2022-09-29' } })[QUESTION_ID]

const renderDefaultComponent = (props: ComponentProps<typeof UeDateRange>) => {
  render(
    <Provider store={store}>
      <UeDateRange {...props} />
    </Provider>
  )
}

describe('Date range picker', () => {
  it('renders without crashing', () => {
    renderDefaultComponent({ disabled: false, question })
  })

  describe('Validation error', () => {
    it('shows not complete date message when only from date is inserted', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(showValidationErrors())

      const input = screen.getByLabelText('Fr.o.m')

      userEvent.type(input, '20210202')
      userEvent.click(screen.getByText('t.o.m'))
      expect(screen.getByText('Ange ett datum.')).toBeInTheDocument()
    })

    it('shows not complete date message when only tom date is inserted', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(showValidationErrors())

      const input = screen.getByLabelText('t.o.m')

      userEvent.type(input, '20210202')
      userEvent.click(screen.getByText('Fr.o.m'))
      expect(screen.getByText('Ange ett datum.')).toBeInTheDocument()
    })

    it('shows not complete date message when tom date is inserted following fast input rules', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(showValidationErrors())

      const input = screen.getByLabelText('t.o.m')

      userEvent.type(input, 'd12')
      userEvent.click(screen.getByText('Fr.o.m'))
      expect(screen.getByText('Ange ett datum.')).toBeInTheDocument()
    })

    it('should not show not complete date message if invalid date is inserted in other field', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(showValidationErrors())

      userEvent.type(screen.getByLabelText('Fr.o.m'), '20210202')
      userEvent.type(screen.getByText('t.o.m'), 'yyyyyyyy')
      userEvent.click(screen.getByText('Fr.o.m'))
      expect(screen.queryByText('Ange ett datum.')).not.toBeInTheDocument()
    })

    it('should not show complete date message when validation errors are hidden but from date is inserted', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(hideValidationErrors())

      const input = screen.getByLabelText('Fr.o.m')

      userEvent.type(input, '20210202')
      userEvent.click(screen.getByText('t.o.m'))
      expect(screen.queryByText('Ange ett datum.')).not.toBeInTheDocument()
    })

    it('should not show complete date message when validation errors are hidden but tom date is inserted', () => {
      renderDefaultComponent({ disabled: false, question })
      store.dispatch(hideValidationErrors())

      const input = screen.getByLabelText('t.o.m')

      userEvent.type(input, '20210202')
      userEvent.click(screen.getByText('Fr.o.m'))
      expect(screen.queryByText('Ange ett datum.')).not.toBeInTheDocument()
    })

    it('should not show complete date message if complete dates are inserted', () => {
      renderDefaultComponent({ disabled: false, question })

      userEvent.type(screen.getByLabelText('Fr.o.m'), '20210202')
      userEvent.type(screen.getByLabelText('t.o.m'), '20210202')
      userEvent.click(screen.getByText('Fr.o.m'))
      expect(screen.queryByText('Ange ett datum.')).not.toBeInTheDocument()
    })
  })
})
