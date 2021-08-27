import * as React from 'react'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../store/store'
import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeIcf,
  QuestionValidationTexts,
  TextArea,
  ValueIcf,
} from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import _ from 'lodash'
import IcfDropdown from '../../../components/icf/IcfDropdown'
import { IcdCode, Icf, IcfCode } from '../../../store/icf/icfReducer'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeIcf: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const textValue = getTextValue(question)
  const icfCodes = getIcdCodesValue(question)
  const questionConfig = question.config as ConfigUeIcf
  const dispatch = useAppDispatch()
  const [text, setText] = useState(textValue != null ? textValue : '')
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))

  const dispatchEditDraft = useRef(
    _.debounce((value: string) => {
      const updatedValue = getUpdatedValue(question, icfCodes, value)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(event.currentTarget.value)
  }

  const handleCodeChange = () => {

  }

  return (
    <div className={`iu-pt-200`}>
      <IcfDropdown infoText={'test'} icfData={getIcfData()} onCodeChange={handleCodeChange} />
      <TextArea disabled={disabled} rowsMin={4} hasValidationError={shouldDisplayValidationError} onChange={handleTextChange}
                name={questionConfig.id} value={text === null ? '' : text} />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors} />}
    </div>
  )
}

function getUpdatedValue(question: CertificateDataElement, icfCodes: string[] | undefined, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueIcf) }
  if (icfCodes) {
    ;(updatedQuestion.value as ValueIcf).codes = [...icfCodes]
  }
  ;(updatedQuestion.value as ValueIcf).text = text
  return updatedQuestion
}

function getTextValue(question: CertificateDataElement): string | null {
  if (question.value?.type !== CertificateDataValueType.ICF) {
    return null
  }
  return (question.value as ValueIcf).text
}

function getIcdCodesValue(question: CertificateDataElement): string[] | undefined {
  if (question.value?.type !== CertificateDataValueType.ICF) {
    return []
  }
  return (question.value as ValueIcf).codes
}

const getIcfData = (): Icf => {
  const icfCodes: IcfCode[] = [
    {
      code: '1',
      description: 'description 0',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 0',
    },
    {
      code: '2',
      description: 'description 1',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 1',
    },
    {
      code: '3',
      description: 'description 2',
      includes:
        'avlägsningsfunktioner, avföringskonsistens, avföringsfrekvens, avföringskontinens, väderspänningar; funktionsnedsättningar såsom förstoppning, diarré, vattnig avföring, nedsatt förmåga i ändtarmens slutmuskel eller inkontinens',
      title: 'title 2',
    },
  ]

  const ICD_CODE_1 = { code: 'A02', title: 'Andra salmonellainfektioner' }
  const ICD_CODE_2 = { code: 'U071', title: 'Covid-19, virus identifierat' }
  const icdCodes: IcdCode[] = [ICD_CODE_1, ICD_CODE_2]

  return {
    commonCodes: { icfCodes: icfCodes, icdCodes: icdCodes },
    uniqueCodes: [
      { icfCodes: icfCodes, icdCodes: [ICD_CODE_1] },
      { icfCodes: icfCodes, icdCodes: [ICD_CODE_2] },
    ],
  }
}

export default UeIcf
