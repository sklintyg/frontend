import {
  CertificateDataElement,
  ConfigEyeAcuity,
  ConfigUeVisualAcuity,
  TextInput,
  ValueEyeAcuity,
  ValueVisualAcuity,
} from '@frontend/common'

import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getShowValidationErrors, getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeEyeAcuity from './UeEyeAcuity'

export interface Props {
  disabled?: boolean
  question: CertificateDataElement
}

const AcuityInput = styled(TextInput)`
  width: 40px;
  padding: 4px 4px;
  height: 35px;
  text-align: center;
`

const UeVisualAcuity: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()

  const questionValue = question.value as ValueVisualAcuity

  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const onRightChanged = (rightValue: ValueEyeAcuity) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, rightValue } }))
  }
  const onLeftChanged = (leftValue: ValueEyeAcuity) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, leftValue } }))
  }
  const onBinocularChanged = (binocularValue: ValueEyeAcuity) => {
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, binocularValue } }))
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
