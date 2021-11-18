import React from 'react'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ExternalLinkIcon from '../image/ExternalLinkIcon'

interface Props {
  link: DynamicLinkData
}

const DynamicLink: React.FC<Props> = ({ link }) => {
  return (
    <>
      {link ? (
        <>
          <Link target={link.target} to={{ pathname: link.url }} className={'ic-link ic-link-external'}>
            <span data-tip={link.tooltip}>{link.text}</span>
            <ExternalLinkIcon className="iu-ml-200 iu-fs-100" />
          </Link>
        </>
      ) : (
        <span>{'WARNING: could not resolve dynamic link'}</span>
      )}
    </>
  )
}

export default DynamicLink
