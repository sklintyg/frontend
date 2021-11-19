import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

interface Props {
  iconType: string
  includeTooltip?: boolean
}

const Icon: React.FC<Props> = ({ iconType, includeTooltip }) => {
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
    <FontAwesomeIcon icon={icon} className="iu-color-main iu-mr-300" size="lg" data-tip={includeTooltip ? getIconTooltip(iconType) : ''} />
  )
}

export default Icon
