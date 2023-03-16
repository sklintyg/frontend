import {
  CertificateDataElement,
  CertificateDataValidationType,
  ConfigUeIcf,
  QuestionValidationTexts,
  TextArea,
  TextValidation,
  ValueIcf,
} from '@frontend/common'
import { debounce, isEqual } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import IcfDropdown from '../../../../components/icf/IcfDropdown'
import { getFilteredIcfValues, getIcfValueList } from '../../../../components/icf/IcfUtils'
import usePrevious from '../../../../hooks/usePrevious'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { getIcfData } from '../../../../store/icf/icfSelectors'
import { useAppDispatch } from '../../../../store/store'

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
          onAddCode={(icfCodeToAdd) => updateValue({ icfCodes: (currentValue.icfCodes ?? []).concat(icfCodeToAdd) })}
          onRemoveCode={(icfCodeToRemove) =>
            updateValue({ icfCodes: (currentValue.icfCodes ?? []).filter((code) => code !== icfCodeToRemove) })
          }
        />
      )}
      <TextArea
        disabled={disabled}
        rows={6}
        hasValidationError={validationErrors.length > 0}
        onChange={(event) => updateValue({ text: event.currentTarget.value })}
        name={questionConfig.id}
        value={currentValue.text ?? ''}
        maxLength={textValidation ? textValidation.limit : 3500}
        placeholder={(currentValue.icfCodes?.length ?? 0) > 0 ? questionConfig.placeholder : ''}
      />
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeIcf
