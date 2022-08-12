import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAvailableCertificateTypes, getAvailablePatients, getCreateCertificate } from '../../store/welcome/welcomeSelectors'
import { getCertificateTypes, getPatients, updateCreateCertificate } from '../../store/welcome/welcomeActions'
import { useDeepCompareEffect } from '../../hooks/useDeepCompareEffect'
import { Backdrop, Dropdown, RadioButton } from '@frontend/common'
import styled from 'styled-components/macro'
import { isEqual } from 'lodash'

const PatientWrapper = styled.div`
  max-width: 600px;
`

const WelcomeCertificateTypes: React.FC = () => {
  const certificateTypes = useSelector(getAvailableCertificateTypes())
  const patients = useSelector(getAvailablePatients())
  const createCertificate = useSelector(getCreateCertificate())
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPatients())
    dispatch(getCertificateTypes())
  }, [dispatch])

  useDeepCompareEffect(() => {
    if (!certificateTypes) {
      return
    }

    const currentType = certificateTypes.find((t) => t.internalType === createCertificate.certificateType)
    if (!currentType) {
      return
    }

    const newCreateCertificate = { ...createCertificate }
    newCreateCertificate.certificateTypeVersion =
      newCreateCertificate.certificateTypeVersion !== ''
        ? newCreateCertificate.certificateTypeVersion
        : currentType.versions[currentType.versions.length - 1]
    newCreateCertificate.fillType = newCreateCertificate.fillType !== '' ? newCreateCertificate.fillType : currentType.fillType[0]
    newCreateCertificate.status = newCreateCertificate.status !== '' ? newCreateCertificate.status : currentType.statuses[0]
    newCreateCertificate.patientId =
      newCreateCertificate.patientId !== '' && patients?.length > 0 ? newCreateCertificate.patientId : patients[0].personId.id

    if (!isEqual(newCreateCertificate, createCertificate)) {
      dispatch(updateCreateCertificate(newCreateCertificate))
    }
  }, [certificateTypes, createCertificate, dispatch, patients])

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

  const handlePatientIdChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const updatedCreateCertificate = { ...createCertificate }
    let value = event.currentTarget.value
    value = value.replace('-', '')
    value = value.substring(0, 12)
    updatedCreateCertificate.patientId = value
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

  const modifiedPatientId = (patientId: string) => {
    if (patientId.length <= 8) {
      return patientId
    } else if (patientId.includes('-')) {
      return patientId.substring(0, 13)
    } else {
      return patientId.substring(0, 8) + '-' + patientId.substring(8, 12)
    }
  }

  return (
    <>
      <Backdrop open={!certificateTypes} spinnerText={'Hämtar intygstyper'}>
        {certificateTypes && (
          <PatientWrapper>
            <h3>Patient: </h3>
            <div className="iu-grid-cols iu-grid-cols-6">
              <div className="iu-grid-span-3">
                <label htmlFor="patient">Namn</label>
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
              </div>
              <div className="iu-grid-span-3">
                <label htmlFor="patientId">Personnummer</label>
                {
                  <input
                    type="text"
                    className="ic-textfield"
                    id="patientId"
                    value={modifiedPatientId(createCertificate.patientId)}
                    onChange={handlePatientIdChange}
                    maxLength={13}
                  />
                }
              </div>
            </div>
          </PatientWrapper>
        )}
        <h3>Intyg: </h3>
        {certificateTypes &&
          certificateTypes.map((value) => (
            <div key={value.internalType}>
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
                <div>
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
                </div>
              )}
            </div>
          ))}
      </Backdrop>
    </>
  )
}

export default WelcomeCertificateTypes
