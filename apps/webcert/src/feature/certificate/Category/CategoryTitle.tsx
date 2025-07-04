import type { ReactNode } from 'react'

interface Props {
  titleId?: string
  textColor?: 'iu-color-white' | null
  children: ReactNode
}

const CategoryTitle = ({ titleId, textColor, children }: Props) => {
  return (
    <h3 id={titleId} className={`iu-fs-400 ${textColor ? textColor : ''} iu-fw-heading`}>
      {children}
    </h3>
  )
}

export default CategoryTitle
