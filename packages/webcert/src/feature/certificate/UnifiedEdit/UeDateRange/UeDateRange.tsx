import {
  CertificateDataElement,
  ConfigUeDateRange,
  DatePickerCustom,
  dayCodeReg,
  formatDateToString,
  getValidDate,
  isDateRangeValid,
  isValidDateIncludingSpecialDateCodes,
  monthCodeReg,
  parseDayCodes,
  QuestionValidationTexts,
  ValidationError,
  ValueDateRange,
  weekCodeReg,
  _dateReg,
  _dateRegDashesOptional,
} from '@frontend/common'
import { addDays, isBefore, isValid } from 'date-fns'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import usePrevious from '../../../../hooks/usePrevious'
import { updateCertificateDataElement, updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { DateGrid, DatesWrapper } from './Styles'

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'
const NOT_COMPLETE_DATE_ERROR_MESSAGE = 'Ange ett datum.'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeDateRange: React.FC<Props> = ({ question, disabled }) => {
  const config = question.config as ConfigUeDateRange
  const value = question.value as ValueDateRange
  const [fromDateInput, setFromDateInput] = useState<string | null>(value.from ?? null)
  const [toDateInput, setToDateInput] = useState<string | null>(value.to ?? null)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)

  const previousFromDateString = usePrevious(fromDateInput)
  const previousToDateString = usePrevious(toDateInput)
  const dispatch = useDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  useEffect(() => {
    const shouldClearPreviousPeriod = (): boolean => isDateRangeValid(previousFromDateString ?? '', previousToDateString ?? '')

    if (previousFromDateString !== fromDateInput || previousToDateString !== toDateInput) {
      if (isDateRangeValid(fromDateInput ?? '', toDateInput ?? '')) {
        dispatch(
          updateCertificateDataElement({
            ...question,
            value: { ...value, from: fromDateInput, to: toDateInput },
          })
        )
      } else if (shouldClearPreviousPeriod()) {
        dispatch(
          updateCertificateDataElement({
            ...question,
            value: { ...value, from: undefined, to: undefined },
          })
        )
      }
    }
  }, [toDateInput, fromDateInput, previousFromDateString, previousToDateString, config.id, dispatch, question, value])

  const handleFromTextInputChange = (value: string) => {
    setFromDateInput(value ?? null)
  }

  const handleDatePickerSelectFrom = (date: string) => {
    setFromDateInput(date)
    toggleShowValidationError(date, toDateInput)
    tomTextInputRef.current?.focus()
  }

  const handleDatePickerSelectTo = (date: string) => {
    setToDateInput(date)
    toggleShowValidationError(fromDateInput, date)
  }

  const handleToTextInputChange = (value: string) => {
    setToDateInput(value)
  }

  const handleFromTextInputOnBlur = () => {
    toggleShowValidationError(fromDateInput, toDateInput)
  }

  const handleToTextInputOnBlur = () => {
    formatToInputTextField()
    const parsedToDate = getParsedToDateString(fromDateInput, toDateInput)
    toggleShowValidationError(fromDateInput, parsedToDate ?? toDateInput)
  }

  const handleFromTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      fromTextInputRef.current?.blur()
      tomTextInputRef.current?.focus()
    }
  }

  const handleToTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      tomTextInputRef.current?.blur()
    }
  }

  function isDateFormatValid(toDate: string | null, fromDate: string | null) {
    return (toDate && isValidDateIncludingSpecialDateCodes(toDate)) || (fromDate && isValid(getValidDate(fromDate)))
  }

  const toggleShowValidationError = (fromDate: string | null, toDate: string | null) => {
    const validFromDate = getValidDate(fromDate ?? '')
    const validToDate = getValidDate(toDate ?? '')
    const invalidDatePeriod = !!validFromDate && !!validToDate && isBefore(validToDate, validFromDate)
    const notCompleteDatePeriod = ((fromDate && !toDate) || (toDate && !fromDate)) && isDateFormatValid(toDate, fromDate)

    dispatchValidationError(!invalidDatePeriod, {
      category: '',
      field: 'row.' + config.id,
      id: question.id,
      text: INVALID_DATE_PERIOD_ERROR,
      type: 'INVALID_DATE_PERIOD',
      showAlways: true,
    })

    let notCompleteDateField = ''
    if (!notCompleteDatePeriod) {
      notCompleteDateField = config.id
    } else {
      notCompleteDateField = !toDateInput ? 'tom.' + config.id : 'from.' + config.id
    }
    dispatchValidationError(!notCompleteDatePeriod, {
      category: '',
      field: notCompleteDateField,
      id: question.id,
      text: NOT_COMPLETE_DATE_ERROR_MESSAGE,
      type: 'NOT_COMPLETE_DATE',
    })
  }

  const getParsedToDateString = (fromDateString: string | null, toDateString: string | null) => {
    if (!toDateString || !fromDateString || !getValidDate(fromDateString)) {
      return
    }
    const fromDate = getValidDate(fromDateString)

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateString))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateString)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        return formatDateToString(newDate)
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate && isValid(newDate)) {
        return formatDateToString(newDate)
      }
    } else return null
  }

  const formatToInputTextField = () => {
    if (!toDateInput || !fromDateInput || !getValidDate(fromDateInput)) {
      return
    }

    const fromDate = getValidDate(fromDateInput)

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateInput))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateInput)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateInput(formatDateToString(newDate))
      }
    } else if (_dateReg.test(toDateInput) || _dateRegDashesOptional.test(toDateInput)) {
      const newDate = getValidDate(toDateInput)

      if (newDate && isValid(newDate)) {
        setToDateInput(formatDateToString(newDate))
      }
    }
  }

  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    if (validationErrors.length > 0) {
      return true
    }
    if (id) {
      return validationErrors.filter((v: ValidationError) => v.field.includes(field + '.' + id) || v.field.includes('row.' + id)).length > 0
    }
    return validationErrors.length > 0
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved: shouldBeRemoved, validationError: validationError }))
    },
    [dispatch]
  )

  return (
    <>
      <DateGrid>
        <DatesWrapper id="fromWrapper">
          <DatePickerCustom
            disabled={disabled}
            label={config.fromLabel}
            id={`from${config.id}`}
            textInputRef={fromTextInputRef}
            textInputOnBlur={handleFromTextInputOnBlur}
            textInputOnKeyDown={handleFromTextInputOnKeyDown}
            textInputName={`from${config.id}`}
            inputString={fromDateInput}
            setDate={handleDatePickerSelectFrom}
            textInputOnChange={handleFromTextInputChange}
            textInputDataTestId={`from${config.id}`}
            displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'from')}
            componentField={'from.' + config.id}
            questionId={question.id}
            onDispatchValidationError={dispatchValidationError}
          />
        </DatesWrapper>
        <DatesWrapper>
          <DatePickerCustom
            disabled={disabled}
            label={config.toLabel}
            id={`tom${config.id}`}
            textInputName={`tom${config.id}`}
            textInputRef={tomTextInputRef}
            inputString={toDateInput}
            setDate={handleDatePickerSelectTo}
            textInputOnChange={handleToTextInputChange}
            textInputOnBlur={handleToTextInputOnBlur}
            textInputOnKeyDown={handleToTextInputOnKeyDown}
            textInputDataTestId={`tom${config.id}`}
            displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'tom')}
            componentField={'tom.' + config.id}
            questionId={question.id}
            onDispatchValidationError={dispatchValidationError}
          />
        </DatesWrapper>
      </DateGrid>

      <div className={'iu-pb-300'}>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </div>
    </>
  )
}

export default UeDateRange
