import { render, screen } from '@testing-library/react'
import React from 'react'
import { getDateRangeFilter } from './listTestUtils'
import store from '../../../store/store'
import { Provider } from 'react-redux'
import DateRangeFilter from '../filter/DateRangeFilter'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { ListFilterType } from '@frontend/common/src/types/list'
import userEvent from '@testing-library/user-event'

const onChange = jest.fn()

const config = getDateRangeFilter()

const renderComponent = () => {
  render(
    <Provider store={store}>
      <DateRangeFilter config={config} onChange={onChange} />
    </Provider>
  )
}

describe('DateRangeFilter', () => {
  beforeEach(() => {
    store.dispatch(updateActiveListFilterValue({ id: config.id, filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } }))
  })

  describe('Validation', () => {
    it('should display future dates validation error', () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      const dateString = date.toISOString().slice(0, 10)
      store.dispatch(
        updateActiveListFilterValue({ id: config.id, filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: dateString } })
      )

      renderComponent()

      expect(screen.getByText('Ange ett giltigt datum. Framtida datum ger inga resultat.')).toBeInTheDocument()
    })

    it('should display invalid date period validation error', () => {
      store.dispatch(
        updateActiveListFilterValue({
          id: config.id,
          filterValue: { type: ListFilterType.DATE_RANGE, to: '2020-01-01', from: '2020-01-05' },
        })
      )

      renderComponent()

      expect(screen.getByText('Ange ett slutdatum som infaller efter startdatumet.')).toBeInTheDocument()
    })

    it('should not call onChange if date is not valid', () => {
      renderComponent()

      const input = screen.getByText('from')
      userEvent.type(input, 'abcd')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should not call onChange if future date', () => {
      renderComponent()

      const input = screen.getByText('from')
      userEvent.type(input, '3000-01-01')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should not call onChange for to date if to date is before from date', () => {
      renderComponent()

      const from = screen.getByText('from')
      const to = screen.getByText('to')
      userEvent.type(from, '2020-02-02')
      userEvent.type(to, '2020-01-01')

      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('should call onChange if correct date', () => {
      renderComponent()

      const from = screen.getByText('from')
      userEvent.type(from, '2020-02-02')

      expect(onChange).toHaveBeenCalled()
    })

    it('should call onChange if date returns to empty', () => {
      renderComponent()

      const [from, to] = screen.getAllByRole('textbox')

      expect(onChange).toHaveBeenCalledTimes(0)

      userEvent.type(from, '2022-08-18')

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenLastCalledWith({ from: '2022-08-18', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      userEvent.clear(from)

      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      userEvent.type(to, '2022-08-18')

      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '2022-08-18', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      userEvent.clear(to)

      expect(onChange).toHaveBeenCalledTimes(4)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')
    })
  })
})
