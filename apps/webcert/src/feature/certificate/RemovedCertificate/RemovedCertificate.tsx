import type React from 'react'
import trashImg from '../../../images/trash.svg'
import CenteredImageWithContent from '../../../components/image/CenteredImageWithContent'

const RemovedCertificate: React.FC = () => {
  return (
    <CenteredImageWithContent imgSrc={trashImg}>
      <figcaption>Utkastet är borttaget</figcaption>
    </CenteredImageWithContent>
  )
}

export default RemovedCertificate
