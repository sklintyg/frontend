import * as React from 'react'
import {
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterRadioConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValue,
} from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { getListFilterDefaultValue } from '../listUtils'
import { isEqual } from 'lodash'
import DateRangeFilter from './DateRangeFilter'
import SelectFilter from './SelectFilter'
import PersonIdFilter from './PersonIdFilter'
import TextFilter from './TextFilter'
import RadioFilter from './RadioFilter'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
}

const ListFilterComponent: React.FC<Props> = ({ config, onChange }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValue

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
