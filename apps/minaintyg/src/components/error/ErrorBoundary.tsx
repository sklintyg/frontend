import { randomUUID } from '@frontend/utils'
import { useMemo } from 'react'
import { ErrorPageHero } from './ErrorPageHero'

export function ErrorBoundary() {
  const id = useMemo(randomUUID, [])
  return <ErrorPageHero id={id} type="unknown" />
}
