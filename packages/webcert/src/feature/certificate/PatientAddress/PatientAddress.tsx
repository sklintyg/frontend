import {
  getResourceLink,
  MandatoryIcon,
  Patient,
  QuestionValidationTexts,
  resourceLinksAreEqual,
  ResourceLinkType,
  TextArea,
} from '@frontend/common'
import {
  getValidationErrors,
  PATIENT_ADDRESS_CATEGORY_TITLE,
  PATIENT_ADDRESS_CATEGORY_TITLE_ID,
  PATIENT_CITY_FIELD,
  PATIENT_STREET_FIELD,
  PATIENT_ZIP_CODE_FIELD,
} from '@frontend/common/src/utils/validationUtils'
import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { css } from 'styled-components'
import styled from 'styled-components/macro'
import { updateCertificatePatient } from '../../../store/certificate/certificateActions'
import {
  getIsEditable,
  getIsLocked,
  getPatient,
  getPatientValidationErrors,
  getResourceLinks,
  getShowValidationErrors,
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

const mandatoryIconAdditionalStyles = css`
  top: -5px;
`

const PatientAddress: React.FC = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getPatientValidationErrors(), _.isEqual)
  const patient = useSelector(getPatient, _.isEqual)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const disabled = useSelector(getIsLocked)
  const editable =
    useSelector(getIsEditable) &&
    resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE)) &&
    getResourceLink(resourceLinks, ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE).enabled

  const [patientInfo, setPatientInfo] = useState<Patient>(patient as Patient)

  const dispatch = useDispatch()

  const streetValidationErrors = getValidationErrors(validationErrors, PATIENT_STREET_FIELD)
  const zipCodeValidationErrors = getValidationErrors(validationErrors, PATIENT_ZIP_CODE_FIELD)
  const cityValidationErrors = getValidationErrors(validationErrors, PATIENT_CITY_FIELD)

  const dispatchEditDraft = useRef(
    _.debounce((state: Patient) => {
      dispatch(updateCertificatePatient(state))
    }, 1000)
  ).current

  if (!patient) {
    return null
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = event.target
    const updatedPatient = { ...patientInfo, [name]: value } as Patient

    setPatientInfo(updatedPatient)
    dispatchEditDraft(updatedPatient)
  }

  const handleNumericChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
    let updatedPatient = { ...patientInfo, [event.target.name]: value }

    if (event.target.name === 'zipCode' && value.length > 3) {
      const zipValue = [value.split('').slice(0, 3), ' ', value.split('').slice(3, 5)].flat().join('')
      updatedPatient = { ...patientInfo, [event.target.name]: zipValue }
    }

    setPatientInfo(updatedPatient)
    dispatchEditDraft(updatedPatient)
  }

  return (
    <>
      <CategoryHeader>
        <CategoryTitle titleId={PATIENT_ADDRESS_CATEGORY_TITLE_ID}>{PATIENT_ADDRESS_CATEGORY_TITLE}</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper>
        <Wrapper className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!disabled && !patientInfo.street} />
            <label htmlFor="patientAddress">Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <TextArea
              hasValidationError={isShowValidationError && (!patientInfo.street || streetValidationErrors.length > 0)}
              disabled={disabled || !editable}
              onChange={handleChange}
              name="street"
              value={patientInfo.street}
              limit={209}
              rowsMin={1}
              disableCounter={true}
              autoResize={true}
            />
            {isShowValidationError && streetValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={streetValidationErrors} />
            )}
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!disabled && !patientInfo.zipCode} />
            <label htmlFor="patientZipCode">Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <ZipCodeInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!patient.zipCode || zipCodeValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleNumericChange}
              name="zipCode"
              id="zipCode"
              value={patientInfo.zipCode}
            />
            {isShowValidationError && zipCodeValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={zipCodeValidationErrors} />
            )}
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!disabled && !patientInfo.city} />
            <label htmlFor="patientCity">Postort</label>
          </div>
          <div className="iu-grid-span-9">
            <CityInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!patient.city || cityValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleChange}
              name="city"
              id="city"
              value={patientInfo.city}
            />
            {isShowValidationError && cityValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={cityValidationErrors} />
            )}
          </div>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default PatientAddress
