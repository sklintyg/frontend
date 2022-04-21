import * as React from 'react'

import { BoxShadowContainer } from '../../styles/styledComponents'

interface Props {
  title: string
  description: string
}

const ListHeader: React.FC<Props> = ({ title, description }) => {
  return (
    <BoxShadowContainer>
      <div className="ic-container iu-py-300">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </BoxShadowContainer>
  )
}

export default ListHeader
