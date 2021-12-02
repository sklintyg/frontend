import React from 'react'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

interface Props {
  iconType: string
  includeTooltip?: boolean
  size?: FontAwesomeIconProps['size']
}

const Icon: React.FC<Props> = ({ iconType, includeTooltip, size }) => {
  const getIconName = (id: string) => {
    switch (id) {
      case 'lightbulb_outline':
        return faLightbulb
      default:
        return undefined
    }
  }

  const getIconTooltip = (id: string) => {
    switch (id) {
      case 'lightbulb_outline':
        return 'Funktionen är ett stöd för ifyllnad och bedömning.'
      default:
        return ''
    }
  }

  const icon = getIconName(iconType)

  if (!icon) {
    return null
  }

  return (
    <FontAwesomeIcon
      icon={icon}
      className={`iu-color-main iu-mr-300 ${size === 'sm' ? 'iu-mt-200' : ''}`}
      size={size ? size : 'lg'}
      data-tip={includeTooltip ? getIconTooltip(iconType) : ''}
    />
  )
}

export default Icon
