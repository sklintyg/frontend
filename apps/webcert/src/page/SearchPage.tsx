import type React from 'react'
import type { ComponentProps } from 'react'
import CommonLayout from '../components/commonLayout/CommonLayout'
import WebcertHeader from '../components/header/WebcertHeader'
import PatientSearch from '../components/patient/PatientSearch'
import { useAppSelector } from '../store/store'
import { getUser } from '../store/user/userSelectors'
import { ResourceLinkType } from '../types'
import { ResourceAccess } from '../utils/ResourceAccess'

const SearchPage: React.FC = () => {
  const user = useAppSelector(getUser)

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
