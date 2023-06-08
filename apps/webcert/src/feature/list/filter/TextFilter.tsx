import { ListFilterConfig, ListFilterType, ListFilterValue, ListFilterValueText, TextInput } from '@frontend/common'
import * as React from 'react'
import { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const ListFilterComponent: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValue

  const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueText = {
      type: ListFilterType.TEXT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <TextInput
        onChange={onTextFilterChange}
        value={value ? (value as ListFilterValueText).value : ''}
        label={config.title}
        id={config.id}
      />
    </FilterWrapper>
  )
}

export default ListFilterComponent
