import { ReactNode } from 'react'

export function MaxColspanRow({ colspan, children }: { colspan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colspan}>{children}</td>
    </tr>
  )
}
