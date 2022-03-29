import * as React from 'react'
import { ChangeEvent } from 'react'
import { ListFilterPageSizeConfig, ListFilterType, ListFilterValue, ListFilterValueSelect } from '@frontend/common/src/types/list'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../store/list/listSelectors'
import { performListSearch, updateActiveListFilterValue } from '../../store/list/listActions'

interface Props {
  filter: ListFilterPageSizeConfig | undefined
}

const ListPageSizeFilter: React.FC<Props> = ({ filter }) => {
  const dispatch = useDispatch()
  const value = useSelector(getActiveListFilterValue(filter ? filter.id : '')) as ListFilterValue
  const pageSizes: number[] = filter ? filter.pageSizes : []

  if (!filter) {
    return null
  }

  const onFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.NUMBER,
      value: event.target.value,
    }
    dispatch(updateActiveListFilterValue({ filterValue: value, id: filter.id }))
    dispatch(performListSearch)
  }

  const getSelectOptions = () => {
    return pageSizes.map((number) => (
      <option id={filter.id + '-' + number} value={number}>
        {number}
      </option>
    ))
  }

  const getFilterComponent = () => {
    return (
      <div className={'iu-pb-300'}>
        <Dropdown
          onChange={(e) => onFilterChange(e)}
          label={filter.title}
          id={filter.id}
          options={getSelectOptions()}
          value={value ? (value as ListFilterValueSelect).value : ''}
        />
      </div>
    )
  }

  return <>{getFilterComponent()}</>
}

export default ListPageSizeFilter
