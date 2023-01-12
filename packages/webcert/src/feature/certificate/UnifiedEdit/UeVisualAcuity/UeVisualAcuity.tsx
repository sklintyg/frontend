import {
  CertificateDataElement,
  ConfigEyeAcuity,
  ConfigUeVisualAcuity,
  MandatoryIcon,
  ValueEyeAcuity,
  ValueVisualAcuity,
} from '@frontend/common'
import React, { useState, useCallback } from 'react'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import UeEyeAcuity from './UeEyeAcuity'
import { useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeVisualAcuity: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const [currentValue, setCurrentValue] = useState<ValueVisualAcuity>(question.value as ValueVisualAcuity)
  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity

  const displayMandatory = (!question?.readOnly && question?.mandatory && !question.disabled) ?? false

  const dispatchEditDraft = useCallback(
    (value) => {
      dispatch(updateCertificateDataElement({ ...question, value }))
    },
    [dispatch, question]
  )

  const onRightChanged = (rightEye: ValueEyeAcuity) => {
    const newValue = { ...currentValue, rightEye }
    setCurrentValue(newValue)
    dispatchEditDraft(newValue)
  }
  const onLeftChanged = (leftEye: ValueEyeAcuity) => {
    const newValue = { ...currentValue, leftEye }
    setCurrentValue(newValue)
    dispatchEditDraft(newValue)
  }
  const onBinocularChanged = (binocular: ValueEyeAcuity) => {
    const newValue = { ...currentValue, binocular }
    setCurrentValue(newValue)
    dispatchEditDraft(newValue)
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-span-3"></div>
      <div className="iu-grid-span-3">
        {displayMandatory && <MandatoryIcon />}
        {questionConfig.withoutCorrectionLabel}
      </div>
      <div className="iu-grid-span-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-span-3">{questionConfig.contactLensesLabel}</div>
      <UeEyeAcuity
        questionId={question.id}
        config={rightConfig}
        value={currentValue.rightEye as ValueEyeAcuity}
        validationErrors={validationErrors.filter(({ field }) =>
          [rightConfig.contactLensesId, rightConfig.withCorrectionId, rightConfig.withoutCorrectionId].includes(field)
        )}
        disabled={disabled}
        onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity
        questionId={question.id}
        config={leftConfig}
        value={currentValue.leftEye as ValueEyeAcuity}
        validationErrors={validationErrors.filter(({ field }) =>
          [leftConfig.contactLensesId, leftConfig.withCorrectionId, leftConfig.withoutCorrectionId].includes(field)
        )}
        disabled={disabled}
        onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity
        questionId={question.id}
        config={binocularConfig}
        value={currentValue.binocular as ValueEyeAcuity}
        validationErrors={validationErrors.filter(({ field }) =>
          [binocularConfig.contactLensesId, binocularConfig.withCorrectionId, binocularConfig.withoutCorrectionId].includes(field)
        )}
        disabled={disabled}
        onChange={onBinocularChanged}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
