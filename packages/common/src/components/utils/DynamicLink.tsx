import React from 'react'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'
import ExternalLinkIcon from '../image/ExternalLinkIcon'

interface Props {
  link: DynamicLinkData
  light?: boolean
}

const DynamicLink: React.FC<Props> = ({ link, light }) => {
  return (
    <>
      {link ? (
        <Link target={link.target} to={{ pathname: link.url }} className={`ic-link ic-link-external ${light ? 'iu-color-white' : ''}`}>
          <span data-tip={link.tooltip}>{link.text}</span>
          <ExternalLinkIcon className="iu-ml-200 iu-fs-100" light={light} />
        </Link>
      ) : (
        <span>{'WARNING: could not resolve dynamic link'}</span>
      )}
    </>
  )
}

export default DynamicLink
