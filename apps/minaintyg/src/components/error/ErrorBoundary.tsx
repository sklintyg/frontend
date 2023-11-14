import { randomUUID } from '@frontend/utils'
import { useMemo } from 'react'
import { ErrorPageHero } from './ErrorPageHero'

export function ErrorBoundary() {
  const id = useMemo(randomUUID, [])
  // TODO: useEffect hook that logs error back to the backend.
  return <ErrorPageHero id={id} type="unknown" />
}
