import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CertificateDataElement,
  ConfigUeIcf,
  QuestionValidationTexts,
  TextArea,
  ValueIcf,
  CertificateDataValidationType,
  TextValidation,
} from '@frontend/common'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import _ from 'lodash'
import IcfDropdown from '../../../../components/icf/IcfDropdown'
import { getIcfData } from '../../../../store/icf/icfSelectors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeIcf: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const icfData = useSelector(getIcfData((question.value as ValueIcf).id), _.isEqual)
  const questionConfig = question.config as ConfigUeIcf
  const [currentValue, setCurrentValue] = useState<ValueIcf>(question.value as ValueIcf)
  const textValidation = question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const updateValue = (value: ValueIcf) => {
    setCurrentValue(value)
    dispatch(updateCertificateDataElement({ ...question, value }))
  }

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    updateValue({ ...currentValue, text: event.currentTarget.value })
  }

  const handleAddIcfCodeValue = (icfCodeToAdd: string) => {
    updateValue({ ...currentValue, icfCodes: (currentValue.icfCodes ?? []).concat(icfCodeToAdd) })
  }

  const handleRemoveIcfCodeValue = (icfCodeToRemove: string) => {
    updateValue({ ...currentValue, icfCodes: (currentValue.icfCodes ?? []).filter((code) => code !== icfCodeToRemove) })
  }

  return (
    <>
      {!disabled && (
        <IcfDropdown
          id={question.id}
          disabled={disabled}
          chosenIcfCodeValues={currentValue.icfCodes}
          modalLabel={questionConfig.modalLabel}
          collectionsLabel={questionConfig.collectionsLabel}
          icfData={icfData}
          onAddCode={handleAddIcfCodeValue}
          onRemoveCode={handleRemoveIcfCodeValue}
        />
      )}
      <TextArea
        disabled={disabled}
        rowsMin={6}
        hasValidationError={validationErrors.length > 0}
        onChange={handleTextChange}
        name={questionConfig.id}
        value={currentValue.text ?? ''}
        limit={textValidation ? textValidation.limit : 3500}
        placeholder={(currentValue.icfCodes?.length ?? 0) > 0 ? questionConfig.placeholder : ''}
      />
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeIcf
