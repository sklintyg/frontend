import { CertificateDataElement, ConfigEyeAcuity, ConfigUeVisualAcuity, ValueEyeAcuity, ValueVisualAcuity } from '@frontend/common'

import _ from 'lodash'
import React, { useRef, useState } from 'react'
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

  //const questionValue = question.value as ValueVisualAcuity
  const [currentValue, setCurrentValue] = useState<ValueVisualAcuity>(question.value as ValueVisualAcuity)
  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity

  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const rightValidationErrors = validationErrors.filter(
    (v) =>
      v.field === rightConfig.withoutCorrectionId || v.field === rightConfig.withCorrectionId || v.field === rightConfig.contactLensesId
  )
  const leftValidationErrors = validationErrors.filter(
    (v) => v.field === leftConfig.withoutCorrectionId || v.field === leftConfig.withCorrectionId || v.field === leftConfig.contactLensesId
  )
  const binocularValidationErrors = validationErrors.filter(
    (v) => v.field === binocularConfig.withoutCorrectionId || v.field === binocularConfig.withCorrectionId
  )

  const dispatchEditDraft = useRef(
    _.debounce((question: CertificateDataElement, value: ValueVisualAcuity) => {
      const newQuestionValue = { ...question, value }
      dispatch(updateCertificateDataElement(newQuestionValue))
    }, 500)
  ).current

  const onRightChanged = (rightEye: ValueEyeAcuity) => {
    const newValue = { ...currentValue, rightEye }
    setCurrentValue(newValue)
    dispatchEditDraft(question, newValue)
  }
  const onLeftChanged = (leftEye: ValueEyeAcuity) => {
    const newValue = { ...currentValue, leftEye }
    setCurrentValue(newValue)
    dispatchEditDraft(question, newValue)
  }
  const onBinocularChanged = (binocular: ValueEyeAcuity) => {
    const newValue = { ...currentValue, binocular }
    setCurrentValue(newValue)
    dispatchEditDraft(question, newValue)
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-span-3"></div>
      <div className="iu-grid-span-3">{questionConfig.withoutCorrectionLabel}</div>
      <div className="iu-grid-span-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-span-3">{questionConfig.contactLensesLabel}</div>
      <UeEyeAcuity
        config={rightConfig}
        value={currentValue.rightEye as ValueEyeAcuity}
        disabled={disabled}
        isShowValidationError={rightValidationErrors.length > 0}
        validationErrors={rightValidationErrors}
        onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={leftConfig}
        value={currentValue.leftEye as ValueEyeAcuity}
        disabled={disabled}
        isShowValidationError={leftValidationErrors.length > 0}
        validationErrors={leftValidationErrors}
        onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={binocularConfig}
        value={currentValue.binocular as ValueEyeAcuity}
        disabled={disabled}
        isShowValidationError={binocularValidationErrors.length > 0}
        validationErrors={binocularValidationErrors}
        onChange={onBinocularChanged}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
