import { isEqual } from 'lodash-es'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { useAppSelector } from '../../../store/store'
import type {
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterRadioConfig,
  ListFilterSelectConfig,
  ListFilterValue,
} from '../../../types'
import { ListFilterType } from '../../../types'
import { getListFilterDefaultValue } from '../listUtils'
import DateRangeFilter from './DateRangeFilter'
import PersonIdFilter from './PersonIdFilter'
import RadioFilter from './RadioFilter'
import SelectFilter from './SelectFilter'
import TextFilter from './TextFilter'

interface Props {
  /** For this filter and sub-components */
  config: ListFilterConfig
  /** Action to trigger when something changes. */
  onChange: (value: ListFilterValue, id: string) => void
}

/**
 * Generates a components for filtering a table based on provided configuration.
 */
const ListFilterComponent = ({ config, onChange }: Props) => {
  const value = useAppSelector(getActiveListFilterValue(config.id))

  const isValueDefaultValue = () => {
    const defaultValue = getListFilterDefaultValue(config)
    return isEqual(defaultValue, value)
  }

  const isHighlighted = () => {
    return !isValueDefaultValue() || config.alwaysHighlighted
  }

  const getFilterComponent = (): React.ReactNode => {
    switch (config.type) {
      case ListFilterType.TEXT:
        return <TextFilter config={config} onChange={onChange} isHighlighted={isHighlighted()} />
      case ListFilterType.PERSON_ID:
        return <PersonIdFilter config={config} onChange={onChange} isHighlighted={isHighlighted()} />
      case ListFilterType.SELECT:
        return <SelectFilter config={config as ListFilterSelectConfig} onChange={onChange} isHighlighted={isHighlighted()} />
      case ListFilterType.DATE_RANGE:
        return <DateRangeFilter config={config as ListFilterDateRangeConfig} onChange={onChange} />
      case ListFilterType.RADIO:
        return <RadioFilter config={config as ListFilterRadioConfig} onChange={onChange} isHighlighted={isHighlighted()} />
      default:
        return null
    }
  }

  return <>{getFilterComponent()}</>
}

export default ListFilterComponent
