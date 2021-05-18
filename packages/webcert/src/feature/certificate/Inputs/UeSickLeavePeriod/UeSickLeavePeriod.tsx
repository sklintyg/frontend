import React, { useState, useRef } from 'react'
import DateRangePicker from './DateRangePicker'
import {
  CertificateDataElement,
  ConfigUeSickLeavePeriod,
  formatDateToString,
  getLatestPeriodEndDate,
  getValidDate,
  parseDayCodes,
  ValueDateRange,
} from '@frontend/common'
import { ConfigUeCheckboxDateRange } from '../../../../../../common/src/types/certificate'
import { ValueDateRangeList } from '../../../../../../common/src/types/certificate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import _ from 'lodash'
import { isValid, isWithinInterval } from 'date-fns'
import addDays from 'date-fns/addDays'
import { DaysRangeWrapper, TextInput } from './Styles'
import isBefore from 'date-fns/esm/fp/isBefore/index.js'
import { isSameDay } from 'date-fns/esm'

interface Props {
  question: CertificateDataElement
}

export const UeSickLeavePeriod: React.FC<Props> = ({ question }) => {
  const [hours, setHours] = useState<number | null>(null)
  const [valueList, setValueList] = useState<ValueDateRange[]>((question.value as ValueDateRangeList).list)
  const dispatch = useDispatch()

  const dispatchEditDraft = useRef(
    _.debounce((valueList: ValueDateRange[]) => {
      const updatedQuestion = getUpdatedValue(valueList)
      dispatch(updateCertificateDataElement(updatedQuestion))
    }, 1000)
  ).current

  const handleUpdatedValue = (valueId: string, fromDate: string | null, toDate: string | null) => {
    const updatedValueList = getUpdatedValueList(valueId, fromDate, toDate)
    setValueList(updatedValueList)
    dispatchEditDraft(updatedValueList)
  }

  const getUpdatedValueList = (valueId: string, fromDate: string | null, toDate: string | null) => {
    let updatedValueList = [...valueList]

    const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueId)

    if (updatedValueIndex === -1) {
      updatedValueList = [...updatedValueList, { from: fromDate, to: toDate, id: valueId } as ValueDateRange]
    } else {
      updatedValueList = updatedValueList.map((val) => {
        if (val.id === valueId) {
          return { ...val, from: fromDate, to: toDate, id: valueId } as ValueDateRange
        }
        return val
      })
    }

    return updatedValueList
  }

  function getUpdatedValue(valueList: ValueDateRange[]) {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDateRangeList) }

    updatedQuestionValue.list = valueList
    updatedQuestion.value = updatedQuestionValue

    return updatedQuestion
  }

  const handleGetPeriodStartingDate = (periodId: string) => {
    const nextPeriodStart = getLatestPeriodEndDate((question.config as ConfigUeSickLeavePeriod).list, valueList, periodId)

    if (isValid(nextPeriodStart)) {
      return formatDateToString(addDays(nextPeriodStart!, 1))
    }

    return formatDateToString(new Date())
  }

  function _hasOverlap(date: string | null, periodId: string) {
    // const period = valueList.find((val) => val.id === periodId)

    if (!date) return false
    const parsedDate = getValidDate(date)
    if (!parsedDate) return false

    for (let i = 0; i < valueList.length; i++) {
      if (valueList[i].id == periodId) break

      const comparedDateStart = getValidDate(valueList[i].from)
      const comparedDateEnd = getValidDate(valueList[i].to)

      if (!comparedDateStart || !comparedDateEnd) break

      if (_dateRangeOverlaps(parsedDate, comparedDateStart, comparedDateEnd)) {
        return true
      }
      // if (
      //   _dateRangeOverlaps(getValidDate(fromDate)!, getValidDate(toDate)!, getValidDate(valueList[i].from)!, getValidDate(valueList[i].to)!)
      // ) {
      //   return true
      // }
    }
    return false

    // var i, j;
    // for (i = 0; i < periods.length; i++) {
    //     for (j = i + 1; j < periods.length; j++) {
    //         if (_dateRangeOverlaps(getValidDate(periods[i].from)!, getValidDate(periods[i].to)!, getValidDate(periods[j].from)!, getValidDate(periods[j].to)!)) {
    //             return true;
    //         }
    //     }
    // }
  }

  function _dateRangeOverlaps(date: Date, comparedDateStart: Date, comparedDateEnd: Date) {
    // if (_isBeforeOrEqual(date, comparedDateStart) && _isBeforeOrEqual(date, comparedDateEnd)) {
    //   // b starts in a
    //   return true
    // }
    // if (_isBeforeOrEqual(aStart, bEnd) && _isBeforeOrEqual(bEnd, aEnd)) {
    //   // b ends in a
    //   return true
    // }
    // if (isBefore(bStart, aStart) && isBefore(aEnd, bEnd)) {
    //   // a in b
    //   return true
    // }
    if (
      isWithinInterval(date, { start: comparedDateStart, end: comparedDateEnd }) ||
      isSameDay(date, comparedDateStart) ||
      isSameDay(date, comparedDateEnd)
    ) {
      return true
    }

    return false
  }

  // function _dateRangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  //   if (_isBeforeOrEqual(aStart, bStart) && _isBeforeOrEqual(bStart, aEnd)) {
  //     // b starts in a
  //     return true
  //   }
  //   if (_isBeforeOrEqual(aStart, bEnd) && _isBeforeOrEqual(bEnd, aEnd)) {
  //     // b ends in a
  //     return true
  //   }
  //   if (isBefore(bStart, aStart) && isBefore(aEnd, bEnd)) {
  //     // a in b
  //     return true
  //   }
  //   return false
  // }

  function _isBeforeOrEqual(moment1: Date, moment2: Date) {
    return isBefore(moment1, moment2) || isSameDay(moment1, moment2)
  }

  if (!question) return null

  return (
    <div>
      <div>
        <DaysRangeWrapper>
          <FontAwesomeIcon icon={faLightbulb} className="iu-color-main" size="lg" />
          <p>Patienten arbetar i snitt</p>
          <TextInput className="ic-textfield" type="text" value={hours?.toString()} maxLength={2} />
          <p>timmar/vecka</p>
        </DaysRangeWrapper>
      </div>
      <div>
        {(question.config as ConfigUeSickLeavePeriod).list.map((period: ConfigUeCheckboxDateRange, i) => {
          return (
            <DateRangePicker
              getHasOverlap={_hasOverlap}
              getPeriodStartingDate={handleGetPeriodStartingDate}
              updateValue={handleUpdatedValue}
              key={period.id}
              fromDate={valueList.find((x) => x.id === period.id)?.from ?? null}
              toDate={valueList.find((x) => x.id === period.id)?.to ?? null}
              label={period.label}
              periodId={period.id}
            />
          )
        })}
      </div>
    </div>
  )
}
