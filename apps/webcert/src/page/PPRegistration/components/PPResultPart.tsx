import { classNames } from '@frontend/components'
import { isEmpty } from 'lodash-es'

export function PPResultPart({ title, value, fallback = 'Ej angivet' }: { title: string; value?: string; fallback?: string }) {
  return (
    <div>
      <p className="font-semibold m-0">{title}</p>
      <p className={classNames('mt-0 mb-3', !value && 'italic')}>{isEmpty(value) ? fallback : value}</p>
    </div>
  )
}
