import { ReactNode } from 'react'

export function MaxColspanRow({ children, colspan }: { children: ReactNode; colspan: number }) {
  return (
    <tr>
      <td className="whitespace-pre-line" colSpan={colspan}>
        {children}
      </td>
    </tr>
  )
}
