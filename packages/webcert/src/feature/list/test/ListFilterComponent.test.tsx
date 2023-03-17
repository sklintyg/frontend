import { ListFilterConfig, ListFilterType } from '@frontend/common'
import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import ListFilterComponent from '../filter/ListFilterComponent'
import {
  getBooleanFilter,
  getDateRangeFilter,
  getOrderFilter,
  getPersonIdFilter,
  getRadioFilter,
  getSelectFilter,
  getTextFilter,
} from './listTestUtils'

let testStore: EnhancedStore
let onChange = vi.fn()

const renderComponent = (config: ListFilterConfig) => {
  render(
    <Provider store={testStore}>
      <ListFilterComponent config={config} onChange={onChange} />
    </Provider>
  )
}

describe('ListFilterComponent', () => {
  beforeEach(() => {
    testStore = configureApplicationStore([listMiddleware])
  })

  describe('Display filters', () => {
    it('should display text filter component', () => {
      renderComponent(getTextFilter('Text title'))
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should display text filter title', () => {
      renderComponent(getTextFilter('Text title'))
      expect(screen.getByLabelText('Text title')).toBeInTheDocument()
    })

    it('should display select filter component', () => {
      renderComponent(getSelectFilter('Select title'))
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should display radio filter component', () => {
      renderComponent(getRadioFilter('Radio title'))
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('should display one radio button per value', () => {
      const filter = getRadioFilter('Radio title')
      renderComponent(filter)
      expect(screen.getAllByRole('radio')).toHaveLength(filter.values.length)
    })

    it('should display radio filter title', () => {
      renderComponent(getTextFilter('Radio title'))
      expect(screen.getByLabelText('Radio title')).toBeInTheDocument()
    })

    it('should display person id filter component', () => {
      renderComponent(getPersonIdFilter('Person id title'))
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should display date range filter title', () => {
      renderComponent(getDateRangeFilter('Date range title'))
      expect(screen.getByText('Date range title')).toBeInTheDocument()
    })

    it('should display date range filter to title', () => {
      renderComponent(getDateRangeFilter('Date range title', 'To title'))
      expect(screen.getByLabelText('To title')).toBeInTheDocument()
    })

    it('should display date range filter from title', () => {
      renderComponent(getDateRangeFilter('Date range title', 'From title'))
      expect(screen.getByLabelText('From title')).toBeInTheDocument()
    })

    it('should display person id filter title', () => {
      renderComponent(getPersonIdFilter('Person id title'))
      expect(screen.getByLabelText('Person id title')).toBeInTheDocument()
    })

    it('should not display order filter', () => {
      renderComponent(getOrderFilter('Order title'))
      expect(screen.queryByLabelText('Order title')).not.toBeInTheDocument()
    })

    it('should not display boolean filter title', () => {
      renderComponent(getBooleanFilter('Boolean title'))
      expect(screen.queryByLabelText('Boolean title')).not.toBeInTheDocument()
    })
  })

  describe('Update values', () => {
    beforeEach(() => {
      onChange = vi.fn()
    })

    it('should update text filter value', () => {
      renderComponent(getTextFilter())
      const component = screen.getByRole('textbox')
      userEvent.type(component, 't')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.TEXT, value: 't' }, component.id)
    })

    it('should update person id filter value if person id is valid', () => {
      renderComponent(getPersonIdFilter())
      const component = screen.getByRole('textbox')
      userEvent.type(component, '19121212-1212')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.PERSON_ID, value: '19121212-1212' }, component.id)
    })

    it('should not update person id filter value if person id is invalid', () => {
      renderComponent(getPersonIdFilter())
      const component = screen.getByRole('textbox')
      userEvent.type(component, '111')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should update select filter value', () => {
      renderComponent(getSelectFilter())
      const select = screen.getByRole('combobox')
      const options = screen.getAllByRole('option')
      userEvent.selectOptions(select, options[1])
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.SELECT, value: options[1].id }, select.id)
    })

    it('should update date range filter to value', () => {
      testStore.dispatch(
        updateActiveListFilterValue({ id: 'DATE_RANGE_FILTER', filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } })
      )
      const filter = getDateRangeFilter()
      renderComponent(filter)

      const to = screen.getByLabelText('to')
      userEvent.type(to, '2020-01-01')

      expect(onChange).toHaveBeenCalledWith({ from: '', to: '2020-01-01', type: 'DATE_RANGE' }, filter.id)
    })

    it('should update date range filter from value', () => {
      testStore.dispatch(
        updateActiveListFilterValue({ id: 'DATE_RANGE_FILTER', filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } })
      )
      const filter = getDateRangeFilter()

      renderComponent(filter)
      const from = screen.getByLabelText('from')

      userEvent.type(from, '2020-01-01')
      expect(onChange).toHaveBeenCalledWith({ from: '2020-01-01', to: '', type: 'DATE_RANGE' }, filter.id)
    })

    it('should update radio filter value', () => {
      const filter = getRadioFilter()
      renderComponent(filter)
      const radiobuttons = screen.getAllByRole('radio')
      userEvent.click(radiobuttons[0])
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.RADIO, value: radiobuttons[0].id }, filter.id)
    })
  })
})
