import { debounce, isEqual } from 'lodash-es'
import type React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TextArea from '../../../components/Inputs/TextArea'
import QuestionValidationTexts from '../../../components/Validation/QuestionValidationTexts'
import MandatoryIcon from '../../../components/utils/MandatoryIcon'
import { updateCertificateUnit } from '../../../store/certificate/certificateActions'
import {
  getCareUnitValidationErrors,
  getIsEditable,
  getIsLocked,
  getShowValidationErrors,
  getUnit,
} from '../../../store/certificate/certificateSelectors'
import type { Unit } from '../../../types'
import { getValidationErrors } from '../../../utils'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'

export const CARE_UNIT_ADDRESS_FIELD = 'grunddata.skapadAv.vardenhet.postadress'
export const CARE_UNIT_ZIP_CODE_FIELD = 'grunddata.skapadAv.vardenhet.postnummer'
export const CARE_UNIT_CITY_FIELD = 'grunddata.skapadAv.vardenhet.postort'
export const CARE_UNIT_PHONE_NUMBER_FIELD = 'grunddata.skapadAv.vardenhet.telefonnummer'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID = 'vardenhetensadress'
export const CARE_UNIT_ADDRESS_CATEGORY_TITLE = 'Vårdenhetens adress'

const Wrapper = styled.div`
  align-items: center;
`

const ZipCodeInput = styled.input.attrs({
  type: 'text',
  size: 6,
  maxLength: 6,
})`
  max-width: 6.5em;
`

const CityInput = styled.input.attrs({
  type: 'text',
  size: 30,
  maxLength: 30,
})`
  max-width: 20em;
`

const PhoneNumberInput = styled.input.attrs({
  type: 'text',
  size: 20,
  maxLength: 20,
})`
  max-width: 15em;
`

const InputWrapper = styled.div.attrs({ className: 'iu-grid-span-9' })`
  line-height: 0;

  .iu-color-error {
    line-height: 1.64;
  }
`

const UeCareUnitAddress = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getCareUnitValidationErrors(), isEqual)
  const dispatch = useDispatch()
  const unit = useSelector(getUnit(), isEqual)
  const disabled = useSelector(getIsLocked)
  const editable = useSelector(getIsEditable)
  const [careUnitInfo, setCareUnitInfo] = useState<Unit>(unit)

  const addressValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_ADDRESS_FIELD)
  const zipCodeValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_ZIP_CODE_FIELD)
  const cityValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_CITY_FIELD)
  const phoneNumberValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_PHONE_NUMBER_FIELD)

  const dispatchEditDraft = useRef(
    debounce((state: Unit) => {
      dispatch(updateCertificateUnit(state))
    }, 1000)
  ).current

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target
    const updatedUnit = { ...careUnitInfo, [name]: value } as Unit

    setCareUnitInfo(updatedUnit)
    dispatchEditDraft(updatedUnit)
  }

  const handleNumericChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
    let updatedUnit = { ...careUnitInfo, [event.target.name]: value }

    if (event.target.name === 'zipCode' && value.length > 3) {
      const zipValue = [value.split('').slice(0, 3), ' ', value.split('').slice(3, 5)].flat().join('')
      updatedUnit = { ...careUnitInfo, [event.target.name]: zipValue }
    }

    setCareUnitInfo(updatedUnit)
    dispatchEditDraft(updatedUnit)
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle titleId={CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID}>{CARE_UNIT_ADDRESS_CATEGORY_TITLE}</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper>
        <Wrapper className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-3">
            {!careUnitInfo.address && <MandatoryIcon />}
            <label htmlFor="address">Postadress</label>
          </div>
          <InputWrapper>
            <TextArea
              hasValidationError={isShowValidationError && (!careUnitInfo.address || addressValidationErrors.length > 0)}
              maxLength={209}
              disabled={disabled || !editable}
              onChange={handleChange}
              name="address"
              rows={1}
              value={careUnitInfo.address}
              disableCounter={true}
              autoResize={true}
            />
            {isShowValidationError && addressValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={getValidationErrors(validationErrors, CARE_UNIT_ADDRESS_FIELD)} />
            )}
          </InputWrapper>

          <div className="iu-grid-span-3">
            {!careUnitInfo.zipCode && <MandatoryIcon />}
            <label htmlFor="zipCode">Postnummer</label>
          </div>
          <InputWrapper>
            <ZipCodeInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!careUnitInfo.zipCode || zipCodeValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleNumericChange}
              name="zipCode"
              id="zipCode"
              value={careUnitInfo.zipCode}
            />
            {isShowValidationError && zipCodeValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={zipCodeValidationErrors} />
            )}
          </InputWrapper>

          <div className="iu-grid-span-3">
            {!careUnitInfo.city && <MandatoryIcon />}
            <label htmlFor="city">Postort</label>
          </div>
          <InputWrapper>
            <CityInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!careUnitInfo.city || cityValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleChange}
              name="city"
              id="city"
              value={careUnitInfo.city}
            />
            {isShowValidationError && cityValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={cityValidationErrors} />
            )}
          </InputWrapper>

          <div className="iu-grid-span-3">
            {!careUnitInfo.phoneNumber && <MandatoryIcon />}
            <label htmlFor="phoneNumber">Telefonnummer</label>
          </div>
          <InputWrapper>
            <PhoneNumberInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!careUnitInfo.phoneNumber || phoneNumberValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleNumericChange}
              name="phoneNumber"
              id="phoneNumber"
              value={careUnitInfo.phoneNumber}
            />
            {isShowValidationError && phoneNumberValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={phoneNumberValidationErrors} />
            )}
          </InputWrapper>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default UeCareUnitAddress
