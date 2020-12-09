import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import DateRangePicker from './DateRangePicker'
import { CertificateDataElement, ConfigUeSickLeavePeriod } from '@frontend/common'
import { ConfigUeCheckboxDateRange } from '../../../../../common/src/types/certificate'
import { getDateRangeQuestion } from '../../../store/certificate/certificateSelectors'
import { ValueDateRangeList } from './../../../../../common/src/types/certificate'

interface Props {}

export const MultipleDateRanges: React.FC<Props> = (props) => {
  const dateQuestion = useSelector(getDateRangeQuestion)

  if (!dateQuestion) return null

  const dateConfigs = dateQuestion.config as ConfigUeSickLeavePeriod
  const questionValueList = (dateQuestion.value as ValueDateRangeList).list

  return (
    <div>
      {dateConfigs.list.map((period: ConfigUeCheckboxDateRange) => {
        return (
          <DateRangePicker
            fromDate={questionValueList.find((x) => x.id === period.id)?.from ?? null}
            toDate={questionValueList.find((x) => x.id === period.id)?.to ?? null}
            label={period.label}
            question={dateQuestion}
            questionId={period.id}
          />
        )
      })}
    </div>
  )
}
