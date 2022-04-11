import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getActivePatient } from '../../store/patient/patientSelectors'
import { getCertificateTypes, setUserPreference } from '../../store/user/userActions'
import { getUserPreference, selectCertificateTypes } from '../../store/user/userSelectors'
import CertificateListRow from './CertificateListRow'
import fileIcon from '../../images/fileIcon.svg'
import { Redirect } from 'react-router-dom'

const byFavorite = (a: any, b: any): number => {
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

const CreateCertificate: React.FC = () => {
  const userPreferences = useSelector(getUserPreference('wc.favoritIntyg'))
  const certificateTypes = useSelector(selectCertificateTypes)
  const patient = useSelector(getActivePatient)
  const [favorites, setFavorites] = useState<string[]>([])
  const [redirectToCertificate, setRedirectToCertificate] = useState(false)
  // const [certificateId, setCertificateId] = useState('')
  const dispatch = useDispatch()

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

  const handleCreateCertificate = (id: string) => {
    // setCertificateId(id)
    // setRedirectToCertificate(!redirectToCertificate)
  }

  useEffect(() => {
    if (patient) {
      dispatch(getCertificateTypes(patient?.personId.id))
    }
  }, [dispatch, patient])

  useEffect(() => {
    if (userPreferences) {
      setFavorites([...JSON.parse(userPreferences)])
    }
  }, [userPreferences])

  const certificates = certificateTypes
    .map((t) => ({
      certificateName: t.label,
      certificateInfo: t.detailedDescription,
      id: t.id,
      issuerTypeId: t.issuerTypeId,
      favorite: favorites.includes(t.id),
    }))
    .sort(byFavorite)

  // if (redirectToCertificate) {
  //   return <Redirect to={`/certificate/${certificateId}`} />
  // }

  return (
    <div className="ic-container iu-mt-gutter iu-flex">
      <div className="iu-mr-05rem">
        <img src={fileIcon} alt="Ikon för skapa intyg" className="iu-height-700" />
      </div>
      <FlexWrapper>
        <h2 className="iu-mb-05rem">Skapa intyg</h2>
        <CertificateBox className="iu-border-secondary-light iu-shadow-sm iu-flex iu-flex-column">
          {certificates.map((certificateType) => (
            <CertificateListRow
              {...certificateType}
              preferenceClick={handlePreferenceClick}
              createCertificate={handleCreateCertificate}
              key={certificateType.id}
            />
          ))}
        </CertificateBox>
      </FlexWrapper>
    </div>
  )
}

export default CreateCertificate
