import React, { ComponentProps } from 'react'
import { useSelector } from 'react-redux'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import PatientSearch from '../components/patient/PatientSearch'
import { getUser } from '../store/user/userSelectors'
import { ResourceAccess } from '../utils/ResourceAccess'
import { ResourceLinkType } from '../types'

const SearchPage: React.FC = () => {
  const user = useSelector(getUser)

  return (
    <>
      {user && (
        <CommonLayout header={<WebcertHeader />}>
          <PatientSearch />
        </CommonLayout>
      )}
    </>
  )
}
export const SearchPageWithRedirect: React.FC<ComponentProps<typeof SearchPage>> = () => (
  <ResourceAccess linkType={ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE}>
    <SearchPage />
  </ResourceAccess>
)
