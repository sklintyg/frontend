import React from 'react'
import styled from 'styled-components'
import { CustomButton, TextWithInfoModal } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as star } from '@fortawesome/free-regular-svg-icons'
import { faStar as starChecked } from '@fortawesome/free-solid-svg-icons'

interface Props {
  certificateName: string
  certificateInfo: string
  id: string
  favoriteClick: (...args: any[]) => void
}

const CertificateListRow: React.FC<Props> = ({ certificateName, certificateInfo, id, favoriteClick }) => {
  // const [isFavorite, setIsFavorite] = useState(false)

  const Row = styled.div`
    border-bottom: #e0e0e0 1px solid;
  `

  const Star = styled.button`
    border: none;
    background: transparent;
    color: inherit;
  `

  const CertificateName = styled.div`
    flex: 1;
  `

  return (
    <Row className="iu-flex iu-flex-center iu-p-400">
      <Star className="iu-mr-1rem" onClick={favoriteClick} id={id}>
        <FontAwesomeIcon
          icon={star /*isFavorite ? starChecked : star*/}
          style={{ color: '#ccc' } /*isFavorite ? { color: '#f6bb42' } : { color: '#ccc' }*/}
        />
      </Star>
      <CertificateName>{certificateName}</CertificateName>
      <TextWithInfoModal text="Om intyget" modalTitle="Om intyget" additionalStyles="iu-mr-1rem">
        {certificateInfo}
      </TextWithInfoModal>
      <CustomButton buttonStyle="primary" type="button">
        Skapa intyg
      </CustomButton>
    </Row>
  )
}

export default CertificateListRow
