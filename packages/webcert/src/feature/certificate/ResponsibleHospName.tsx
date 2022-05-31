import * as React from 'react'
import { useSelector } from 'react-redux'
import userImage from '@frontend/common/src/images/user-image.svg'
import { getIsUnsigned, getResponsibleHospName } from '../../store/certificate/certificateSelectors'
import { isCareAdministrator } from '../../store/user/userSelectors'
import styled from 'styled-components/macro'

const Wrapper = styled.div`
  margin-top: 16px;
  margin-bottom: -20px;
`

const ResponsibleHospName: React.FC = () => {
  const isUnsigned = useSelector(getIsUnsigned())
  const isUserCareAdministrator = useSelector(isCareAdministrator)
  const responsibleHospName = useSelector(getResponsibleHospName)

  if (!isUnsigned || !isUserCareAdministrator) {
    return null
  }

  return (
    <Wrapper className={`iu-bg-grey-200 iu-radius-sm iu-text-right iu-flex iu-justify-end iu-p-400 iu-lh-narrow`}>
      <div>
        <p className="iu-fw-bold iu-fs-100">Ansvarig intygsutfärdare</p>
        <span className="iu-fs-200">{!responsibleHospName ? 'Ej angivet' : responsibleHospName}</span>
      </div>
      <div className="iu-mr-300 iu-ml-300 iu-svg-icon">
        <img src={userImage} alt="userImage" className={'iu-mr-100'} />
      </div>
    </Wrapper>
  )
}

export default ResponsibleHospName
