import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { CustomTooltip } from '../index'

interface Props {
  id: string
  includeTooltip?: boolean
}

const Icon: React.FC<Props> = ({ id, includeTooltip }) => {
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
        return 'Funktionen är ett stöd i ifyllnad och bedömning.'
      default:
        return ''
    }
  }

  const icon = getIconName(id)

  if (!icon) {
    return null
  }

  return (
    <>
      <FontAwesomeIcon icon={icon} className="iu-color-main iu-mr-300" size="lg" data-tip={includeTooltip ? getIconTooltip(id) : ''} />
      {includeTooltip && <CustomTooltip />}
    </>
  )
}

export default Icon
