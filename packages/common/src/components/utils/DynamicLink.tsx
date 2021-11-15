import React from 'react'
import { CustomTooltip } from '@frontend/common'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

interface Props {
  link: DynamicLinkData
}

const DynamicLink: React.FC<Props> = ({ link }) => {
  return (
    <>
      {link ? (
        <>
          <Link target={link.target} to={link.url} className={'ic-link ic-link-external'}>
            <span data-tip={link.tooltip}>{link.text}</span>
            <FontAwesomeIcon icon={faExternalLinkAlt} className="iu-ml-200 iu-fs-100" />
          </Link>
          <CustomTooltip />
        </>
      ) : (
        <span className="iu-fs-200">{'WARNING: could not resolve dynamic link'}</span>
      )}
    </>
  )
}

export default DynamicLink
