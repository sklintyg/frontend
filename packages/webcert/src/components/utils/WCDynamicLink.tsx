import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getDynamicLink } from '@frontend/webcert/src/store/utils/utilsSelectors'
import { DynamicLink } from '@frontend/common'

interface Props {
  linkKey: string
  light?: boolean
}

const WCDynamicLink: React.FC<Props> = ({ linkKey, light }) => {
  const link = useSelector(getDynamicLink(linkKey), shallowEqual)

  return <DynamicLink link={link} light={light} />
}

export default WCDynamicLink
