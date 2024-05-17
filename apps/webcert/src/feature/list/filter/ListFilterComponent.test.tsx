import { EnhancedStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { vi } from 'vitest'
import {
  fakeBooleanFilter,
  fakeDateFilter,
  fakeDateRangeFilter,
  fakeOrderFilter,
  fakePersonIdFilter,
  fakeRadioFilter,
  fakeSelectFilter,
  fakeTextFilter,
} from '../../../faker/list/fakeListFilterConfig'
import { configureApplicationStore } from '../../../store/configureApplicationStore'
import { updateActiveListFilterValue } from '../../../store/list/listActions'
import { listMiddleware } from '../../../store/list/listMiddleware'
import { ListFilterConfig, ListFilterType } from '../../../types'
import ListFilterComponent from './ListFilterComponent'

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
      renderComponent(fakeTextFilter())
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should display text filter title', () => {
      renderComponent(fakeTextFilter({ title: 'Text title' }))
      expect(screen.getByLabelText('Text title')).toBeInTheDocument()
    })

    it('should display select filter component', () => {
      renderComponent(fakeSelectFilter())
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('should display radio filter component', () => {
      renderComponent(fakeRadioFilter())
      expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    })

    it('should display one radio button per value', () => {
      const filter = fakeRadioFilter()
      renderComponent(filter)
      expect(screen.getAllByRole('radio')).toHaveLength(filter.values.length)
    })

    it('should display radio filter title', () => {
      renderComponent(fakeTextFilter({ title: 'Radio title' }))
      expect(screen.getByLabelText('Radio title')).toBeInTheDocument()
    })

    it('should display person id filter component', () => {
      renderComponent(fakePersonIdFilter())
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should display date range filter title', () => {
      renderComponent(fakeDateRangeFilter({ title: 'Date range title' }))
      expect(screen.getByText('Date range title')).toBeInTheDocument()
    })

    it('should display date range filter to title', () => {
      renderComponent(fakeDateRangeFilter({ to: fakeDateFilter({ title: 'To title' }) }))
      expect(screen.getByLabelText('To title')).toBeInTheDocument()
    })

    it('should display date range filter from title', () => {
      renderComponent(fakeDateRangeFilter({ from: fakeDateFilter({ title: 'From title' }) }))
      expect(screen.getByLabelText('From title')).toBeInTheDocument()
    })

    it('should display person id filter title', () => {
      renderComponent(fakePersonIdFilter({ title: 'Person id title' }))
      expect(screen.getByLabelText('Person id title')).toBeInTheDocument()
    })

    it('should not display order filter', () => {
      renderComponent(fakeOrderFilter({ title: 'Order title' }))
      expect(screen.queryByLabelText('Order title')).not.toBeInTheDocument()
    })

    it('should not display boolean filter title', () => {
      renderComponent(fakeBooleanFilter({ title: 'Boolean title' }))
      expect(screen.queryByLabelText('Boolean title')).not.toBeInTheDocument()
    })
  })

  describe('Update values', () => {
    beforeEach(() => {
      onChange = vi.fn()
    })

    it('should update text filter value', async () => {
      renderComponent(fakeTextFilter())
      const component = screen.getByRole('textbox')
      await userEvent.type(component, 't')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.TEXT, value: 't' }, component.id)
    })

    it('should update person id filter value if person id is valid', async () => {
      renderComponent(fakePersonIdFilter())
      const component = screen.getByRole('textbox')
      await userEvent.type(component, '19121212-1212')
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.PERSON_ID, value: '19121212-1212' }, component.id)
    })

    it('should not update person id filter value if person id is invalid', async () => {
      renderComponent(fakePersonIdFilter())
      const component = screen.getByRole('textbox')
      await userEvent.type(component, '111')
      expect(onChange).not.toHaveBeenCalled()
    })

    it('should update select filter value', async () => {
      renderComponent(fakeSelectFilter())
      const select = screen.getByRole('combobox')
      const options = screen.getAllByRole('option')
      await userEvent.selectOptions(select, options[1])
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.SELECT, value: options[1].id }, select.id)
    })

    it('should update date range filter to value', async () => {
      testStore.dispatch(
        updateActiveListFilterValue({ id: 'DATE_RANGE_FILTER', filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } })
      )
      const filter = fakeDateRangeFilter({ id: 'DATE_RANGE_FILTER' })
      renderComponent(filter)

      const to = screen.getByLabelText('to')
      await userEvent.type(to, '2020-01-01')

      expect(onChange).toHaveBeenCalledWith({ from: '', to: '2020-01-01', type: 'DATE_RANGE' }, filter.id)
    })

    it('should update date range filter from value', async () => {
      testStore.dispatch(
        updateActiveListFilterValue({ id: 'DATE_RANGE_FILTER', filterValue: { type: ListFilterType.DATE_RANGE, to: '', from: '' } })
      )
      const filter = fakeDateRangeFilter({ id: 'DATE_RANGE_FILTER' })

      renderComponent(filter)
      const from = screen.getByLabelText('from')

      await userEvent.type(from, '2020-01-01')
      expect(onChange).toHaveBeenCalledWith({ from: '2020-01-01', to: '', type: 'DATE_RANGE' }, filter.id)
    })

    it('should update radio filter value', async () => {
      const filter = fakeRadioFilter()
      renderComponent(filter)
      const radiobuttons = screen.getAllByRole('radio')
      await userEvent.click(radiobuttons[0])
      expect(onChange).toHaveBeenCalledWith({ type: ListFilterType.RADIO, value: radiobuttons[0].id }, filter.id)
    })
  })
})
