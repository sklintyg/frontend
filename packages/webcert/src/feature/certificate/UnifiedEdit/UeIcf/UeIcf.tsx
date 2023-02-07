import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CertificateDataElement,
  ConfigUeIcf,
  QuestionValidationTexts,
  TextArea,
  ValueIcf,
  CertificateDataValidationType,
  TextValidation,
} from '@frontend/common'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { debounce, isEqual } from 'lodash'
import IcfDropdown from '../../../../components/icf/IcfDropdown'
import { getIcfData } from '../../../../store/icf/icfSelectors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import usePrevious from '../../../../hooks/usePrevious'
import { getFilteredIcfValues, getIcfValueList } from '../../../../components/icf/IcfUtils'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeIcf: React.FC<Props> = ({ question, disabled }) => {
  const dispatch = useAppDispatch()
  const valueId = (question.value as ValueIcf).id
  const icfData = useSelector(getIcfData(valueId), isEqual)
  const previousIcfCodes = usePrevious(getIcfValueList(icfData))
  const questionConfig = question.config as ConfigUeIcf
  const [currentValue, setCurrentValue] = useState<ValueIcf>(question.value as ValueIcf)
  const textValidation = question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))

  const dispatchValue = useRef(debounce((value: ValueIcf) => dispatch(updateCertificateDataElement({ ...question, value })), 1000)).current

  const updateValue = useCallback(
    (value: Partial<ValueIcf>) => {
      setCurrentValue({ ...currentValue, ...value })
      dispatchValue({ ...currentValue, ...value })
    },
    [currentValue, dispatchValue]
  )

  const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    updateValue({ text: event.currentTarget.value })
  }

  const handleAddIcfCodeValue = (icfCodeToAdd: string) => {
    updateValue({ icfCodes: (currentValue.icfCodes ?? []).concat(icfCodeToAdd) })
  }

  const handleRemoveIcfCodeValue = (icfCodeToRemove: string) => {
    updateValue({ icfCodes: (currentValue.icfCodes ?? []).filter((code) => code !== icfCodeToRemove) })
  }

  useEffect(() => {
    const newIcfCodes = getIcfValueList(icfData)
    if (!isEqual(previousIcfCodes, newIcfCodes)) {
      updateValue({ icfCodes: getFilteredIcfValues(currentValue.icfCodes, previousIcfCodes, newIcfCodes) })
    }
  }, [currentValue.icfCodes, icfData, previousIcfCodes, updateValue])

  return (
    <>
      {!disabled && (
        <IcfDropdown
          id={question.id}
          disabled={disabled}
          chosenIcfCodeValues={currentValue.icfCodes}
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
        hasValidationError={validationErrors.length > 0}
        onChange={handleTextChange}
        name={questionConfig.id}
        value={currentValue.text ?? ''}
        limit={textValidation ? textValidation.limit : 3500}
        placeholder={(currentValue.icfCodes?.length ?? 0) > 0 ? questionConfig.placeholder : ''}
      />
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeIcf
