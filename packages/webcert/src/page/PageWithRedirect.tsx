import React, { useEffect, useState } from 'react'
import { ResourceLinkType } from '@frontend/common'
import { getUser, getUserResourceLinks } from '../store/user/userSelectors'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

interface Props {
  page: React.ReactNode
  linkType: ResourceLinkType
}

const PageWithRedirect: React.FC<Props> = ({ page, linkType }) => {
  const user = useSelector(getUser)
  const userLinks = useSelector(getUserResourceLinks)
  const [renderPage, setRenderPage] = useState(false)

  useEffect(() => {
    if (!user || !userLinks.some((link) => link.type === linkType)) {
      setRenderPage(false)
    } else {
      setRenderPage(true)
    }
  }, [user, userLinks, linkType])

  return <>{renderPage ? page : <Redirect to="/" />}</>
}
export default PageWithRedirect
