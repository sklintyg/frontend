import * as React from 'react'
import { useEffect, useState } from 'react'
import { ListFilterDateConfig, ListFilterDateRangeConfig, ListFilterValue, ListFilterValueDateRange } from '@frontend/common/src/types/list'
import { useDispatch, useSelector } from 'react-redux'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import styled from 'styled-components/macro'
import { DatePickerCustom, isDateBehindLimit, isDateRangeValidOrIncomplete, isFutureDate, ValidationError } from '@frontend/common'
import { FilterWrapper } from './filterStyles'
import questionImage from '@frontend/common/src/images/question.svg'
import { updateHasValidationError } from '../../../store/list/listActions'

const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'
const FUTURE_DATES_ERROR = 'Ange ett giltigt datum. Framtida datum ger inga resultat.'
const DATE_BEFORE_MIN = 'Ange ett giltigt datum. Datumet är för långt bak i tiden.'

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

const ValidationErrorContainer = styled.p`
  position: absolute;
  width: 228px;
`

const GlobalValidationErrorContainer = styled.p`
  position: absolute;
`

const Icon = styled.img`
  width: 14px;
`

const Label = styled.label`
  display: flex;
  gap: 4px;
`

const DateRangeFilter: React.FC<Props> = ({ config, onChange }) => {
  const dispatch = useDispatch()
  const value = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueDateRange
  const configFrom = config.from
  const configTo = config.to
  const [toValidationError, setToValidationError] = useState<ValidationError | null>(null)
  const [fromValidationError, setFromValidationError] = useState<ValidationError | null>(null)
  const [validationError, setValidationError] = useState<ValidationError | null>(null)

  useEffect(() => {
    if (value) {
      toggleValidationError(value.to, value.from)
    }
  }, [value])

  useEffect(() => {
    toggleSpecificValidationError(value.to, configTo, setToValidationError)
  }, [value.to])

  useEffect(() => {
    toggleSpecificValidationError(value.from, configFrom, setFromValidationError)
  }, [value.from])

  useEffect(() => {
    dispatch(updateHasValidationError(!!validationError || !!toValidationError || !!fromValidationError))
  }, [dispatch, validationError, toValidationError, fromValidationError])

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

  const shouldShowDateTooFarBackError = (value: string, limit: string | undefined) => {
    return limit && isDateBehindLimit(value, limit.split('T')[0])
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
    } else {
      setValidationError(null)
    }
  }

  const toggleSpecificValidationError = (
    value: string,
    config: ListFilterDateConfig,
    updateValidationError: (value: React.SetStateAction<ValidationError | null>) => void
  ) => {
    if (isFutureDate(value)) {
      updateValidationError({
        category: '',
        field: '',
        id: '',
        text: FUTURE_DATES_ERROR,
        type: 'FUTURE_DATES_ERROR',
        showAlways: true,
      })
    } else if (shouldShowDateTooFarBackError(value, config.min)) {
      setValidationError({
        category: '',
        field: '',
        id: '',
        text: DATE_BEFORE_MIN,
        type: 'DATE_BEFORE_MIN',
        showAlways: true,
      })
    } else {
      updateValidationError(null)
    }
  }

  const getFromValue = () => {
    return value ? value.from : ''
  }

  const getToValue = () => {
    return value ? value.to : ''
  }

  const onValidationError = (isInactive: boolean, validationError: ValidationError) => {
    if (validationError.field === configTo.id) {
      setToValidationError(isInactive ? null : validationError)
    } else {
      setFromValidationError(isInactive ? null : validationError)
    }
  }

  return (
    <div>
      <Label>
        {config.title} {config.description && <Icon src={questionImage} data-tip={config.description} alt={config.description} />}
      </Label>
      <DateRangeWrapper>
        <FilterWrapper highlighted={!!getFromValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={configFrom.title}
            setDate={onFromDateFilterChange}
            inputString={getFromValue()}
            textInputOnChange={onFromDateFilterChange}
            id={`${config.id}-${configFrom.id}`}
            forbidFutureDates={config.forbidFutureDates}
            onDispatchValidationError={onValidationError}
            componentField={configFrom.id}
            displayValidationErrorOutline={!!fromValidationError || !!validationError}
            max={configFrom.max}
            min={configFrom.min}
          />
          {!validationError && fromValidationError && (
            <ValidationErrorContainer className="iu-color-error">{fromValidationError.text}</ValidationErrorContainer>
          )}
        </FilterWrapper>
        <FilterWrapper highlighted={!!getToValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={configTo.title}
            setDate={onToDateFilterChange}
            inputString={getToValue()}
            textInputOnChange={onToDateFilterChange}
            id={`${config.id}-${configTo.id}`}
            forbidFutureDates={config.forbidFutureDates}
            onDispatchValidationError={onValidationError}
            componentField={configTo.id}
            displayValidationErrorOutline={!!toValidationError || !!validationError}
            max={configTo.max}
            min={configTo.min}
          />
          {!validationError && toValidationError && (
            <ValidationErrorContainer className="iu-color-error">{toValidationError.text}</ValidationErrorContainer>
          )}
        </FilterWrapper>
      </DateRangeWrapper>
      {validationError && (
        <GlobalValidationErrorContainer className="iu-color-error">{validationError.text}</GlobalValidationErrorContainer>
      )}
    </div>
  )
}

export default DateRangeFilter
