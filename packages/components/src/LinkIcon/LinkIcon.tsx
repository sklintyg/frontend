import type { ComponentProps, JSXElementConstructor } from 'react'
import { createElement } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LinkIcon<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>>({
  icon,
  ...props
}: { icon: T } & ComponentProps<T>) {
  return <span className="ids-link__icon">{createElement(icon, { width: '1em', height: '1em', color: 'currentColor', ...props })}</span>
}
