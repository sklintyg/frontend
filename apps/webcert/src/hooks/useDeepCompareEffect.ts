/* eslint-disable no-console */
import { isEqual } from 'lodash'
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

const isPrimitive = (val: unknown) => val !== Object(val)

export const useDeepCompareEffect = <TDeps extends DependencyList>(effect: EffectCallback, deps: TDeps): void => {
  if (import.meta.env.MODE !== 'production') {
    if (!(deps instanceof Array) || !deps.length) {
      console.warn('`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead.')
    }

    if (deps.every(isPrimitive)) {
      console.warn(
        '`useDeepCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.'
      )
    }
  }

  const ref = useRef<TDeps | undefined>(undefined)

  if (!ref.current || !isEqual(deps, ref.current)) {
    ref.current = deps
  }

  useEffect(effect, ref.current)
}
