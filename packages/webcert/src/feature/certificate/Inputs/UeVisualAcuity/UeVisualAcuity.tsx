import { CertificateDataElement, ConfigEyeAcuity, ConfigUeVisualAcuity, ValueEyeAcuity, ValueVisualAcuity } from '@frontend/common'

import React, { useState } from 'react'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
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

  const onRightChanged = (rightEye: ValueEyeAcuity) => {
    console.log(rightEye)
    const newValue = { ...currentValue, rightEye }
    setCurrentValue(newValue)
    console.log(newValue)
    dispatch(updateCertificateDataElement({ ...question, value: newValue }))
  }
  const onLeftChanged = (leftEye: ValueEyeAcuity) => {
    const newValue = { ...currentValue, leftEye }
    setCurrentValue(newValue)
    dispatch(updateCertificateDataElement({ ...question, value: newValue }))
  }
  const onBinocularChanged = (binocular: ValueEyeAcuity) => {
    const newValue = { ...currentValue, binocular }
    setCurrentValue(newValue)
    dispatch(updateCertificateDataElement({ ...question, value: newValue }))
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
        onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={leftConfig}
        value={currentValue.leftEye as ValueEyeAcuity}
        disabled={disabled}
        onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={binocularConfig}
        value={currentValue.binocular as ValueEyeAcuity}
        disabled={disabled}
        onChange={onBinocularChanged}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
