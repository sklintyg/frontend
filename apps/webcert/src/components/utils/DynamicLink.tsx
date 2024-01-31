import React from 'react'
import styled from 'styled-components'
import { DynamicLinkData } from '../../types/utils'
import ExternalLinkIcon from '../image/image/ExternalLinkIcon'

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
          <a target={link.target} href={link.url} className={`ic-link ic-link-external ${light ? 'iu-color-white' : ''}`}>
            <span data-tip={link.tooltip}>{link.text}</span>
            <ExternalLinkIcon className="iu-ml-200 iu-fs-100" light={light} />
          </a>
        </Wrapper>
      ) : (
        <span>{'WARNING: could not resolve dynamic link'}</span>
      )}
    </>
  )
}

export default DynamicLink
