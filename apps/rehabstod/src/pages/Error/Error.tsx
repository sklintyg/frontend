import { IDSContainer, IDSIconChevron, IDSLink } from '@frontend/ids-react-ts'
import { createContext, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { PageHero } from '../../components/PageHero/PageHero'
import { ErrorIdentifier } from '../../components/error/ErrorIdentifier/ErrorIdentifier'
import { uuidv4 } from '../../utils/uuidv4'

export const ErrorContext = createContext<string | null>(null)

export function Error() {
  const { current: errorId } = useRef(uuidv4())

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
        <div className="text-center">
          <IDSLink>
            <IDSIconChevron />
            <Link to="/">Till startsidan</Link>
          </IDSLink>
        </div>
      </PageHero>
    </IDSContainer>
  )
}
