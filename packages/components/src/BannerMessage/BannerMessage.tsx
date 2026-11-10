import DOMPurify from 'dompurify'
import type { DOMNode } from 'html-react-parser'
import parse, { domToReact, Element } from 'html-react-parser'
import { AppLink } from '../AppLink/AppLink'

const sanitize = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'br', 'b', 'strong', 'i', 'em', 'u'],
    ALLOWED_ATTR: ['href'],
    ALLOWED_URI_REGEXP: /^(?:https?|mailto):/i,
  })

const options = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element && domNode.name === 'a') {
      const children = domToReact(domNode.children as DOMNode[], options)
      const { href } = domNode.attribs
      return href ? (
        <AppLink to={href} underlined external>
          {children}
        </AppLink>
      ) : (
        <>{children}</>
      )
    }
    return undefined
  },
}

export function BannerMessage({ html }: Readonly<{ html: string }>) {
  return <>{parse(sanitize(html), options)}</>
}
