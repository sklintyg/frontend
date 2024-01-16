import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getDynamicLink } from '../store/utils/utilsSelectors'
import DynamicLink from '../components/utils/DynamicLink'

interface Props {
  linkKey: string
  light?: boolean
}

const WCDynamicLink: React.FC<Props> = ({ linkKey, light }) => {
  const link = useSelector(getDynamicLink(linkKey), shallowEqual)

  return <DynamicLink link={link} light={light} />
}

export default WCDynamicLink
