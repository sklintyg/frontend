import * as React from 'react'
import { ChangeEvent } from 'react'
import { ListFilterPageSizeConfig, ListFilterType, ListFilterValue, ListFilterValueNumber } from '@frontend/common/src/types/list'
import { Dropdown } from '@frontend/common/src/components'

interface Props {
  filter: ListFilterPageSizeConfig | undefined
  totalCount: number
  onFilterChange: (value: ListFilterValue, id: string) => void
  value: ListFilterValueNumber
}

const ListPageSizeFilter: React.FC<Props> = ({ filter, totalCount, onFilterChange, value }) => {
  const pageSizes: number[] = filter ? filter.pageSizes : []

  if (!filter || pageSizes.length === 0 || totalCount <= pageSizes[0]) {
    return null
  }

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueNumber = {
      type: ListFilterType.NUMBER,
      value: parseInt(event.target.value),
    }
    onFilterChange(value, filter.id)
  }

  const getSelectOptions = () => {
    return pageSizes.map((number) =>
      totalCount >= number ? (
        <option id={filter.id + '-' + number} value={number} key={filter.id + '-' + number}>
          {number}
        </option>
      ) : null
    )
  }

  const getFilterComponent = () => {
    return (
      <div className={'iu-pb-300'}>
        <Dropdown
          onChange={(e) => handleFilterChange(e)}
          label={filter.title}
          id={filter.id}
          options={getSelectOptions()}
          value={value ? value.value.toString() : ''}
        />
      </div>
    )
  }

  return <>{getFilterComponent()}</>
}

export default ListPageSizeFilter
