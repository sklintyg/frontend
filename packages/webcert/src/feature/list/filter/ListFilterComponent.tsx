import * as React from 'react'
import {
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValue,
} from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { getListFilterDefaultValue } from '../listUtils'
import _ from 'lodash'
import DateRangeFilter from './DateRangeFilter'
import SelectFilter from './SelectFilter'
import PersonIdFilter from './PersonIdFilter'
import TextFilter from './TextFilter'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
  resetFilterError: boolean
}

const ListFilterComponent: React.FC<Props> = ({ config, onChange, resetFilterError }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValue

  const isValueDefaultValue = () => {
    const defaultValue = getListFilterDefaultValue(config)
    return _.isEqual(defaultValue, value)
  }

  const isHighlighted = () => {
    return !isValueDefaultValue() || config.alwaysHighlighted
  }

  const getFilterComponent = () => {
    if (config.type === ListFilterType.TEXT) {
      return <TextFilter config={config} onChange={onChange} isHighlighted={isHighlighted()} />
    } else if (config.type === ListFilterType.PERSON_ID) {
      return <PersonIdFilter config={config} onChange={onChange} isHighlighted={isHighlighted()} />
    } else if (config.type === ListFilterType.SELECT) {
      return <SelectFilter config={config as ListFilterSelectConfig} onChange={onChange} isHighlighted={isHighlighted()} />
    } else if (config.type === ListFilterType.DATE_RANGE) {
      return <DateRangeFilter config={config as ListFilterDateRangeConfig} onChange={onChange} />
    }
  }

  return <>{getFilterComponent()}</>
}

export default ListFilterComponent
