import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getIsUnsigned, getResourceLinks, getResponsibleHospName } from '../../store/certificate/certificateSelectors'
import { userImage } from '../../images'
import { ResourceLinkType } from '../../types'

const UserIcon = styled.img`
  max-height: 2rem;
`

const ResponsibleHospName: React.FC = () => {
  const isUnsigned = useSelector(getIsUnsigned())
  const responsibleHospName = useSelector(getResponsibleHospName)
  const links = useSelector(getResourceLinks)

  if (!isUnsigned || links.find((link) => link.type === ResourceLinkType.SIGN_CERTIFICATE)) {
    return null
  }

  return (
    <div className="iu-bg-grey-200 iu-radius-sm iu-text-right iu-flex iu-justify-end iu-p-400 iu-lh-narrow">
      <div>
        <p className="iu-fw-bold iu-fs-100">Ansvarig intygsutfärdare</p>
        <span className="iu-fs-200">{!responsibleHospName ? 'Ej angivet' : responsibleHospName}</span>
      </div>
      <div className="iu-mr-300 iu-ml-300 iu-svg-icon">
        <UserIcon src={userImage} alt="userImage" className={'iu-mr-100'} />
      </div>
    </div>
  )
}

export default ResponsibleHospName
