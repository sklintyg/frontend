import {
  CertificateDataElement,
  ConfigUeCheckboxMultipleDate,
  QuestionValidationTexts,
  ValueDate,
  ValueDateList,
  CertificateDataValueType,
  getMaxDate,
} from '@frontend/common'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { UeCheckboxDateItem } from './UeCheckboxDateItem'

export interface Props {
  disabled: boolean
  question: CertificateDataElement
}

const UeCheckboxDateGroup: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const checkboxes = (question.config as ConfigUeCheckboxMultipleDate).list
  const [value, setValue] = useState<ValueDateList>(question.value as ValueDateList)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const otherValidationErrors = validationErrors.filter(({ field }) => !checkboxes.map(({ id }) => id).includes(field))

  return (
    <>
      <div className="checkbox-child">
        {checkboxes.map(({ id, label }, index) => (
          <UeCheckboxDateItem
            key={index}
            id={`${question.id}_${id}`}
            label={label}
            value={value.list.find((date: ValueDate) => date.id === id) || { type: CertificateDataValueType.DATE, date: undefined, id }}
            onChange={(newValue) => {
              const list = value.list.filter((item) => item.id !== id).concat(newValue.date ? newValue : [])
              setValue({ ...value, list })
              dispatch(
                updateCertificateDataElement({
                  ...question,
                  value: {
                    ...value,
                    list,
                  },
                })
              )
            }}
            disabled={disabled}
            maxDate={getMaxDate(question.validation, id)}
            validationErrors={validationErrors.filter(({ field }) => field === id)}
            hasValidationError={otherValidationErrors.length > 0}
          />
        ))}
      </div>
      <QuestionValidationTexts validationErrors={otherValidationErrors} />
    </>
  )
}

export default UeCheckboxDateGroup
