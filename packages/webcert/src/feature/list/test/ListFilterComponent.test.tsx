import { render, screen } from '@testing-library/react'
import React from 'react'
import ListFilterComponent from '../filter/ListFilterComponent'
import { ListFilterConfig, ListFilterType } from '@frontend/common/src/types/list'
import { getBooleanFilter, getDateRangeFilter, getOrderFilter, getPersonIdFilter, getSelectFilter, getTextFilter } from './listTestUtils'
import { Provider } from 'react-redux'
import userEvent from '@testing-library/user-event'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import reducer from '../../../store/reducers'
import { listMiddleware } from '../../../store/list/listMiddleware'

let testStore: EnhancedStore
const onChange = jest.fn()

const renderComponent = (config: ListFilterConfig) => {
  render(
    <Provider store={testStore}>
      <ListFilterComponent config={config} onChange={onChange} />
    </Provider>
  )
}

describe('ListFilterComponent', () => {
  beforeEach(() => {
    testStore = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listMiddleware),
    })
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
    it('should update text filter value', () => {
      renderComponent(getTextFilter())
      const component = screen.getByRole('textbox')
      userEvent.type(component, 't')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.TEXT, value: 't' }, component.id)
    })

    it('should update person id filter value', () => {
      renderComponent(getPersonIdFilter())
      const component = screen.getByRole('textbox')
      userEvent.type(component, '1')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.PERSON_ID, value: '1' }, component.id)
    })

    it('should update select filter value', () => {
      renderComponent(getSelectFilter())
      const select = screen.getByRole('combobox')
      const options = screen.getAllByRole('option')
      userEvent.selectOptions(select, options[1])
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.SELECT, value: options[1].id }, select.id)
    })

    it('should update date range filter value', () => {
      renderComponent(getSelectFilter())
      const to = screen.getByLabelText('to')
      const from = screen.getAllByRole('from')
    })
  })
})
