import * as React from 'react'
import { ChangeEvent } from 'react'
import {
  ListFilterConfig,
  ListFilterDateRangeConfig,
  ListFilterSelectConfig,
  ListFilterType,
  ListFilterValue,
  ListFilterValueDateRange,
  ListFilterValuePersonId,
  ListFilterValueSelect,
  ListFilterValueText,
} from '@frontend/common/src/types/list'
import TextInput from '@frontend/common/src/components/Inputs/TextInput'
import { useSelector } from 'react-redux'
import { Dropdown } from '@frontend/common/src/components'
import { getActiveListFilterValue } from '../../store/list/listSelectors'
import PersonIdInput from '@frontend/common/src/components/Inputs/PatientIdInput'
import { getListFilterDefaultValue } from './listUtils'
import styled from 'styled-components/macro'
import _ from 'lodash'
import { DatePickerCustom } from '@frontend/common/src'

interface Props {
  config: ListFilterConfig
  onChange: (value: ListFilterValue, id: string) => void
}

interface WrapperProps {
  highlighted: boolean
}

//should not show highlight if validation error
const Wrapper = styled.div<WrapperProps>`
  .dropdown {
    min-width: 30ch !important;
  }

  .dropdown,
  input,
  button {
    background-color: ${(props) => (props.highlighted ? 'rgba(1, 165, 163, 0.08)' : '')};
  }
`

const DateRangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
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

  const onFromDateFilterChange = (date: string) => {
    const updatedValue: ListFilterValue = { ...value }
    updatedValue.from = date
    onChange(value, config.id)
  }

  const onToDateFilterChange = (date: string) => {
    const updatedValue: ListFilterValue = { ...value }
    updatedValue.to = date
    onChange(value, config.id)
  }

  const isValueDefaultValue = () => {
    const defaultValue = getListFilterDefaultValue(config)
    return _.isEqual(defaultValue, value)
  }

  const getFilterComponent = () => {
    if (config.type === ListFilterType.TEXT) {
      return (
        <TextInput
          onChange={(e) => onTextFilterChange(e)}
          value={value ? (value as ListFilterValueText).value : ''}
          label={config.title}
          id={config.id}
        />
      )
    } else if (config.type === ListFilterType.PERSON_ID) {
      return (
        <PersonIdInput
          onFormattedChange={(e) => onPersonIdFilterChange(e)}
          value={value ? (value as ListFilterValueText).value : ''}
          label={config.title}
          id={config.id}
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
    } else if (config.type === ListFilterType.DATE_RANGE) {
      const from = (config as ListFilterDateRangeConfig).from
      const to = (config as ListFilterDateRangeConfig).to
      return (
        <div>
          <label>{config.title}</label>
          <DateRangeWrapper>
            <DatePickerCustom
              label={from.title}
              setDate={onFromDateFilterChange}
              inputString={value ? (value as ListFilterValueDateRange).from : ''}
              textInputOnChange={onFromDateFilterChange}
              displayValidationErrorOutline={false}
              id={config.id}
            />
            <DatePickerCustom
              label={to.title}
              setDate={onToDateFilterChange}
              inputString={value ? (value as ListFilterValueDateRange).to : ''}
              textInputOnChange={onToDateFilterChange}
              displayValidationErrorOutline={false}
              id={config.id}
            />
          </DateRangeWrapper>
        </div>
      )
    }
  }

  return <Wrapper highlighted={!isValueDefaultValue()}>{getFilterComponent()}</Wrapper>
}

export default ListFilterComponent
