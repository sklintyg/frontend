import type React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import DynamicLink from '../components/utils/DynamicLink'
import { getDynamicLink } from '../store/utils/utilsSelectors'

interface Props {
  linkKey: string
  light?: boolean
}

const WCDynamicLink = ({ linkKey, light }: Props) => {
  const link = useSelector(getDynamicLink(linkKey), shallowEqual)

  return <DynamicLink link={link} light={light} />
}

export default WCDynamicLink
