import { Dropdown, ListFilterSelectConfig, ListFilterType, ListFilterValue, ListFilterValueSelect, sanitizeText } from '@frontend/common'
import * as React from 'react'
import { ChangeEvent } from 'react'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { FilterWrapper } from './filterStyles'

interface Props {
  /** Contains all filter options that should be displayed. */
  config: ListFilterSelectConfig
  /** Action to trigger. */
  onChange: (value: ListFilterValue, id: string) => void
  /** Is highlighted. :) */
  isHighlighted: boolean
}

/**
 * Component for generating a generic dropdown field based on the provided configuration.
 */
const SelectFilter: React.FC<Props> = ({ config, onChange, isHighlighted }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueSelect

  const onSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.SELECT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  if (config.values.length === 0) {
    return null
  }

  return (
    <FilterWrapper highlighted={isHighlighted}>
      <Dropdown
        onChange={onSelectFilterChange}
        label={config.title}
        id={config.id}
        value={value ? (value as ListFilterValueSelect).value : ''}>
        {config.values.map((configValue) => (
          <option
            key={configValue.id}
            id={configValue.id}
            value={configValue.id}
            defaultValue={configValue.defaultValue ? configValue.id : ''}
            dangerouslySetInnerHTML={sanitizeText(configValue.name)}
          />
        ))}
      </Dropdown>
    </FilterWrapper>
  )
}

export default SelectFilter
