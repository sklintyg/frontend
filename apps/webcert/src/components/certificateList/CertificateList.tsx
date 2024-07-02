import type React from 'react';
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'
import { fileImage } from '../../images'
import { updateCreatedCertificateId } from '../../store/certificate/certificateActions'
import { getCertificateId } from '../../store/certificate/certificateSelectors'
import { getCertificateTypes } from '../../store/patient/patientActions'
import { getActivePatient, selectCertificateTypes } from '../../store/patient/patientSelectors'
import { setUserPreference } from '../../store/user/userActions'
import { getUserPreference } from '../../store/user/userSelectors'
import { selectIsLoadingInitialState } from '../../store/utils/utilsSelectors'
import Spinner from '../utils/Spinner'
import CertificateListRow from './CertificateListRow'

const sortByFavorite = (a: boolean, b: boolean): number => {
  if (a > b) {
    return -1
  } else if (a < b) {
    return 1
  } else {
    return 0
  }
}

const CertificateBox = styled.div`
  max-height: 30.2em;
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
  const isLoadingInitialState = useSelector(selectIsLoadingInitialState)

  const [favorites, setFavorites] = useState<string[]>([])

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    ReactTooltip.hide()
  }, [favorites])

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

  return (
    <div className="iu-flex">
      <div className="iu-mr-gutter">
        <img src={fileImage} alt="Ikon för skapa intyg" className="iu-height-600" />
      </div>
      <FlexWrapper>
        <h3 className="iu-mb-05rem">Skapa intyg</h3>
        {isLoadingInitialState ? (
          <Spinner />
        ) : (
          <CertificateBox className="iu-border-secondary-light iu-shadow-sm iu-flex iu-flex-column">
            {[...certificateTypes]
              .sort(({ id: a }, { id: b }) => sortByFavorite(favorites.includes(a), favorites.includes(b)))
              .map(({ label, detailedDescription, id, issuerTypeId, links, message }) => {
                return (
                  <CertificateListRow
                    certificateName={label}
                    certificateInfo={detailedDescription}
                    id={id}
                    issuerTypeId={issuerTypeId}
                    favorite={favorites.includes(id)}
                    preferenceClick={handlePreferenceClick}
                    message={message}
                    key={id}
                    patient={patient}
                    links={links ?? []}
                  />
                )
              })}
          </CertificateBox>
        )}
      </FlexWrapper>
    </div>
  )
}

export default CertificateList
