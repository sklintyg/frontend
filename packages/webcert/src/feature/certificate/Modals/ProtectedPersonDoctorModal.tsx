import React from 'react'
import styled from 'styled-components'
import { InfoBox, TextWithInfoModal } from '@frontend/common/src'

const ItalicLink = styled.span`
  a {
    font-style: italic;
    font-size: 13px;
  }
`

const ProtectedPersonDoctorModal: React.FC = ({}) => {
  return (
    <ItalicLink>
      {' '}
      -{' '}
      <TextWithInfoModal text={'Skyddade personuppgifter'} modalTitle={'Användning av Webcert med skyddade personuppgifter'}>
        <InfoBox type={'info'}>
          <p>Du har skyddade personuppgifter.</p>
        </InfoBox>
        <p className={'iu-fw-bold iu-pt-300'}>Att använda Webcert med skyddade personuppgifter innebär:</p>
        <ul className={'iu-flex-column'}>
          <li className={'iu-py-300'}>
            När du signerar ett intyg kommer ditt namn och information om den vårdgivare och vårdenhet intyget är utfärdat på att vara
            synligt.
          </li>
          <li>Vid kommunikation med Försäkringskassan kring ett intyg kommer ditt namn att vara synligt.</li>
        </ul>{' '}
        <p className={'iu-py-300'}>Detta kan göra att information om dig och var du arbetar kan spridas.</p>
      </TextWithInfoModal>
    </ItalicLink>
  )
}

export default ProtectedPersonDoctorModal
