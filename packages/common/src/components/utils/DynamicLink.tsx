import React from 'react'
import { ButtonTooltip } from '@frontend/common'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'

interface Props {
  link: DynamicLinkData
}

const DynamicLink: React.FC<Props> = ({ link }) => {
  return (
    <>
      {link ? (
        <Link target={link.target} to={link.url}>
          {link.tooltip ? (
            <ButtonTooltip description={link.tooltip}>
              <p>{link.text}</p>
            </ButtonTooltip>
          ) : (
            <p>{link.text}</p>
          )}
        </Link>
      ) : (
        <p className="iu-fs-200">{'WARNING: could not resolve dynamic link'}</p>
      )}
    </>
  )
}

export default DynamicLink
