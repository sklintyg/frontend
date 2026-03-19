import { IDSHeader1177Admin, IDSHeader1177AdminItem } from '@inera/ids-react'
import { useGetConfigQuery, useGetUserQuery } from '../../../store/api'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { AboutHeaderItem } from './AboutHeaderItem'
import { HeaderAvatarMenu } from './HeaderAvatarMenu'
import { LayoutHeaderNav } from './LayoutHeaderNav'
import { LayoutMobileMenu } from './LayoutMobileMenu/LayoutMobileMenu'

export function LayoutHeader() {
  const { isLoading, data: user } = useGetUserQuery()
  const { data: config } = useGetConfigQuery()
  const name = `${user?.namn}${user && isUserDoctor(user) ? ` - Läkare` : ''}`
  const unit = user?.valdVardenhet?.namn ?? ''

  return (
    <IDSHeader1177Admin
      className="print:hidden"
      brandText="Rehabstöd"
      skipToContentLink={<a href="#content">Till sidans huvudinnehåll</a>}
      items={!isLoading && user ? <AboutHeaderItem /> : undefined}
      avatar={
        !isLoading && !user ? (
          <IDSHeader1177AdminItem icon="user" mobile>
            <a href={config?.sithsIdpUrl}>Logga in</a>
          </IDSHeader1177AdminItem>
        ) : !isLoading && user ? (
          <HeaderAvatarMenu name={name} unit={unit} />
        ) : undefined
      }
      mobileMenu={<LayoutMobileMenu name={name} unit={unit} />}
    >
      {user && <LayoutHeaderNav />}
    </IDSHeader1177Admin>
  )
}
