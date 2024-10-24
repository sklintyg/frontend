import type { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDays } from 'date-fns'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { fakeDateRangeFilter } from '../../../faker/list/fakeListFilterConfig'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import { ListFilterType } from '../../../types'
import DateRangeFilter from './DateRangeFilter'

let onChange = vi.fn()

const config = fakeDateRangeFilter({ id: 'DATE_RANGE_FILTER' })

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
            from: addDays(new Date(), 2).toISOString().slice(0, 10),
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

    it('should not call onChange if date is not valid', async () => {
      renderComponent()

      const input = screen.getByText('from')
      await userEvent.type(input, 'abcd')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should not call onChange if future date', async () => {
      renderComponent()

      const input = screen.getByText('from')
      await userEvent.type(input, '3000-01-01')

      expect(onChange).not.toHaveBeenCalled()
    })

    it('should not call onChange for to date if to date is before from date', async () => {
      renderComponent()

      const from = screen.getByText('from')
      const to = screen.getByText('to')
      await userEvent.type(from, '2020-02-02')
      await userEvent.type(to, '2020-01-01')

      expect(onChange).toHaveBeenCalledTimes(1)
    })

    it('should call onChange if correct date', async () => {
      renderComponent()

      const from = screen.getByText('from')
      await userEvent.type(from, '2020-02-02')

      expect(onChange).toHaveBeenCalled()
    })

    it('should call onChange if date returns to empty', async () => {
      renderComponent()

      const [from, to] = screen.getAllByRole('textbox')

      expect(onChange).toHaveBeenCalledTimes(0)

      await userEvent.type(from, '2022-08-18')
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange).toHaveBeenLastCalledWith({ from: '2022-08-18', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      await userEvent.clear(from)
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      await userEvent.type(to, '2022-08-18')
      expect(onChange).toHaveBeenCalledTimes(3)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '2022-08-18', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')

      await userEvent.clear(to)
      expect(onChange).toHaveBeenCalledTimes(4)
      expect(onChange).toHaveBeenLastCalledWith({ from: '', to: '', type: 'DATE_RANGE' }, 'DATE_RANGE_FILTER')
    })
  })
})
