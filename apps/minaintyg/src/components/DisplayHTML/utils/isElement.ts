import type { DOMNode } from 'html-react-parser'
import { Element } from 'html-react-parser'

export const isElement = (node: Element | DOMNode | ChildNode): node is Element => node instanceof Element
