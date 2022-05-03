import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getActivePatient, selectCertificateTypes } from '../../store/patient/patientSelectors'
import { setUserPreference } from '../../store/user/userActions'
import { getUserPreference } from '../../store/user/userSelectors'
import CertificateListRow from './CertificateListRow'
import fileIcon from '../../images/fileIcon.svg'
import { useHistory } from 'react-router-dom'
import { createNewCertificate, updateCreatedCertificateId } from '../../store/certificate/certificateActions'
import { getCertificateId } from '../../store/certificate/certificateSelectors'
import { getCertificateTypes } from '../../store/patient/patientActions'
import { ResourceLinkType } from '@frontend/common'

interface CertificateTypeViewModel {
  certificateName: string
  certificateInfo: string
  id: string
  issuerTypeId: string
  favorite: boolean
  createDisabled: boolean
}

const byFavorite = (a: CertificateTypeViewModel, b: CertificateTypeViewModel): number => {
  if (a.favorite > b.favorite) {
    return -1
  } else if (a.favorite < b.favorite) {
    return 1
  } else {
    return 0
  }
}

const CertificateBox = styled.div`
  max-width: 75%;
  max-height: 32em;
  overflow-y: auto;
`

const FlexWrapper = styled.div`
  flex: 1;
`

const CertificateList: React.FC = () => {
  const certificateId = useSelector(getCertificateId())
  const userPreferences = useSelector(getUserPreference('wc.favoritIntyg'))
  const certificateTypes = useSelector(selectCertificateTypes)
  const patient = useSelector(getActivePatient)

  const [favorites, setFavorites] = useState<string[]>([])
  const dispatch = useDispatch()
  const history = useHistory()

  const handlePreferenceClick = (id: string) => {
    let updatedFavorites = []

    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter((f) => f !== id)
    } else {
      updatedFavorites = [...favorites, id]
    }

    setFavorites(updatedFavorites)
    dispatch(setUserPreference({ key: 'wc.favoritIntyg', value: JSON.stringify(updatedFavorites) }))
  }

  const handleCreateCertificate = (certificateType: string) => {
    if (patient) {
      dispatch(createNewCertificate({ certificateType, patientId: patient.personId.id }))
    }
  }

  useEffect(() => {
    if (patient) {
      dispatch(getCertificateTypes(patient.personId.id))
    }
  }, [dispatch, patient])

  useEffect(() => {
    if (userPreferences) {
      setFavorites([...JSON.parse(userPreferences)])
    }
  }, [userPreferences])

  useEffect(() => {
    if (certificateId) {
      dispatch(updateCreatedCertificateId(''))
      history.push(`/certificate/${certificateId}`)
    }
  }, [certificateId, dispatch, history])

  const getCertificateTypeContent = () => {
    const certificates: CertificateTypeViewModel[] = certificateTypes
      .map((t) => ({
        certificateName: t.label,
        certificateInfo: t.detailedDescription,
        id: t.id,
        issuerTypeId: t.issuerTypeId,
        favorite: favorites.includes(t.id),
        createDisabled: !t.links.find((link) => link.type === ResourceLinkType.CREATE_CERTIFICATE),
      }))
      .sort(byFavorite)

    return certificates.map((certificateType) => (
      <CertificateListRow
        {...certificateType}
        preferenceClick={handlePreferenceClick}
        createCertificate={handleCreateCertificate}
        key={certificateType.id}
      />
    ))
  }

  return (
    <div className="ic-container iu-mt-800 iu-flex">
      <div className="iu-mr-gutter">
        <img src={fileIcon} alt="Ikon för skapa intyg" className="iu-height-600" />
      </div>
      <FlexWrapper>
        <h3 className="iu-mb-05rem">Skapa intyg</h3>
        <CertificateBox className="iu-border-secondary-light iu-shadow-sm iu-flex iu-flex-column">
          {getCertificateTypeContent()}
        </CertificateBox>
      </FlexWrapper>
    </div>
  )
}

export default CertificateList
