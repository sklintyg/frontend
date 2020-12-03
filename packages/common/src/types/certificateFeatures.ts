import { ResourceLinkType } from './resourceLink'
import { ReactNode } from 'react'

interface CertificateFeatures {
  activateWhen: ResourceLinkType
  component: ReactNode
  name: string
  description: string
  icon: ReactNode
}
