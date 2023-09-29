import { IDSHeader } from '@frontend/ids-react-ts'
import { useGetUserQuery } from '../../../store/api'
import { LayoutHeaderAvatar } from './LayoutHeaderAvatar'
import { LayoutHeaderNavigation } from './LayoutHeaderNavigation'

export function LayoutHeader() {
  const { data: user } = useGetUserQuery()

  return (
    <IDSHeader type="1177" hideregionpicker className="z-40 bg-white print:hidden">
      {user && (
        <>
          <LayoutHeaderAvatar />
          <LayoutHeaderNavigation />
        </>
      )}
    </IDSHeader>
  )
}
