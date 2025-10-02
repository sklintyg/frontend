import { randomUUID } from '@frontend/utils'
import { IDSContainer } from '@inera/ids-react'
import { createContext, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { ErrorIdentifier } from '../../components/error/ErrorIdentifier'
import { PageHero } from '../../components/PageHero/PageHero'
import { StartPageLink } from '../../components/PageHero/StartPageLink'

export const ErrorContext = createContext<string | null>(null)

export function Error() {
  const { current: errorId } = useRef(randomUUID())

  return (
    <IDSContainer>
      <PageHero type="error">
        <ErrorContext.Provider value={errorId}>
          <Outlet />
        </ErrorContext.Provider>
        <div className="mb-6">
          <ErrorIdentifier id={errorId} />
        </div>
        <div className="mb-5 block h-px w-12 bg-neutral-40 md:hidden" />
        <StartPageLink />
      </PageHero>
    </IDSContainer>
  )
}
