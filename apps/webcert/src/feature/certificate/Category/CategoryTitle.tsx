import React from 'react'

interface Props {
  titleId?: string
  textColor?: 'iu-color-white' | null
}

const CategoryTitle: React.FC<Props> = ({ titleId, textColor, children }) => {
  return (
    <h3 id={titleId} className={`iu-fs-400 ${textColor ? textColor : ''} iu-fw-heading`}>
      {children}
    </h3>
  )
}

export default CategoryTitle
