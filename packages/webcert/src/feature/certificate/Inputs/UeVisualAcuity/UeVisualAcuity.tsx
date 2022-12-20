import { CertificateDataElement, ConfigEyeAcuity, ConfigUeVisualAcuity, ValueEyeAcuity, ValueVisualAcuity } from '@frontend/common'

import React from 'react'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import UeEyeAcuity from './UeEyeAcuity'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const UeVisualAcuity: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()

  const questionValue = question.value as ValueVisualAcuity

  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity

  const onRightChanged = (rightEye: ValueEyeAcuity) => {
    console.log(rightEye)
    const newValue = { ...question, value: { ...questionValue, rightEye } }
    console.log(newValue)
    dispatch(updateCertificateDataElement(newValue))
  }
  const onLeftChanged = (leftEye: ValueEyeAcuity) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, leftEye } }))
  }
  const onBinocularChanged = (binocular: ValueEyeAcuity) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, binocular } }))
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-span-3"></div>
      <div className="iu-grid-span-3">{questionConfig.withoutCorrectionLabel}</div>
      <div className="iu-grid-span-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-span-3">{questionConfig.contactLensesLabel}</div>
      <UeEyeAcuity
        config={rightConfig}
        value={questionValue.rightEye as ValueEyeAcuity}
        disabled={disabled}
        onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={leftConfig}
        value={questionValue.leftEye as ValueEyeAcuity}
        disabled={disabled}
        onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity
        config={binocularConfig}
        value={questionValue.binocular as ValueEyeAcuity}
        disabled={disabled}
        onChange={onBinocularChanged}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
