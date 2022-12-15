import { CertificateDataElement, Checkbox, ConfigUeVisualAcuity, TextInput, ValueVisualAcuity } from '@frontend/common'
import React from 'react'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
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
  const questionConfig = question.config as ConfigUeVisualAcuity

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
      <div className="iu-grid-cols-3">{questionConfig.rightEye.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.rightEye.withoutCorrectionId}
          value={questionValue.rightEye.withoutCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.rightEye.withCorrectionId}
          value={questionValue.rightEye.withCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <Checkbox id={questionConfig.rightEye.contactLensesId} onChange={onChange}></Checkbox>
      </div>
      <div className="iu-grid-cols-3">{questionConfig.leftEye.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.leftEye.withoutCorrectionId}
          value={questionValue.leftEye.withoutCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.leftEye.withCorrectionId}
          value={questionValue.leftEye.withCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <Checkbox id={questionConfig.leftEye.contactLensesId} onChange={onChange}></Checkbox>
      </div>
      <div className="iu-grid-cols-3">{questionConfig.binocular.label}</div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.binocular.withoutCorrectionId}
          value={questionValue.binocular.withoutCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3">
        <AcuityInput
          id={questionConfig.binocular.withCorrectionId}
          value={questionValue.binocular.withCorrection.value?.toString() ?? ''}
          limit={3}></AcuityInput>
      </div>
      <div className="iu-grid-cols-3"></div>
    </div>
  )
}

export default UeVisualAcuity
