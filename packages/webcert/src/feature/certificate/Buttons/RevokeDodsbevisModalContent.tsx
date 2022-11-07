import { InfoBox } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { getIsLocked } from '../../../store/certificate/certificateSelectors'

export const RevokeDodsbevisModalContent: React.FC = () => {
  const locked = useSelector(getIsLocked)

  return (
    <>
      <InfoBox type="info" activateIconWrap>
        <p>
          {locked
            ? 'Om du behöver korrigera innehållet i utkastet, ska du istället kopiera utkastet och skapa ett nytt intyg.'
            : 'Du ska endast makulera om intyget är utfärdat på fel person. Om du behöver ändra innehållet i intyget ska du välja ”Avbryt” och därefter välja ”Ersätt”.'}
        </p>
      </InfoBox>
      {locked ? (
        <p>Genom att trycka på "Makulera" makulerar du det låsta utkastet i Webcert. </p>
      ) : (
        <>
          <p>För att makulera ett dödsbevis som är inskickat på fel person behöver du göra följande:</p>
          <ol>
            <li>
              Genom att trycka på ”Makulera” makulerar du dödsbeviset i Webcert, men detta kommer inte att återkalla dödsbeviset hos
              Skatteverket.
            </li>
            <li>
              <span className="iu-fw-bold">
                Förutom att trycka på ”Makulera” måste du omedelbart ta kontakt med Skatteverket så att felet kan åtgärdas.
              </span>{' '}
              Du tar kontakt med Skatteverket genom att ringa Skatteupplysningen på telefon <span className="iu-fw-bold">0771-567 567</span>{' '}
              och ange "folkbokföring - dödsfall".
            </li>
          </ol>
        </>
      )}
    </>
  )
}
