import { fakeDateRangeElement } from '@frontend/common'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentProps } from 'react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { showValidationErrors } from '../../../../store/certificate/certificateActions'
import store from '../../../../store/store'
import UeDateRange from './UeDateRange'

const QUESTION_ID = 'Intervall'

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
    expect(() => renderDefaultComponent({ disabled: false, question })).not.toThrow()
  })

  describe('Validation error', () => {
    it('shows date range error when end date is before start date', () => {
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
  })
})
