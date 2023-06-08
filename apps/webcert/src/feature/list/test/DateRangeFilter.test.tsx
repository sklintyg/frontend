import { ListFilterType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays } from 'date-fns'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import DateRangeFilter from '../filter/DateRangeFilter'
import { getDateRangeFilter } from './listTestUtils'

let onChange = vi.fn()

const config = getDateRangeFilter()

let testStore: EnhancedStore

const renderComponent = () => {
  render(
    <Provider store={testStore}>
      <DateRangeFilter config={config} onChange={onChange} />
    </Provider>
  )
}

describe('DateRangeFilter', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([listMiddleware])
    testStore.dispatch(updateActiveListFilterValue({ id: config.id, filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } }))
  })

  describe('Validation', () => {
    beforeEach(() => {
      onChange = vi.fn()
    })

    it('should display future dates validation error', () => {
      testStore.dispatch(
        updateActiveListFilterValue({
          id: config.id,
          filterValue: {
            type: ListFilterType.DATE_RANGE,
            to: '',
            from: addDays(new Date(), 2)
              .toISOString()
              .slice(0, 10),
          },
        })
      )

      renderComponent()

      expect(screen.getByText('Ange ett giltigt datum. Framtida datum ger inga resultat.')).toBeInTheDocument()
    })

    it('should display invalid date period validation error', () => {
      testStore.dispatch(
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
