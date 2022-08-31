import React from 'react'
import { DynamicLinkData } from '../../types/utils'
import { Link } from 'react-router-dom'
import ExternalLinkIcon from '../image/ExternalLinkIcon'
import styled from 'styled-components'

interface Props {
  link: DynamicLinkData
  light?: boolean
}

const Wrapper = styled.span`
  white-space: nowrap;
`

const DynamicLink: React.FC<Props> = ({ link, light }) => {
  return (
    <>
      {link ? (
        <Wrapper>
          <Link target={link.target} to={{ pathname: link.url }} className={`ic-link ic-link-external ${light ? 'iu-color-white' : ''}`}>
            <span data-tip={link.tooltip}>{link.text}</span>
            <ExternalLinkIcon className="iu-ml-200 iu-fs-100" light={light} />
          </Link>
        </Wrapper>
      ) : (
        <span>{'WARNING: could not resolve dynamic link'}</span>
      )}
    </>
  )
}

export default DynamicLink
