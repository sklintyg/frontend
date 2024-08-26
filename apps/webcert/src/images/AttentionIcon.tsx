import type { ComponentProps } from 'react'
import type React from 'react'
import { SVGIcon } from './SVGIcon'

export const AttentionIcon = ({ ...props }: ComponentProps<typeof SVGIcon>): React.ReactElement => (
  <SVGIcon viewBox="0 0 40 41" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 38.8877C29.9411 38.8877 38 30.8288 38 20.8877C38 10.9466 29.9411 2.8877 20 2.8877C10.0589 2.8877 2 10.9466 2 20.8877C2 30.8288 10.0589 38.8877 20 38.8877ZM20 40.8877C31.0457 40.8877 40 31.9334 40 20.8877C40 9.842 31.0457 0.887695 20 0.887695C8.9543 0.887695 0 9.842 0 20.8877C0 31.9334 8.9543 40.8877 20 40.8877Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.3811 24.5549C20.3554 24.7455 20.1928 24.8877 20.0005 24.8877C19.8078 24.8877 19.6449 24.7449 19.6197 24.5538L18.1062 13.0686C18.0354 12.5531 18 12.1688 18 11.9159C18 11.3031 18.1976 10.8118 18.5929 10.4422C18.9882 10.0725 19.4631 9.8877 20.0177 9.8877C20.5723 9.8877 21.0413 10.0725 21.4248 10.4422C21.8083 10.8118 22 11.3614 22 12.091C22 12.3245 21.9764 12.6503 21.9292 13.0686L20.3811 24.5549ZM21.4144 31.2995C21.024 31.6916 20.5526 31.8877 20 31.8877C19.4474 31.8877 18.976 31.6916 18.5856 31.2995C18.1952 30.9073 18 30.4337 18 29.8786C18 29.3357 18.1952 28.8681 18.5856 28.4759C18.976 28.0838 19.4474 27.8877 20 27.8877C20.5526 27.8877 21.024 28.0838 21.4144 28.4759C21.8048 28.8681 22 29.3357 22 29.8786C22 30.4337 21.8048 30.9073 21.4144 31.2995Z"
    />
  </SVGIcon>
)
