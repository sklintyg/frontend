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
  CertificateDataValidationType,
  TextValidation,
} from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import _ from 'lodash'
import IcfDropdown from '../../../components/icf/IcfDropdown'
import { getIcfData } from '../../../store/icf/icfSelectors'
import { getFilteredIcfValues, getIcfValueList } from '../../../components/icf/IcfUtils'
import { useDeepCompareEffect } from '../../../hooks/useDeepCompareEffect'
import usePrevious from '../../../hooks/usePrevious'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeIcf: React.FC<Props> = ({ question, disabled }) => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const textValue = getTextValue(question)
  const icfData = useSelector(getIcfData((question.value as ValueIcf).id), _.isEqual)
  const questionConfig = question.config as ConfigUeIcf
  const dispatch = useAppDispatch()
  const [text, setText] = useState(textValue != null ? textValue : '')
  const [chosenIcfValues, setChosenIcfValues] = useState<string[] | undefined>(getIcdCodesValue(question))
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const textValidation = question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation
  const previousIcfValues = usePrevious(getIcfValueList(icfData))

  const dispatchEditDraft = useRef(
    _.debounce((question: CertificateDataElement, textValue: string, icfCodeValues?: string[]) => {
      const updatedValue = getUpdatedValue(question, icfCodeValues, textValue)
      dispatch(updateCertificateDataElement(updatedValue))
    }, 1000)
  ).current

  useDeepCompareEffect(() => {
    if (!icfData && previousIcfValues.length === 0) return

    const newIcfValues = getIcfValueList(icfData)
    const updatedChosenIcfValues = getFilteredIcfValues(chosenIcfValues, previousIcfValues, newIcfValues)
    setChosenIcfValues(updatedChosenIcfValues)
    dispatchEditDraft(question, text, updatedChosenIcfValues)
  }, [icfData, dispatchEditDraft, previousIcfValues, question, text])

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setText(event.currentTarget.value)
    dispatchEditDraft(question, event.currentTarget.value, chosenIcfValues)
  }

  const handleAddIcfCodeValue = (icfCodeToAdd: string) => {
    let updatedIcfCodes

    if (!chosenIcfValues) {
      updatedIcfCodes = [icfCodeToAdd]
    } else {
      updatedIcfCodes = [...chosenIcfValues, icfCodeToAdd]
    }
    setChosenIcfValues(updatedIcfCodes)
    dispatchEditDraft(question, text, updatedIcfCodes)
  }

  const handleRemoveIcfCodeValue = (icfCodeToRemove: string) => {
    const updatedIcfCodes = chosenIcfValues?.filter((icfCode) => icfCode !== icfCodeToRemove)
    setChosenIcfValues(updatedIcfCodes)
    dispatchEditDraft(question, text, updatedIcfCodes)
  }

  const getPlaceHolder = (): string => {
    if (!chosenIcfValues) return ''
    return chosenIcfValues.length > 0 ? questionConfig.placeholder : ''
  }

  return (
    <div className={`iu-pt-200`}>
      {!disabled && (
        <IcfDropdown
          id={question.id}
          disabled={disabled}
          chosenIcfCodeValues={chosenIcfValues}
          modalLabel={questionConfig.modalLabel}
          collectionsLabel={questionConfig.collectionsLabel}
          icfData={icfData}
          onAddCode={handleAddIcfCodeValue}
          onRemoveCode={handleRemoveIcfCodeValue}
        />
      )}
      <TextArea
        disabled={disabled}
        rowsMin={6}
        hasValidationError={shouldDisplayValidationError}
        onChange={handleTextChange}
        name={questionConfig.id}
        value={text === null ? '' : text}
        limit={textValidation ? textValidation.limit : 3500}
        placeholder={getPlaceHolder()}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors} />}
    </div>
  )
}

function getUpdatedValue(question: CertificateDataElement, icfCodes: string[] | undefined, text: string): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueIcf) }
  if (icfCodes) {
    ;(updatedQuestion.value as ValueIcf).icfCodes = [...icfCodes]
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
  return (question.value as ValueIcf).icfCodes
}

export default UeIcf
