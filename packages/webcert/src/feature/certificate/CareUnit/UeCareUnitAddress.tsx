import { MandatoryIcon, QuestionValidationTexts, TextArea, Unit } from '@frontend/common'
import {
  CARE_UNIT_ADDRESS_CATEGORY_TITLE,
  CARE_UNIT_ADDRESS_CATEGORY_TITLE_ID,
  CARE_UNIT_ADDRESS_FIELD,
  CARE_UNIT_CITY_FIELD,
  CARE_UNIT_PHONE_NUMBER_FIELD,
  CARE_UNIT_ZIP_CODE_FIELD,
  getValidationErrors,
} from '@frontend/common/src/utils/validationUtils'
import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { updateCertificateUnit } from '../../../store/certificate/certificateActions'
import {
  getCareUnitValidationErrors,
  getIsEditable,
  getIsLocked,
  getShowValidationErrors,
  getUnit,
} from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'

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

const UeCareUnitAddress: React.FC = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getCareUnitValidationErrors(), _.isEqual)
  const dispatch = useDispatch()
  const unit = useSelector(getUnit(), _.isEqual)
  const disabled = useSelector(getIsLocked)
  const editable = useSelector(getIsEditable)
  const [careUnitInfo, setCareUnitInfo] = useState<Unit>(unit)

  const addressValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_ADDRESS_FIELD)
  const zipCodeValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_ZIP_CODE_FIELD)
  const cityValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_CITY_FIELD)
  const phoneNumberrValidationErrors = getValidationErrors(validationErrors, CARE_UNIT_PHONE_NUMBER_FIELD)

  const dispatchEditDraft = useRef(
    _.debounce((state: Unit) => {
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
            <MandatoryIcon display={!careUnitInfo.address} />
            <label htmlFor="address">Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <TextArea
              hasValidationError={isShowValidationError && (!careUnitInfo.address || addressValidationErrors.length > 0)}
              limit={209}
              disabled={disabled || !editable}
              onChange={handleChange}
              name="address"
              rowsMin={1}
              value={careUnitInfo.address}
              disableCounter={true}
              autoResize={true}
            />
            {isShowValidationError && addressValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={getValidationErrors(validationErrors, CARE_UNIT_ADDRESS_FIELD)} />
            )}
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon display={!careUnitInfo.zipCode} />
            <label htmlFor="zipCode">Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
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
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon display={!careUnitInfo.city} />
            <label htmlFor="city">Postort</label>
          </div>
          <div className="iu-grid-span-9">
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
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon display={!careUnitInfo.phoneNumber} />
            <label htmlFor="phoneNumber">Telefonnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <PhoneNumberInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!careUnitInfo.phoneNumber || phoneNumberrValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleNumericChange}
              name="phoneNumber"
              id="phoneNumber"
              value={careUnitInfo.phoneNumber}
            />
            {isShowValidationError && phoneNumberrValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={phoneNumberrValidationErrors} />
            )}
          </div>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default UeCareUnitAddress
