import type { ChangeEvent } from 'react'
import Dropdown from '../../../components/Inputs/Dropdown'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { useAppSelector } from '../../../store/store'
import type { ListFilterSelectConfig, ListFilterValue, ListFilterValueSelect } from '../../../types'
import { ListFilterType } from '../../../types'
import { sanitizeText } from '../../../utils'
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
const SelectFilter = ({ config, onChange, isHighlighted }: Props) => {
  const value = useAppSelector(getActiveListFilterValue(config.id)) as ListFilterValueSelect

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
        value={value ? (value as ListFilterValueSelect).value : ''}
      >
        {config.values.map((configValue, index) => (
          <option
            key={index}
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
