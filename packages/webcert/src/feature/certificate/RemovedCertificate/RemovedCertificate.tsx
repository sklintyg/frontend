import React from 'react'
import trashImg from '../../../images/trash.svg'
import styled from 'styled-components/macro'

const Image = styled.img`
  max-width: 130px;
  padding-top: 24px;
  padding-bottom: 8px;
`

const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const RemovedCertificate = () => {
  return (
    <div className={'iu-flex iu-flex-center'}>
      <Figure>
        <Image src={trashImg}></Image>
        <figcaption>Utkastet är borttaget</figcaption>
      </Figure>
    </div>
  )
}

export default RemovedCertificate
