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
  const rightValue = questionValue.rightEye as ValueEyeAcuity
  const leftValue = questionValue.leftEye as ValueEyeAcuity
  const binocularValue = questionValue.binocularEye as ValueEyeAcuity

  const questionConfig = question.config as ConfigUeVisualAcuity
  const rightConfig = questionConfig.rightEye as ConfigEyeAcuity
  const leftConfig = questionConfig.leftEye as ConfigEyeAcuity
  const binocularConfig = questionConfig.binocular as ConfigEyeAcuity
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const parseAcuity = (value: string) => {
    value = value.replace(/\./gm, ',').replace(/[^0-9,]/g, '')
    return value
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-cols-3"></div>
      <div className="iu-grid-cols-3">{questionConfig.withoutCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.contactLensesLabel}</div>
      <UeEyeAcuity config={rightConfig} value={rightValue} disabled={disabled}></UeEyeAcuity>
      <UeEyeAcuity config={leftConfig} value={leftValue} disabled={disabled}></UeEyeAcuity>
      <UeEyeAcuity config={binocularConfig} value={binocularValue} disabled={disabled}></UeEyeAcuity>
    </div>
  )
}

export default UeVisualAcuity
