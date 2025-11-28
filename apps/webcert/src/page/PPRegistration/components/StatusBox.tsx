import { classNames } from '@frontend/components'
import type { ReactNode } from 'react'
import { AttentionIcon } from '../../../images'

export function StatusBox({ type, children }: { type: 'INFO' | 'ERROR'; children: ReactNode }) {
  return (
    <div
      className={classNames(
        'flex flex-auto gap-5 p-4 border border-dashed mb-3 rounded-[10px]',
        type === 'INFO' && 'border-[#01A5A3] bg-[#E6F1F1]',
        type === 'ERROR' && 'border-[#DB0F00] bg-[#FFDAD7]'
      )}
      role={type === 'ERROR' ? 'alert' : undefined}
    >
      <div className="w-5 h-5 shrink-0">
        <AttentionIcon className="w-full h-full" />
      </div>
      <div>{children}</div>
    </div>
  )
}
