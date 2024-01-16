import React from 'react'
import styled from 'styled-components'
import externalLink from '../../../images/external_link.svg'
import externalLinkLight from '../../../images/external_link_light.svg'

interface Props {
  className: string
  light?: boolean
}

const Img = styled.img`
  display: unset;
  margin-top: 2px;
  vertical-align: middle;
  position: relative;
  bottom: 2px;
`

const ExternalLinkIcon: React.FC<Props> = ({ className, light }) => {
  return <Img src={light ? externalLinkLight : externalLink} className={className} />
}

export default ExternalLinkIcon
