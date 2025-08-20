import CenteredImageWithContent from '../../../components/image/CenteredImageWithContent'
import trashImg from '../../../images/trash.svg'

const RemovedCertificate = () => {
  return (
    <CenteredImageWithContent imgSrc={trashImg}>
      <figcaption>Utkastet är borttaget</figcaption>
    </CenteredImageWithContent>
  )
}

export default RemovedCertificate
