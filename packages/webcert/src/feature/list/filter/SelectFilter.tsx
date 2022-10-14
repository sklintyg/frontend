import * as React from 'react'
import { ChangeEvent } from 'react'
import { ListFilterSelectConfig, ListFilterType, ListFilterValue, ListFilterValueSelect } from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { FilterWrapper } from './filterStyles'
import { sanitizeText } from '@frontend/common'

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

  const getSelectOptions = () => {
    return config.values.map((configValue) => (
      <option
        key={configValue.id}
        id={configValue.id}
        value={configValue.id}
        defaultValue={configValue.defaultValue ? configValue.id : ''}
        dangerouslySetInnerHTML={sanitizeText(configValue.name)}
      />
    ))
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
        options={getSelectOptions()}
        value={value ? (value as ListFilterValueSelect).value : ''}
      />
    </FilterWrapper>
  )
}

export default SelectFilter
