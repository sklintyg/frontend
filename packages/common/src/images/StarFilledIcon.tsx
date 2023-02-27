import React, { ComponentProps } from 'react'
import { SVGIcon } from './SVGIcon'

export const StarFilledIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 41" {...props}>
    <path
      d="M22.2981 2.59977C21.4479 0.464139 18.5521 0.46414 17.7019 2.59977L14.0004 11.8973C13.642 12.7977 12.8316 13.4128 11.9012 13.4907L2.29359 14.2954C0.0867348 14.4803 -0.808112 17.3576 0.873276 18.8623L8.19327 25.4132C8.9021 26.0476 9.21166 27.0429 8.9951 27.9914L6.75872 37.7863C6.24503 40.0362 8.58777 41.8144 10.4771 40.6088L18.7026 35.3599C19.4991 34.8516 20.5009 34.8516 21.2974 35.3599L29.5229 40.6088C31.4122 41.8144 33.755 40.0362 33.2413 37.7863L31.0049 27.9914C30.7883 27.0429 31.0979 26.0476 31.8067 25.4132L39.1267 18.8623C40.8081 17.3576 39.9133 14.4803 37.7064 14.2954L28.0988 13.4907C27.1684 13.4128 26.358 12.7977 25.9996 11.8973L22.2981 2.59977Z"
      fill="currentColor"
    />
  </SVGIcon>
)
