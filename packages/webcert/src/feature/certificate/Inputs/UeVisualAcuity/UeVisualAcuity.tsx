import {
  CertificateDataElement,
  ConfigEyeAcuity,
  ConfigUeVisualAcuity,
  TextInput,
  ValueEyeAcuity,
  ValueVisualAcuity,
} from '@frontend/common'

import React, { useState } from 'react'
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
  const [rightValue, setRightValue] = useState(questionValue.rightEye as ValueEyeAcuity)
  const [leftValue, setLeftValue] = useState(questionValue.leftEye as ValueEyeAcuity)
  const [binocularValue, setBinocularValue] = useState(questionValue.binocularEye as ValueEyeAcuity)

  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const onRightChanged = (rightValue: ValueEyeAcuity) => {
    setRightValue(rightValue)
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, rightValue } }))
  }
  const onLeftChanged = (leftValue: ValueEyeAcuity) => {
    setLeftValue(leftValue)
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, leftValue } }))
  }
  const onBinocularChanged = (binocularValue: ValueEyeAcuity) => {
    setBinocularValue(binocularValue)
    dispatch(updateCertificateDataElement({ ...question, value: { ...questionValue, binocularValue } }))
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-cols-3"></div>
      <div className="iu-grid-cols-3">{questionConfig.withoutCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.contactLensesLabel}</div>
      <UeEyeAcuity config={rightConfig} value={rightValue} disabled={disabled} onChange={onRightChanged}></UeEyeAcuity>
      <UeEyeAcuity config={leftConfig} value={leftValue} disabled={disabled} onChange={onLeftChanged}></UeEyeAcuity>
      <UeEyeAcuity config={binocularConfig} value={binocularValue} disabled={disabled} onChange={onBinocularChanged}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
