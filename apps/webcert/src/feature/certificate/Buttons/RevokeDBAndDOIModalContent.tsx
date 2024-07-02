import { isEqual } from 'lodash-es'
import type React from 'react'
import { useSelector } from 'react-redux'
import InfoBox from '../../../components/utils/InfoBox'
import { getCertificateMetaData, getIsLocked } from '../../../store/certificate/certificateSelectors'

export const RevokeDBAndDOIModalContent: React.FC = () => {
  const locked = useSelector(getIsLocked)
  const metadata = useSelector(getCertificateMetaData, isEqual)
  const isDodsbevis = metadata?.type === 'db'
  const isDodsorsaksIntyg = metadata?.type === 'doi'

  return (
    <>
      <InfoBox type="info" activateIconWrap>
        {locked ? (
          <p>Om du behöver korrigera innehållet i utkastet, ska du istället kopiera utkastet och skapa ett nytt intyg.</p>
        ) : (
          <p>
            <span className="iu-fw-bold">Du ska endast makulera om intyget är utfärdat på fel person.</span> Om du behöver ändra innehållet
            i intyget ska du välja ”Avbryt” och därefter välja ”Ersätt”.
          </p>
        )}
      </InfoBox>
      {(isDodsbevis || isDodsorsaksIntyg) && locked ? (
        <p>Genom att trycka på "Makulera" makulerar du det låsta utkastet i Webcert. </p>
      ) : isDodsbevis ? (
        <>
          <p>För att makulera ett dödsbevis som är skickat på fel person måste du genomföra följande två steg:</p>
          <ol>
            <li>
              <b>Kontakta omedelbart Skatteverket</b> på telefon <b style={{ whiteSpace: 'nowrap' }}>010-574 94 89</b> för att begära att
              intyget makuleras. <br />
              <i>OBS! telefonnumret gäller endast för att makulera Dödsbevis, inga andra frågor.</i>
            </li>
            <li>Tryck på "Makulera" för att makulera dödsbeviset i Webcert.</li>
          </ol>
        </>
      ) : (
        <>
          <p>För att makulera ett dödsorsaksintyg som är skickat på fel person måste du genomföra följande två steg:</p>
          <ol>
            <li>
              Kontakta omedelbart Socialstyrelsen (Dödsorsaksproduktionen) på telefon <b style={{ whiteSpace: 'nowrap' }}>075-247 39 00</b>{' '}
              för att begära att intyget makuleras.
            </li>
            <li>Tryck på "Makulera" för att makulera dödsorsaksintyget i Webcert.</li>
          </ol>
        </>
      )}
    </>
  )
}
