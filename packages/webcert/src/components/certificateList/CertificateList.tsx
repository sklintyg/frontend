import React, { ChangeEvent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { getCertificateTypes, setUserPreference } from '../../store/user/userActions'
import { getUserPreference } from '../../store/user/userSelectors'
import CertificateListRow from './CertificateListRow'

const CreateCertificate: React.FC = () => {
  const [favorites, setFavorites] = useState<Array<string>>([])
  const dispatch = useDispatch()
  const userPreferences = useSelector(getUserPreference('wc.favoritIntyg'))

  const CertificateBox = styled.div`
    max-width: 75%;
    max-height: 32em;
    overflow-y: auto;
  `

  const handleFavoriteClick = (event: ChangeEvent<HTMLButtonElement>) => {
    setFavorites([...favorites, event.currentTarget.id])
    dispatch(setUserPreference({ key: 'wc.favoritIntyg', value: JSON.stringify(favorites) }))
  }

  const convertStringToArray = (input: string) => {
    const string = input
    const cleanString = string.replace(/\[|\]|"/g, '')
    const array = cleanString.split(',')
    return array
  }

  useEffect(() => {
    if (userPreferences) {
      console.log(userPreferences)
      convertStringToArray(userPreferences)
      setFavorites(convertStringToArray(userPreferences))
    }
  }, [userPreferences])

  useEffect(() => {
    dispatch(getCertificateTypes())
  })

  return (
    <div className="ic-container iu-mt-gutter">
      <h2 className="iu-mb-05rem">Skapa intyg</h2>
      <CertificateBox className="iu-shadow-sm iu-flex iu-flex-column">
        <CertificateListRow
          certificateName="Intygets namn"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00213"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 2"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00214"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 3"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00215"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 4"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00216"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 5"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00217"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 6"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00218"
          favoriteClick={handleFavoriteClick}
        />
        <CertificateListRow
          certificateName="Intyg 7"
          certificateInfo="Här kommer en text om respektive intyg. hej!"
          id="af00219"
          favoriteClick={handleFavoriteClick}
        />
      </CertificateBox>
    </div>
  )
}

export default CreateCertificate
