import type { ReactNode } from 'react'
import Spinner from '../../../components/utils/Spinner'
import { useAppSelector } from '../../../store/store'
import { selectIsLoadingUser } from '../../../store/user/userSelectors'
import { PPSubHeader } from './PPSubHeader'

export function PPPage({ subHeader, children }: { subHeader: string; children: ReactNode }) {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)

  return (
    <>
      <PPSubHeader>{subHeader}</PPSubHeader>
      <div className="px-10 pt-5 pb-10">
        <div className="w-[620px]">{isLoadingUser ? <Spinner /> : children}</div>
      </div>
    </>
  )
}
