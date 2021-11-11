import React from 'react'
import { CustomTooltip } from '@frontend/common'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'

interface Props {
  link: DynamicLinkData
}

const DynamicLink: React.FC<Props> = ({ link }) => {
  return (
    <>
      {link ? (
        <>
          <Link target={link.target} to={link.url}>
            <span data-tip={link.tooltip}>{link.text}</span>
          </Link>
          <CustomTooltip />
        </>
      ) : (
        <p className="iu-fs-200">{'WARNING: could not resolve dynamic link'}</p>
      )}
    </>
  )
}

export default DynamicLink
