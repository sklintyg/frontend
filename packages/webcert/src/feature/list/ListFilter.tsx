import * as React from 'react'
import { ChangeEvent } from 'react'
import {
  ListFilterConfig,
  ListFilterConfigValue,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import TextInput from '@frontend/common/src/components/Inputs/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../store/list/listSelectors'
import { addValueToActiveListFilter } from '../../store/list/listActions'

interface Props {
  config: ListFilterConfig
}

const ListFilter: React.FC<Props> = ({ config }) => {
  const dispatch = useDispatch()
  const value = useSelector(getActiveListFilterValue(config.id))

  const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueText = {
      id: config.id,
      value: event.target.value,
    }
    dispatch(addValueToActiveListFilter(value))
  }

  const onSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueText = {
      id: config.id,
      value: event.target.value,
    }
    dispatch(addValueToActiveListFilter(value))
  }

  const isValueSelected = (configValue: ListFilterConfigValue) => {
    return value && value.id === configValue.id
  }

  const getSelectOptions = () => {
    return (config as ListFilterSelectConfig).values.map((configValue) => (
      <option id={config.id} selected={isValueSelected(configValue) || (!value && configValue.defaultValue)}>
        {configValue.name}
      </option>
    ))
  }

  const getFilterComponent = () => {
    if (config.type === ListFilterType.TEXT) {
      return (
        <TextInput onChange={(e) => onTextFilterChange(e)} value={value ? (value as ListFilterValueText).value : ''} label={config.title} />
      )
    } else if (config.type === ListFilterType.SELECT) {
      return <Dropdown onChange={(e) => onSelectFilterChange(e)} label={config.title} id={config.id} options={getSelectOptions()} />
    }
  }

  return <>{getFilterComponent()}</>
}

export default ListFilter
