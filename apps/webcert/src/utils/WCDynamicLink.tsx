import { DynamicLink } from '@frontend/common'
import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getDynamicLink } from '../store/utils/utilsSelectors'

interface Props {
  linkKey: string
  light?: boolean
}

const WCDynamicLink: React.FC<Props> = ({ linkKey, light }) => {
  const link = useSelector(getDynamicLink(linkKey), shallowEqual)

  return <DynamicLink link={link} light={light} />
}

export default WCDynamicLink
