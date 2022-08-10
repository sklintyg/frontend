import * as React from 'react'
import { ChangeEvent } from 'react'
import { ListFilterPageSizeConfig, ListFilterType, ListFilterValue, ListFilterValueNumber } from '@frontend/common/src/types/list'
import { Dropdown } from '@frontend/common/src/components'
import { updateActiveListFilterValue } from '../../store/list/listActions'
import { useDispatch } from 'react-redux'

interface Props {
  filter: ListFilterPageSizeConfig | undefined
  totalCount: number
  onFilterChange: (value: ListFilterValue, id: string) => void
  value: ListFilterValueNumber
}

const ListPageSizeFilter: React.FC<Props> = ({ filter, totalCount, onFilterChange, value }) => {
  const pageSizes: number[] = filter ? filter.pageSizes : []
  const SHOW_ALL = 'show-all'
  const dispatch = useDispatch()

  if (!filter || pageSizes.length === 0 || totalCount <= pageSizes[0]) {
    return null
  }

  const resetStartFrom = () => {
    const startFrom: ListFilterValueNumber = {
      type: ListFilterType.NUMBER,
      value: 0,
    }

    dispatch(updateActiveListFilterValue({ filterValue: startFrom, id: 'START_FROM' }))
  }

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.options.selectedIndex
    const selectedId = event.target.options[selectedIndex ? selectedIndex : 0].id

    const value: ListFilterValueNumber = {
      type: ListFilterType.NUMBER,
      value: parseInt(event.target.value),
    }

    if (selectedId === SHOW_ALL) {
      resetStartFrom()
    }

    onFilterChange(value, filter.id)
  }

  const getSelectOptions = () => {
    return (
      <>
        {pageSizes.map((number) =>
          totalCount >= number ? (
            <option id={filter.id + '-' + number} value={number} key={filter.id + '-' + number}>
              {number}
            </option>
          ) : null
        )}
        <option id={SHOW_ALL} value={totalCount} key={SHOW_ALL}>
          alla
        </option>
      </>
    )
  }

  const getFilterComponent = () => {
    return (
      <div className="iu-pb-300">
        <Dropdown
          onChange={handleFilterChange}
          label={filter.title}
          id={filter.id}
          options={getSelectOptions()}
          value={value ? value.value.toString() : ''}
        />
      </div>
    )
  }

  return getFilterComponent()
}

export default ListPageSizeFilter
