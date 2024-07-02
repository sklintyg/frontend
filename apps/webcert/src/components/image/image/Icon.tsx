import type React from 'react'
import styled from 'styled-components'
import { LightbulpIcon } from '../../../images'

interface Props {
  iconType: string
  includeTooltip?: boolean
  size?: 'sm' | 'lg'
}

const StyledLightbulpIcon = styled(LightbulpIcon)`
  height: 1rem;
  width: 1rem;
`

const Icon: React.FC<Props> = ({ iconType, includeTooltip, size }) => {
  const getIconTooltip = (id: string) => {
    switch (id) {
      case 'lightbulb_outline':
        return 'Funktionen är ett stöd för ifyllnad och bedömning.'
      default:
        return ''
    }
  }

  switch (iconType) {
    case 'lightbulb_outline':
      return (
        <StyledLightbulpIcon
          className={`iu-color-main ${size === 'sm' ? 'iu-mr-200' : 'iu-mr-300'}`}
          size={size}
          data-tip={includeTooltip ? getIconTooltip(iconType) : ''}
        />
      )
    default:
      return null
  }
}

export default Icon
