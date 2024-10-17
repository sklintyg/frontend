import { getByType } from 'utils'
import { debounce, isEqual } from 'lodash-es'
import type React from 'react'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TextArea from '../../../components/Inputs/TextArea'
import QuestionValidationTexts from '../../../components/Validation/QuestionValidationTexts'
import MandatoryIcon from '../../../components/utils/MandatoryIcon'
import { updateCertificatePatient } from '../../../store/certificate/certificateActions'
import {
  getCertificateResourceLinks,
  getIsEditable,
  getIsLocked,
  getPatient,
  getPatientValidationErrors,
  getShowValidationErrors,
} from '../../../store/certificate/certificateSelectors'
import type { Patient } from '../../../types'
import { ResourceLinkType } from '../../../types'
import { getValidationErrors } from '../../../utils'
import CategoryHeader from '../Category/CategoryHeader'
import CategoryTitle from '../Category/CategoryTitle'
import QuestionWrapper from '../Question/QuestionWrapper'

export const PATIENT_STREET_FIELD = 'grunddata.patient.postadress'
export const PATIENT_ZIP_CODE_FIELD = 'grunddata.patient.postnummer'
export const PATIENT_CITY_FIELD = 'grunddata.patient.postort'
export const PATIENT_ADDRESS_CATEGORY_TITLE_ID = 'patientensadress'
export const PATIENT_ADDRESS_CATEGORY_TITLE = 'Patientens adressuppgifter'

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

const InputWrapper = styled.div.attrs({ className: 'iu-grid-span-9' })`
  line-height: 0;

  .iu-color-error {
    line-height: 1.64;
  }
`

const PatientAddress: React.FC = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getPatientValidationErrors(), isEqual)
  const patient = useSelector(getPatient, isEqual)
  const resourceLinks = useSelector(getCertificateResourceLinks, isEqual)
  const disabled = useSelector(getIsLocked)
  const displayPatientAddressInCertificate =
    getByType(resourceLinks, ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE)?.enabled ?? false
  const editable =
    useSelector(getIsEditable) &&
    resourceLinks.some((link) => link.type === ResourceLinkType.DISPLAY_PATIENT_ADDRESS_IN_CERTIFICATE) &&
    displayPatientAddressInCertificate

  const [patientInfo, setPatientInfo] = useState<Patient>(patient as Patient)

  const dispatch = useDispatch()

  const streetValidationErrors = getValidationErrors(validationErrors, PATIENT_STREET_FIELD)
  const zipCodeValidationErrors = getValidationErrors(validationErrors, PATIENT_ZIP_CODE_FIELD)
  const cityValidationErrors = getValidationErrors(validationErrors, PATIENT_CITY_FIELD)

  const dispatchEditDraft = useRef(
    debounce((state: Patient) => {
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
            {!disabled && !patientInfo.street && <MandatoryIcon />}
            <label htmlFor="patientAddress">Postadress</label>
          </div>
          <InputWrapper>
            <TextArea
              hasValidationError={isShowValidationError && (!patientInfo.street || streetValidationErrors.length > 0)}
              disabled={disabled || !editable}
              onChange={handleChange}
              name="street"
              value={patientInfo.street}
              maxLength={209}
              rows={1}
              disableCounter={true}
              autoResize={true}
            />
            <QuestionValidationTexts validationErrors={streetValidationErrors} />
          </InputWrapper>

          <div className="iu-grid-span-3">
            {!disabled && !patientInfo.zipCode && <MandatoryIcon />}
            <label htmlFor="patientZipCode">Postnummer</label>
          </div>
          <InputWrapper>
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
            <QuestionValidationTexts validationErrors={zipCodeValidationErrors} />
          </InputWrapper>

          <div className="iu-grid-span-3">
            {!disabled && !patientInfo.city && <MandatoryIcon />}
            <label htmlFor="patientCity">Postort</label>
          </div>
          <InputWrapper>
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
            <QuestionValidationTexts validationErrors={cityValidationErrors} />
          </InputWrapper>
        </Wrapper>
      </QuestionWrapper>
    </>
  )
}

export default PatientAddress
