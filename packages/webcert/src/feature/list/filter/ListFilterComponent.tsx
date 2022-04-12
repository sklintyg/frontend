import * as React from 'react'
import { ChangeEvent } from 'react'
import {
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValuePersonId,
  ListFilterValueSelect,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import TextInput from '@frontend/common/src/components/Inputs/TextInput'
import { useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import PersonIdInput from '@frontend/common/src/components/Inputs/PatientIdInput'
import { getListFilterDefaultValue } from '../listUtils'
import styled from 'styled-components/macro'
import _ from 'lodash'
import DateRangeFilter from './DateRangeFilter'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
}

interface WrapperProps {
  highlighted: boolean
}

const FilterWrapper = styled.div<WrapperProps>`
  .dropdown {
    min-width: 30ch !important;
  }

  .dropdown,
  input,
  button {
    :not(.error) {
      background-color: ${(props) => (props.highlighted ? 'rgba(1, 165, 163, 0.08)' : '')};
    }
  }
`

const ListFilterComponent: React.FC<Props> = ({ config, onChange }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValue

  const onTextFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: ListFilterValueText = {
      type: ListFilterType.TEXT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  const onPersonIdFilterChange = (formattedId: string) => {
    const value: ListFilterValuePersonId = {
      type: ListFilterType.PERSON_ID,
      value: formattedId,
    }
    onChange(value, config.id)
  }

  const onSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value: ListFilterValueSelect = {
      type: ListFilterType.SELECT,
      value: event.target.value,
    }
    onChange(value, config.id)
  }

  const getSelectOptions = () => {
    return (config as ListFilterSelectConfig).values.map((configValue) => (
      <option key={configValue.id} id={configValue.id} value={configValue.id} defaultValue={configValue.defaultValue ? configValue.id : ''}>
        {configValue.name}
      </option>
    ))
  }

  const isValueDefaultValue = () => {
    const defaultValue = getListFilterDefaultValue(config)
    return _.isEqual(defaultValue, value)
  }

  const isHighlighted = () => {
    return !isValueDefaultValue() || config.alwaysHighlighted
  }

  const getFilterComponent = () => {
    if (config.type === ListFilterType.TEXT) {
      return (
        <FilterWrapper highlighted={isHighlighted()}>
          <TextInput
            onChange={(e) => onTextFilterChange(e)}
            value={value ? (value as ListFilterValueText).value : ''}
            label={config.title}
            id={config.id}
          />
        </FilterWrapper>
      )
    } else if (config.type === ListFilterType.PERSON_ID) {
      return (
        <FilterWrapper highlighted={isHighlighted()}>
          <PersonIdInput
            onFormattedChange={(e) => onPersonIdFilterChange(e)}
            value={value ? (value as ListFilterValueText).value : ''}
            label={config.title}
            id={config.id}
          />
        </FilterWrapper>
      )
    } else if (config.type === ListFilterType.SELECT) {
      return (
        <FilterWrapper highlighted={isHighlighted()}>
          <Dropdown
            onChange={(e) => onSelectFilterChange(e)}
            label={config.title}
            id={config.id}
            options={getSelectOptions()}
            value={value ? (value as ListFilterValueSelect).value : ''}
          />
        </FilterWrapper>
      )
    } else if (config.type === ListFilterType.DATE_RANGE) {
      return <DateRangeFilter config={config as ListFilterDateRangeConfig} onChange={onChange} />
    }
  }

  return <>{getFilterComponent()}</>
}

export default ListFilterComponent
