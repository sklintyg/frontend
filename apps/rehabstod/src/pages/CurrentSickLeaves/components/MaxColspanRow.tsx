import { ReactNode } from 'react'

export function MaxColspanRow({ children, colspan }: { children: ReactNode; colspan: number }) {
  return (
    <tr>
      <td colSpan={colspan}>{children}</td>
    </tr>
  )
}
