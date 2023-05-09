import { ReactNode } from 'react'

export const hasNoChildren = (nodes: ReactNode): boolean => !nodes || (nodes instanceof Array && nodes.length === 0)
