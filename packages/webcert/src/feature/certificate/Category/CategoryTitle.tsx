import React from 'react'

interface Props {
  titleId?: string
}

const CategoryTitle: React.FC<Props> = (props) => {
  return (
    <h3 id={props.titleId} className={`iu-fs-400 iu-color-black iu-fw-heading`}>
      {props.children}
    </h3>
  )
}

export default CategoryTitle
