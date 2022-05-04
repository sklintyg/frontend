import * as React from 'react'
import { ChangeEvent } from 'react'
import { ListFilterSelectConfig, ListFilterType, ListFilterValue, ListFilterValueSelect } from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { FilterWrapper } from './filterStyles'

interface Props {
  config: ListFilterSelectConfig
  onChange: (value: ListFilterValue, id: string) => void
  isHighlighted: boolean
}

const SelectFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueSelect

  const onSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.SELECT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  const getSelectOptions = () => {
    return config.values.map((configValue) => (
      <option key={configValue.id} id={configValue.id} value={configValue.id} defaultValue={configValue.defaultValue ? configValue.id : ''}>
        {configValue.name}
      </option>
    ))
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <Dropdown
        onChange={onSelectFilterChange}
        label={config.title}
        id={config.id}
        options={getSelectOptions()}
        value={value ? (value as ListFilterValueSelect).value : ''}
      />
    </FilterWrapper>
  )
}

export default SelectFilter
