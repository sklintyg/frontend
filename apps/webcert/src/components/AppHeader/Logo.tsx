import type React from 'react'

interface Props {
  imgSrc: string
  imgAlt?: string
  additionalImgStyles?: string
  additionalWrapperStyles?: string
}

const Logo: React.FC<Props> = ({ imgSrc, imgAlt, additionalImgStyles }) => {
  return (
    <figure className="iu-bg-main">
      <img src={imgSrc} alt={imgAlt} className={`${additionalImgStyles}`} />
    </figure>
  )
}

export default Logo
