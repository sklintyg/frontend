import { type ReactNode } from 'react'
import { useTheme } from '../theme/useTheme'
import { classNames } from '../utils/classNames'

export function TooltipWrapper({ children }: { children: ReactNode }) {
  const theme = useTheme()

  return (
    <div
      className={classNames(
        'pointer-events-none z-50 max-w-xs whitespace-normal rounded border bg-white px-5 py-3 text-base font-normal shadow-[0_0_10px_rgba(0,0,0,0.3)] md:max-w-sm',
        theme === 'inera-admin' && 'text-neutral-20 border-neutral-40',
        theme === '1177' && 'text-black border-neutral-50'
      )}
    >
      {children}
    </div>
  )
}
