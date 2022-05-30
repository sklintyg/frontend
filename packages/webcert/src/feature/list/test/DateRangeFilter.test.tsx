import { render, screen } from '@testing-library/react'
import React from 'react'
import { getDateRangeFilter } from './listTestUtils'
import store from '../../../store/store'
import { Provider } from 'react-redux'
import DateRangeFilter from '../filter/DateRangeFilter'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { ListFilterType } from '@frontend/common/src/types/list'

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
  })
})
