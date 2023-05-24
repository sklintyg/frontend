import { CertificateDataElement, ConfigUeVisualAcuity, MandatoryIcon, ValueEyeAcuity, ValueType, ValueVisualAcuity } from '@frontend/common'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeEyeAcuity from './UeEyeAcuity'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeVisualAcuity: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const [currentValue, setCurrentValue] = useState<ValueVisualAcuity>(question.value as ValueVisualAcuity)
  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye
  const leftConfig = questionConfig.leftEye
  const binocularConfig = questionConfig.binocular

  const displayMandatory = (!question?.readOnly && question?.mandatory && !question.disabled) ?? false

  const dispatchEditDraft = useCallback(
    (value: ValueType) => {
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
        config={rightConfig}
        value={currentValue.rightEye as ValueEyeAcuity}
        validationErrors={validationErrors.filter(({ field }) =>
          [rightConfig.contactLensesId, rightConfig.withCorrectionId, rightConfig.withoutCorrectionId].includes(field)
        )}
        disabled={disabled}
        onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={leftConfig}
        value={currentValue.leftEye as ValueEyeAcuity}
        validationErrors={validationErrors.filter(({ field }) =>
          [leftConfig.contactLensesId, leftConfig.withCorrectionId, leftConfig.withoutCorrectionId].includes(field)
        )}
        disabled={disabled}
        onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity
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
