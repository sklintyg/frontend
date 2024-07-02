import type { RefObject } from 'react'
import { createContext, useContext } from 'react'

interface ICertificateContext {
  certificateContainerId: string
  certificateContainerRef: RefObject<HTMLDivElement>
}

export const CertificateContext = createContext<ICertificateContext | undefined>(undefined)

export const useCertificateContext = (): ICertificateContext => {
  const context = useContext(CertificateContext)
  if (context === undefined) {
    throw new Error('useCertificateContext must be within CertificateContext.Provider')
  }

  return context
}
