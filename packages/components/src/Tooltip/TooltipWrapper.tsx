import { useContext, type ReactNode } from 'react'
import { ThemeContext } from '../theme/ThemeContext'

export function TooltipWrapper({ children }: { children: ReactNode }) {
  const theme = useContext(ThemeContext)

  return (
    <div
      style={{
        color: theme === 'inera-admin' ? 'var(--IDS-COLOR-NEUTRAL-20)' : '#000',
        borderColor: theme === 'inera-admin' ? 'var(--IDS-COLOR-NEUTRAL-40)' : 'var(--color-stone-clear)',
      }}
      className="pointer-events-none z-50 max-w-xs whitespace-normal rounded border bg-white px-5 py-3 text-base font-normal shadow-[0_0_10px_rgba(0,0,0,0.3)] md:max-w-sm"
    >
      {children}
    </div>
  )
}
