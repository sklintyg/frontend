import {
  DatePickerCustom,
  getDateValidationError,
  isDateBehindLimit,
  isDateRangeValidOrIncomplete,
  isFutureDate,
  ListFilterDateConfig,
  ListFilterDateRangeConfig,
  ListFilterValue,
  ListFilterValueDateRange,
  questionImage,
  ValidationError,
} from '@frontend/common'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'
import { updateValidationError } from '../../../store/list/listActions'
import { getActiveListFilterValue } from '../../../store/list/listSelectors'
import { FilterWrapper } from './filterStyles'

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
  const filterValue = useSelector(getActiveListFilterValue(config.id)) as ListFilterValueDateRange
  const [savedValue, setSavedValue] = useState<ListFilterValueDateRange>(filterValue)
  const [toValidationError, setToValidationError] = useState<ValidationError | null>(null)
  const [fromValidationError, setFromValidationError] = useState<ValidationError | null>(null)
  const [globalValidationError, setGlobalValidationError] = useState<ValidationError | null>(null)

  const shouldShowDateTooFarBackError = (value: string, limit: string | undefined) => {
    return limit && isDateBehindLimit(value, limit.split('T')[0])
  }

  const toggleValidationError = useCallback(
    (to: string, from: string): boolean => {
      if (from && to && !isDateRangeValidOrIncomplete(from, to)) {
        setGlobalValidationError({
          category: '',
          field: '',
          id: '',
          text: INVALID_DATE_PERIOD_ERROR,
          type: 'INVALID_DATE_PERIOD',
          showAlways: true,
        })
        dispatch(updateValidationError({ id: config.id, value: true }))
        return true
      } else {
        setGlobalValidationError(null)
        dispatch(updateValidationError({ id: config.id, value: false }))
        return false
      }
    },
    [config.id, dispatch]
  )

  const toggleSpecificValidationError = useCallback(
    (
      value: string,
      config: ListFilterDateConfig,
      saveValidationError: (value: React.SetStateAction<ValidationError | null>) => void
    ): boolean => {
      const dateValidationError = getDateValidationError(config.id, config.id, value)
      if (dateValidationError) {
        saveValidationError(dateValidationError)
        dispatch(updateValidationError({ id: config.id, value: true }))
        return true
      } else if (isFutureDate(value)) {
        saveValidationError({
          category: '',
          field: '',
          id: '',
          text: FUTURE_DATES_ERROR,
          type: 'FUTURE_DATES_ERROR',
          showAlways: true,
        })
        dispatch(updateValidationError({ id: config.id, value: true }))
        return true
      } else if (shouldShowDateTooFarBackError(value, config.min)) {
        saveValidationError({
          category: '',
          field: '',
          id: '',
          text: DATE_BEFORE_MIN,
          type: 'DATE_BEFORE_MIN',
          showAlways: true,
        })
        dispatch(updateValidationError({ id: config.id, value: true }))
        return true
      }
      saveValidationError(null)
      dispatch(updateValidationError({ id: config.id, value: false }))
      return false
    },
    [dispatch]
  )

  useEffect(() => {
    setSavedValue(filterValue)
  }, [filterValue])

  useDeepCompareEffect(() => {
    if (savedValue) {
      toggleValidationError(savedValue.to, savedValue.from)
      toggleSpecificValidationError(savedValue.to, config.to, setToValidationError)
      toggleSpecificValidationError(savedValue.from, config.from, setFromValidationError)
    }
  }, [config.from, config.to, fromValidationError, savedValue, toValidationError, toggleSpecificValidationError, toggleValidationError])

  useEffect(() => {
    dispatch(updateValidationError({ id: config.id, value: !!globalValidationError || !!toValidationError || !!fromValidationError }))
  }, [dispatch, globalValidationError, toValidationError, fromValidationError, config.id])

  const onFromDateFilterChange = (date: string, isValueValid?: boolean) => {
    const hasGlobalValidationError = toggleValidationError(savedValue.to, date)
    const hasSpecificValidationError = toggleSpecificValidationError(date, config.from, setFromValidationError)
    const updatedValue: ListFilterValueDateRange = { ...savedValue, from: date }
    if (isValueValid !== false || date === '') {
      if (!hasGlobalValidationError && !hasSpecificValidationError) {
        onChange(updatedValue, config.id)
      }
    }
    setSavedValue(updatedValue)
  }

  const onToDateFilterChange = (date: string, isValueValid?: boolean) => {
    const hasGlobalValidationError = toggleValidationError(date, savedValue.from)
    const hasSpecificValidationError = toggleSpecificValidationError(date, config.to, setToValidationError)
    const updatedValue: ListFilterValueDateRange = { ...savedValue, to: date }
    if (isValueValid !== false || date === '') {
      if (!hasGlobalValidationError && !hasSpecificValidationError) {
        onChange(updatedValue, config.id)
      }
    }
    setSavedValue(updatedValue)
  }

  const getFromValue = () => {
    return savedValue ? savedValue.from : ''
  }

  const getToValue = () => {
    return savedValue ? savedValue.to : ''
  }

  return (
    <div>
      <Label>
        {config.title} {config.description && <Icon src={questionImage} data-tip={config.description} alt={config.description} />}
      </Label>
      <DateRangeWrapper>
        <FilterWrapper highlighted={!!getFromValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={config.from.title}
            setDate={onFromDateFilterChange}
            inputString={getFromValue()}
            textInputOnChange={onFromDateFilterChange}
            id={`${config.id}-${config.from.id}`}
            forbidFutureDates={config.forbidFutureDates}
            displayValidationErrorOutline={!!fromValidationError || !!globalValidationError}
            max={config.from.max}
            min={config.from.min}
          />
          {!globalValidationError && fromValidationError && (
            <ValidationErrorContainer className="iu-color-error">{fromValidationError.text}</ValidationErrorContainer>
          )}
        </FilterWrapper>
        <FilterWrapper highlighted={!!getToValue() || config.alwaysHighlighted}>
          <DatePickerCustom
            label={config.to.title}
            setDate={onToDateFilterChange}
            inputString={getToValue()}
            textInputOnChange={onToDateFilterChange}
            id={`${config.id}-${config.to.id}`}
            forbidFutureDates={config.forbidFutureDates}
            displayValidationErrorOutline={!!toValidationError || !!globalValidationError}
            max={config.to.max}
            min={config.to.min}
          />
          {!globalValidationError && toValidationError && (
            <ValidationErrorContainer className="iu-color-error">{toValidationError.text}</ValidationErrorContainer>
          )}
        </FilterWrapper>
      </DateRangeWrapper>
      {globalValidationError && (
        <GlobalValidationErrorContainer className="iu-color-error">{globalValidationError.text}</GlobalValidationErrorContainer>
      )}
    </div>
  )
}

export default DateRangeFilter
