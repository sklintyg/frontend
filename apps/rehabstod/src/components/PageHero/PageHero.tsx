import { IDSIcon } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function PageHero({ icon, children }: { icon?: string; children?: ReactNode }) {
  return (
    <div className="ids-content mx-auto max-w-screen-md py-24 text-center">
      {icon && (
        <div className="bg-secondary-90 text-primary-40 mb-7 inline-block rounded-full py-5 px-6">
          <IDSIcon name={icon} height="3.75rem" width="3.125rem" color="currentColor" color2="currentColor" />
        </div>
      )}
      {children}
    </div>
  )
}
