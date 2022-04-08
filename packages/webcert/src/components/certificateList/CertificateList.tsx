import React, { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCertificateTypes as fetchCertificateTypes, setUserPreference } from '../../store/user/userActions'
import { getUserPreference, getCertificateTypes } from '../../store/user/userSelectors'
import CertificateListRow from './CertificateListRow'

const CreateCertificate: React.FC = () => {
  const [favorites, setFavorites] = useState<Array<string>>([])
  const dispatch = useDispatch()
  const userPreferences = useSelector(getUserPreference('wc.favoritIntyg'))
  const certificateTypes = useSelector(getCertificateTypes)

  const CertificateBox = styled.div`
    max-width: 75%;
    max-height: 32em;
    overflow-y: auto;
  `

  const handleFavoriteClick = (event: ChangeEvent<HTMLButtonElement>) => {
    setFavorites([...favorites, event.currentTarget.id])
    dispatch(setUserPreference({ key: 'wc.favoritIntyg', value: JSON.stringify(favorites) }))
  }

  // const convertStringToArray = (input: string) => {
  //   const string = input
  //   const cleanString = string.replace(/\[|\]|"/g, '')
  //   const array = cleanString.split(',')
  //   return array
  // }

  useEffect(() => {
    dispatch(fetchCertificateTypes())
  }, [dispatch])

  return (
    <div className="ic-container iu-mt-gutter">
      <h2 className="iu-mb-05rem">Skapa intyg</h2>
      <CertificateBox className="iu-shadow-sm iu-flex iu-flex-column">
        {certificateTypes.map((certificateType, index) => (
          <CertificateListRow
            certificateName={certificateType.label}
            certificateInfo={certificateType.detailedDescription}
            id={certificateType.id}
            favoriteClick={handleFavoriteClick}
            key={index}
          />
        ))}
      </CertificateBox>
    </div>
  )
}

export default CreateCertificate
