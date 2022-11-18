import { InfoBox } from '@frontend/common'
import _ from 'lodash'
import React from 'react'
import { useSelector } from 'react-redux'
import { getCertificateMetaData, getIsLocked } from '../../../store/certificate/certificateSelectors'

export const RevokeDBAndDOIModalContent: React.FC = () => {
  const locked = useSelector(getIsLocked)
  const metadata = useSelector(getCertificateMetaData, _.isEqual)
  const isDodsbevis = metadata?.type === 'db'
  const isDodsorsaksIntyg = metadata?.type === 'doi'

  return (
    <>
      <InfoBox type="info" activateIconWrap>
        {locked ? (
          <>
            <p>Om du behöver korrigera innehållet i utkastet, ska du istället kopiera utkastet och skapa ett nytt intyg.'</p>
          </>
        ) : (
          <>
            <p>
              <span className="iu-fw-bold">Du ska endast makulera om intyget är utfärdat på fel person.</span> Om du behöver ändra
              innehållet i intyget ska du välja ”Avbryt” och därefter välja ”Ersätt”.
            </p>
          </>
        )}
      </InfoBox>
      {(isDodsbevis || isDodsorsaksIntyg) && locked ? (
        <p>Genom att trycka på "Makulera" makulerar du det låsta utkastet i Webcert. </p>
      ) : isDodsbevis ? (
        <>
          <p>För att makulera ett dödsbevis som är skickat på fel person måste du genomföra följande två steg:</p>
          <ol>
            <li>
              Tryck på ”Makulera”, detta leder till att dödsbeviset makuleras i Webcert men återkallar{' '}
              <span className="iu-fw-bold">inte</span> dödsbeviset hos Skatteverket.
            </li>
            <li>
              <span className="iu-fw-bold">Kontakta omedelbart Skatteverket</span> på telefon{' '}
              <span className="iu-fw-bold">0771-567 567</span> (Skatteupplysningen) och ange "folkbokföring - dödsfall", för att begära att
              intyget även makuleras hos dem.
            </li>
          </ol>
        </>
      ) : (
        <>
          <p>För att makulera ett dödsorsaksintyg som är skickat på fel person måste du genomföra följande två steg:</p>
          <ol>
            <li>
              Tryck på ”Makulera”, detta leder till att dödsorsaksintyget makuleras i Webcert men återkallar{' '}
              <span className="iu-fw-bold">inte</span> dödsorsaksintyget hos Socialstyrelsen.
            </li>
            <li>
              <span className="iu-fw-bold">Kontakta omedelbart Socialstyrelsen</span> (Dödsorsaksproduktionen) på telefon{' '}
              <span className="iu-fw-bold">075-247 39 00 </span>för att begära att intyget även makuleras hos dem.
            </li>
          </ol>
        </>
      )}
    </>
  )
}
