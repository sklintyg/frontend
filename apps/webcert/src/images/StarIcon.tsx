import type { ComponentProps } from 'react';
import type React from 'react'
import { SVGIcon } from './SVGIcon'

export const StarIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 41" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.1414 12.6371L20.4399 3.33952C20.3764 3.17978 20.2971 3.10596 20.2389 3.06751C20.1726 3.02373 20.0899 2.99805 20 2.99805C19.9101 2.99805 19.8274 3.02373 19.7611 3.06751C19.7029 3.10596 19.6236 3.17978 19.56 3.33952L15.8586 12.6371C15.2331 14.2081 13.79 15.3396 12.0681 15.4838L2.46051 16.2885C2.34471 16.2982 2.27251 16.3361 2.21489 16.3861C2.14743 16.4446 2.07718 16.5426 2.03511 16.6779C1.94887 16.9552 2.02001 17.2046 2.20703 17.372L9.52703 23.9229C10.7932 25.056 11.3188 26.799 10.9449 28.4366L8.70854 38.2315C8.63743 38.543 8.75432 38.77 8.92599 38.9003C9.01401 38.9671 9.0989 38.9931 9.16195 38.9973C9.21238 39.0008 9.28875 38.9946 9.40128 38.9228L17.6268 33.6739C19.0794 32.7469 20.9206 32.7469 22.3732 33.6739L30.5987 38.9228C30.7113 38.9946 30.7876 39.0008 30.8381 38.9973C30.9011 38.9931 30.986 38.9671 31.074 38.9003C31.2457 38.77 31.3626 38.543 31.2915 38.2315L29.0551 28.4366C28.6812 26.799 29.2069 25.056 30.473 23.9229L37.793 17.372C37.98 17.2046 38.0511 16.9552 37.9649 16.6779C37.9228 16.5426 37.8526 16.4446 37.7851 16.3861C37.7275 16.3361 37.6553 16.2982 37.5395 16.2885L27.9319 15.4838C26.21 15.3396 24.7669 14.2081 24.1414 12.6371ZM22.2981 2.59977C21.4479 0.464139 18.5521 0.46414 17.7019 2.59977L14.0004 11.8973C13.642 12.7977 12.8316 13.4128 11.9012 13.4907L2.29359 14.2954C0.0867348 14.4803 -0.808112 17.3576 0.873276 18.8623L8.19327 25.4132C8.9021 26.0476 9.21166 27.0429 8.9951 27.9914L6.75872 37.7863C6.24503 40.0362 8.58777 41.8144 10.4771 40.6088L18.7026 35.3599C19.4991 34.8516 20.5009 34.8516 21.2974 35.3599L29.5229 40.6088C31.4122 41.8144 33.755 40.0362 33.2413 37.7863L31.0049 27.9914C30.7883 27.0429 31.0979 26.0476 31.8067 25.4132L39.1267 18.8623C40.8081 17.3576 39.9133 14.4803 37.7064 14.2954L28.0988 13.4907C27.1684 13.4128 26.358 12.7977 25.9996 11.8973L22.2981 2.59977Z"
      fill="currentColor"
    />
  </SVGIcon>
)
