import { createElement, forwardRef } from 'react'
import { classNames } from '../../utils/classNames'

type HeadingProps = {
  level: number
  size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLHeadingElement>

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({ level = 1, size = 'm', children, className, ...props }, ref) =>
  createElement(
    `h${level}`,
    {
      ref,
      className: classNames(`ids-heading-${size} !normal-case`, className),
      ...props,
    },
    children
  )
)

Heading.displayName = 'Heading'
