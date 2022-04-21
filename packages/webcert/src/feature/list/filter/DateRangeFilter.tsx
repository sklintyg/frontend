import * as React from 'react'
import { useEffect, useState } from 'react'
import { ListFilterDateRangeConfig, ListFilterValue, ListFilterValueDateRange } from '@frontend/common/src/types/list'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import styled from 'styled-components/macro'
import { DatePickerCustom, isDateRangeValidOrIncomplete, isFutureDate, ValidationError } from '@frontend/common'
import { FilterWrapper } from './filterStyles'

const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'
const FUTURE_DATES_ERROR = 'Ange ett giltigt datum. Framtida datum ger inga resultat.'

interface Props {
  config: ListFilterDateRangeConfig
  onChange: (value: ListFilterValue, id: string) => void
}

const DateRangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  z-index: 10000;
`

const DateRangeFilter: React.FC<Props> = ({ config, onChange }) => {
  const dispatch = useDispatch()
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueDateRange
  const from = config.from
  const to = config.to
  const [toValidationError, setToValidationError] = useState<ValidationError | null>(null)
  const [fromValidationError, setFromValidationError] = useState<ValidationError | null>(null)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)

  useEffect(() => {
    if (value) {
      toggleValidationError(value.to, value.from)
    }
  }, [value])

  useEffect(() => {
    dispatch(updateHasValidationError(!!validationError))
  }, [validationError])

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

  const toggleValidationError = (to: string, from: string) => {
    if (from && to && !isDateRangeValidOrIncomplete(from, to)) {
      setValidationError({
        category: '',
        field: '',
        id: '',
        text: INVALID_DATE_PERIOD_ERROR,
        type: 'INVALID_DATE_PERIOD',
        showAlways: true,
      })
    } else if (isFutureDate(to) || isFutureDate(from)) {
      setValidationError({
        category: '',
        field: '',
        id: '',
        text: FUTURE_DATES_ERROR,
        type: 'FUTURE_DATES_ERROR',
        showAlways: true,
      })
    } else {
      setValidationError(null)
    }
  }

  const getFromValue = () => {
    return value ? value.from : ''
  }

  const getToValue = () => {
    return value ? value.to : ''
  }

  const onValidationError = (isInactive: boolean, validationError: ValidationError) => {
    if (validationError.field === to.id) {
      setToValidationError(isInactive ? null : validationError)
    } else {
      setFromValidationError(isInactive ? null : validationError)
    }
  }

  return (
    <div>
      <label>{config.title}</label>
      <DateRangeWrapper>
        <FilterWrapper highlighted={getFromValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={from.title}
            setDate={onFromDateFilterChange}
            inputString={getFromValue()}
            textInputOnChange={onFromDateFilterChange}
            id={`${config.id}-${from.id}`}
            forbidFutureDates={config.forbidFutureDates}
            onDispatchValidationError={onValidationError}
            componentField={from.id}
            displayValidationErrorOutline={!!fromValidationError || !!validationError}
          />
          {fromValidationError && <p className="iu-color-error">{fromValidationError.text}</p>}
        </FilterWrapper>
        <FilterWrapper highlighted={getToValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={to.title}
            setDate={onToDateFilterChange}
            inputString={getToValue()}
            textInputOnChange={onToDateFilterChange}
            id={`${config.id}-${to.id}`}
            forbidFutureDates={config.forbidFutureDates}
            onDispatchValidationError={onValidationError}
            componentField={to.id}
            displayValidationErrorOutline={!!toValidationError || !!validationError}
          />
          {toValidationError && <p className="iu-color-error">{toValidationError.text}</p>}
        </FilterWrapper>
      </DateRangeWrapper>
      {validationError && <p className="iu-color-error">{validationError.text}</p>}
    </div>
  )
}

export default DateRangeFilter
