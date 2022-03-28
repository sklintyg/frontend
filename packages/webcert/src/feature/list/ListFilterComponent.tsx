import * as React from 'react'
import { ChangeEvent } from 'react'
import {
  ListFilterConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValuePersonId,
  ListFilterValueSelect,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import TextInput from '@frontend/common/src/components/Inputs/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../store/list/listSelectors'
import PersonIdInput from '@frontend/common/src/components/Inputs/PatientIdInput'
import { updateActiveListFilterValue } from '../../store/list/listActions'

interface Props {
  config: ListFilterConfig
}

const ListFilterComponent: React.FC<Props> = ({ config }) => {
  const dispatch = useDispatch()
  const value = useSelector(getActiveListFilterValue(config.id))

  const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueText = {
      type: ListFilterType.TEXT,
      value: event.target.value,
    }
    dispatch(updateActiveListFilterValue({ filterValue: value, id: config.id }))
  }

  const onPersonIdFilterChange = (formattedId: string) => {
    const value: ListFilterValuePersonId = {
      type: ListFilterType.PERSON_ID,
      value: formattedId,
    }
    dispatch(updateActiveListFilterValue({ filterValue: value, id: config.id }))
  }

  const onSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.SELECT,
      value: event.target.value,
    }
    dispatch(updateActiveListFilterValue({ filterValue: value, id: config.id }))
  }

  const getSelectOptions = () => {
    return (config as ListFilterSelectConfig).values.map((configValue) => (
      <option id={configValue.id} value={configValue.id} defaultValue={configValue.defaultValue ? configValue.id : ''}>
        {configValue.name}
      </option>
    ))
  }

  const getFilterComponent = () => {
    if (config.type === ListFilterType.TEXT) {
      return (
        <TextInput onChange={(e) => onTextFilterChange(e)} value={value ? (value as ListFilterValueText).value : ''} label={config.title} />
      )
    } else if (config.type === ListFilterType.PERSON_ID) {
      return (
        <PersonIdInput
          onFormattedChange={(e) => onPersonIdFilterChange(e)}
          value={value ? (value as ListFilterValueText).value : ''}
          label={config.title}
        />
      )
    } else if (config.type === ListFilterType.SELECT) {
      return (
        <Dropdown
          onChange={(e) => onSelectFilterChange(e)}
          label={config.title}
          id={config.id}
          options={getSelectOptions()}
          value={value ? (value as ListFilterValueSelect).value : ''}
        />
      )
    }
  }

  return <>{getFilterComponent()}</>
}

export default ListFilterComponent
