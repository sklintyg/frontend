import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAvailableCertificateTypes, getAvailablePatients, getCreateCertificate } from '../../store/welcome/welcomeSelectors'
import { getCertificateTypes, getPatients, updateCreateCertificate } from '../../store/welcome/welcomeActions'
import { Backdrop, Dropdown, RadioButton } from '@frontend/common'
import { Wrapper } from '../../feature/certificate/Inputs/DatePickerCustom/Styles'

interface CreateCertificate {
  certificateType: string
  certificateTypeVersion: string
  patientId: string
  personId: string
  unitId: string
  status: string
  fillType: string
}

const WelcomeCertificateTypes: React.FC = () => {
  const certificateTypes = useSelector(getAvailableCertificateTypes())
  const patients = useSelector(getAvailablePatients())
  const createCertificate = useSelector(getCreateCertificate())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPatients())
    dispatch(getCertificateTypes())
  }, [])

  useEffect(() => {
    if (!certificateTypes) {
      return
    }

    certificateTypes.forEach((value) => {
      if (createCertificate.certificateType === value.internalType) {
        const updatedCreateCertificate = { ...createCertificate }
        updatedCreateCertificate.certificateTypeVersion = value.versions[value.versions.length - 1]
        updatedCreateCertificate.fillType = value.fillType[0]
        updatedCreateCertificate.status = value.statuses[0]
        dispatch(updateCreateCertificate(updatedCreateCertificate))
      }
    })
  }, [certificateTypes])

  useEffect(() => {
    if (!patients || patients.length === 0) {
      return
    }

    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.patientId = patients[0].personId.id
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }, [patients])

  const handleTypeChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    certificateTypes?.forEach((value) => {
      if (value.internalType === event.currentTarget.value) {
        updatedCreateCertificate.certificateType = event.currentTarget.value
        updatedCreateCertificate.certificateTypeVersion = value.versions[value.versions.length - 1]
        updatedCreateCertificate.fillType = value.fillType[0]
        updatedCreateCertificate.status = value.statuses[0]
        dispatch(updateCreateCertificate(updatedCreateCertificate))
      }
    })
  }

  const handlePatientChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.patientId = event.currentTarget.value
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  const handleVersionChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.certificateTypeVersion = event.currentTarget.value
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  const handleStatusChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.status = event.currentTarget.value
    if (event.currentTarget.value === 'SIGNED' && updatedCreateCertificate.fillType === 'EMPTY') {
      certificateTypes?.forEach((value) => {
        if (value.internalType === updatedCreateCertificate.certificateType) {
          updatedCreateCertificate.fillType = value.fillType[value.fillType.length - 1]
        }
      })
    }
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  const handleFilltypeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    updatedCreateCertificate.fillType = event.currentTarget.value
    if (event.currentTarget.value === 'EMPTY' && updatedCreateCertificate.status === 'SIGNED') {
      certificateTypes?.forEach((value) => {
        if (value.internalType === updatedCreateCertificate.certificateType) {
          updatedCreateCertificate.status = value.statuses[0]
        }
      })
    }
    dispatch(updateCreateCertificate(updatedCreateCertificate))
  }

  return (
    <>
      <Backdrop open={!certificateTypes} spinnerText={'Hämtar intygstyper'}>
        {certificateTypes && (
          <>
            <h3>Patient: </h3>
            <Dropdown
              options={patients.map((patient) => (
                <option key={patient.personId.id} value={patient.personId.id}>
                  {patient.fullName}
                </option>
              ))}
              onChange={handlePatientChange}
              id={'patient'}
              value={createCertificate.patientId}
            />
          </>
        )}
        <h3>Intyg: </h3>
        {certificateTypes &&
          certificateTypes.map((value) => (
            <Wrapper key={value.internalType}>
              <RadioButton
                key={value.internalType}
                label={value.name + ' (' + value.type + ')'}
                value={value.internalType}
                checked={value.internalType === createCertificate.certificateType}
                id={value.internalType}
                name={value.internalType}
                onChange={handleTypeChange}
              />
              {value.internalType === createCertificate.certificateType && (
                <Wrapper>
                  <Dropdown
                    options={value.versions.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                    onChange={handleVersionChange}
                    id={'versions' + value.internalType}
                    key={'versions' + value.internalType}
                    value={createCertificate.certificateTypeVersion}
                  />
                  <Dropdown
                    options={value.statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                    onChange={handleStatusChange}
                    id={'status' + value.internalType}
                    key={'status' + value.internalType}
                    value={createCertificate.status}
                  />
                  <Dropdown
                    options={value.fillType.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                    onChange={handleFilltypeChange}
                    id={'fillType' + value.internalType}
                    key={'fillType' + value.internalType}
                    value={createCertificate.fillType}
                  />
                </Wrapper>
              )}
            </Wrapper>
          ))}
      </Backdrop>
    </>
  )
}

export default WelcomeCertificateTypes
