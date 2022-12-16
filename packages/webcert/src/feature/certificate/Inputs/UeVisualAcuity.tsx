import {
  CertificateDataElement,
  Checkbox,
  ConfigEyeAcuity,
  ConfigUeVisualAcuity,
  TextInput,
  ValueEyeAcuity,
  ValueVisualAcuity,
} from '@frontend/common'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getShowValidationErrors, getVisibleValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../store/store'

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

  const [rightNoCorrection, setRightNoCorrection] = useState(rightValue.withoutCorrection.value?.toString() ?? '')
  const [rightCorrection, setRightCorrection] = useState(rightValue.withCorrection.value?.toString() ?? '')
  const [rightContacts, setRightContacts] = useState(rightValue.contactLenses?.selected === true)
  const [leftNoCorrection, setLeftNoCorrection] = useState(leftValue.withoutCorrection.value?.toString() ?? '')
  const [leftCorrection, setLeftCorrection] = useState(leftValue.withCorrection.value?.toString() ?? '')
  const [leftContacts, setLeftContacts] = useState(leftValue.contactLenses?.selected === true)
  const [binocularNoCorrection, setBinocularNoCorrection] = useState(binocularValue.withoutCorrection.value?.toString() ?? '')
  const [binocularCorrection, setBinocularCorrection] = useState(binocularValue.withCorrection.value?.toString() ?? '')

  const parseAcuity = (value: string) => {
    value = value.replace(/\./gm, ',')
  }
  const onRightNoCorrectionChange = (value: string) => {}

  const onChange = () => {
    dispatch(
      updateCertificateDataElement({
        ...question,
        value: {
          ...questionValue,
        },
      })
    )
  }

  return (
    <div className="iu-grid-cols iu-grid-cols-12">
      <div className="iu-grid-cols-3"></div>
      <div className="iu-grid-cols-3">{questionConfig.withoutCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.withCorrectionLabel}</div>
      <div className="iu-grid-cols-3">{questionConfig.contactLensesLabel}</div>

      <div className="iu-grid-cols-3">{rightConfig.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={rightConfig.withoutCorrectionId} value={rightCorrection} limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={rightConfig.withCorrectionId} value={rightNoCorrection} limit={3} onChange={onChange}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <Checkbox id={rightConfig.contactLensesId} onChange={onChange} checked={rightContacts}></Checkbox>
      </div>

      <div className="iu-grid-cols-3">{leftConfig.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={leftConfig.withoutCorrectionId} value={leftNoCorrection} limit={3} onChange={onChange}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={leftConfig.withCorrectionId} value={leftCorrection} limit={3} onChange={onChange}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <Checkbox id={leftConfig.contactLensesId} onChange={onChange} checked={leftContacts}></Checkbox>
      </div>

      <div className="iu-grid-cols-3">{binocularConfig.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={binocularConfig.withoutCorrectionId} value={binocularNoCorrection} limit={3} onChange={onChange}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput id={binocularConfig.withCorrectionId} value={binocularCorrection} limit={3} onChange={onChange}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3"></div>
    </div>
  )
}

export default UeVisualAcuity
