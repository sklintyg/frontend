import * as React from 'react'
import { ListFilterDateRangeConfig, ListFilterValue, ListFilterValueDateRange } from '@frontend/common/src/types/list'
import { useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import styled from 'styled-components/macro'
import { DatePickerCustom } from '@frontend/common'

interface Props {
  config: ListFilterDateRangeConfig
  onChange: (value: ListFilterValue, id: string) => void
}

interface WrapperProps {
  highlighted: boolean
}

const Wrapper = styled.div<WrapperProps>`
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

const DateRangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  z-index: 10000;
`

const DateRangeFilter: React.FC<Props> = ({ config, onChange }) => {
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueDateRange
  const from = (config as ListFilterDateRangeConfig).from
  const to = (config as ListFilterDateRangeConfig).to

  const onFromDateFilterChange = (date: string) => {
    const updatedValue: ListFilterValue = { ...value }
    updatedValue.from = date
    onChange(updatedValue, config.id)
  }

  const onToDateFilterChange = (date: string) => {
    const updatedValue: ListFilterValue = { ...value }
    updatedValue.to = date
    onChange(updatedValue, config.id)
  }

  const getFromValue = () => {
    return value ? (value as ListFilterValueDateRange).from : ''
  }

  const getToValue = () => {
    return value ? (value as ListFilterValueDateRange).to : ''
  }

  return (
    <div>
      <label>{config.title}</label>
      <DateRangeWrapper>
        <Wrapper highlighted={getFromValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={from.title}
            setDate={onFromDateFilterChange}
            inputString={getFromValue()}
            textInputOnChange={onFromDateFilterChange}
            displayValidationErrorOutline={false}
            id={config.id}
            forbidFutureDates={config.forbidFutureDates}
          />
        </Wrapper>
        <Wrapper highlighted={getToValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={to.title}
            setDate={onToDateFilterChange}
            inputString={getToValue()}
            textInputOnChange={onToDateFilterChange}
            displayValidationErrorOutline={false}
            id={config.id}
            forbidFutureDates={config.forbidFutureDates}
          />
        </Wrapper>
      </DateRangeWrapper>
    </div>
  )
}

export default DateRangeFilter
