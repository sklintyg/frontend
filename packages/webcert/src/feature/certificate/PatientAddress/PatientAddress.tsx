import {
  MandatoryIcon,
  QuestionValidationTexts,
  TextInput,
  TextArea,
  getResourceLink,
  resourceLinksAreEqual,
  ResourceLinkType,
  Patient,
} from '@frontend/common'
import {
  PATIENT_STREET_FIELD,
  PATIENT_CITY_FIELD,
  PATIENT_ZIP_CODE_FIELD,
  PATIENT_ADDRESS_CATEGORY_TITLE_ID,
  PATIENT_ADDRESS_CATEGORY_TITLE,
  getValidationErrors,
} from '@frontend/common/src/utils/validationUtils'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/macro'
import { css } from 'styled-components'
import { updateCertificatePatient } from '../../../store/certificate/certificateActions'
import {
  getPatient,
  getPatientValidationErrors,
  getIsEditable,
  getIsLocked,
  getShowValidationErrors,
  getResourceLinks,
} from '../../../store/certificate/certificateSelectors'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'
import _ from 'lodash'

const Wrapper = styled.div`
  align-items: center;
`

const ZipCodeInput = styled(TextInput)`
  max-width: 6.5em;
`

const CityInput = styled(TextInput)`
  max-width: 20em;
`
const mandatoryIconAdditionalStyles = css`
  top: -5px;
`

const PatientAddress: React.FC = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getPatientValidationErrors(), _.isEqual)
  const patient = useSelector(getPatient)
  const resourceLinks = useSelector(getResourceLinks, _.isEqual)
  const disabled = useSelector(getIsLocked)
  const editable =
    useSelector(getIsEditable) &&
    resourceLinks.some((link) => resourceLinksAreEqual(link.type, ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE)) &&
    getResourceLink(resourceLinks, ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE).enabled

  const [patientInfo, setPatientInfo] = useState(patient as Patient)

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

  return (
    <>
      <CategoryHeader>
        <CategoryTitle titleId={PATIENT_ADDRESS_CATEGORY_TITLE_ID}>{PATIENT_ADDRESS_CATEGORY_TITLE}</CategoryTitle>
      </CategoryHeader>
      <QuestionWrapper>
        <Wrapper className="iu-grid-cols iu-grid-cols-12">
          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!patientInfo.street} />
            <label htmlFor="patientAddress">Postadress</label>
          </div>
          <div className="iu-grid-span-9">
            <TextArea
              disabled={disabled || !editable}
              additionalStyles={`ic-textfield ${
                isShowValidationError && (!patient.street || streetValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleChange}
              name="street"
              value={patientInfo.street}
              rowsMin={1}
              disableCounter={true}
              autoResize={true}
            />
            {isShowValidationError && streetValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={getValidationErrors(validationErrors, PATIENT_STREET_FIELD)} />
            )}
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!patientInfo.zipCode} />
            <label htmlFor="patientZipCode">Postnummer</label>
          </div>
          <div className="iu-grid-span-9">
            <ZipCodeInput
              disabled={disabled || !editable}
              className={`ic-textfield ${
                isShowValidationError && (!patient.zipCode || zipCodeValidationErrors.length > 0) ? 'ic-textfield--error' : ''
              }`}
              onChange={handleChange}
              name="zipCode"
              id="zipCode"
              value={patientInfo.zipCode}
            />
            {isShowValidationError && zipCodeValidationErrors.length > 0 && (
              <QuestionValidationTexts validationErrors={getValidationErrors(validationErrors, PATIENT_ZIP_CODE_FIELD)} />
            )}
          </div>

          <div className="iu-grid-span-3">
            <MandatoryIcon additionalStyles={mandatoryIconAdditionalStyles} display={!patientInfo.city} />
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
              <QuestionValidationTexts validationErrors={getValidationErrors(validationErrors, PATIENT_CITY_FIELD)} />
            )}
          </div>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default PatientAddress
