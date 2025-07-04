/* eslint-disable react/no-array-index-key */
import { AppLink } from '@frontend/components'
import type { DOMNode } from 'html-react-parser'
import parse, { attributesToProps, domToReact } from 'html-react-parser'
import { createElement } from 'react'
import { MobileTable } from './MobileTable'
import { isElement } from './utils/isElement'

const headingMap = ['xxl', 'xl', 'l', 'm', 's', 'xs']

const options = {
  replace: (domNode: DOMNode) => {
    if (isElement(domNode)) {
      const { name, attribs, children } = domNode
      const props = attributesToProps(attribs)
      const match = name.match(/^h(\d)$/)

      if (match && match[1]) {
        const [tag, level] = match
        return createElement(
          tag,
          { className: `ids-heading-${headingMap[Math.min(parseInt(level, 10) + 1, headingMap.length - 1)]}` },
          domToReact(children, options)
        )
      }

      if (name === 'table') {
        const elements = children.filter(isElement)
        return (
          <>
            <div className="md:hidden">
              <MobileTable
                header={elements.find((node) => node.name === 'thead')}
                body={elements.find((node) => node.name === 'tbody')}
                options={options}
              />
            </div>
            <div className="hidden md:block">
              <table className="ids-table">{domToReact(children, options)}</table>
            </div>
          </>
        )
      }

      if (name === 'a' && props.href) {
        return (
          <AppLink to={props.href} external={props.target === '_blank'}>
            {domToReact(children, options)}
          </AppLink>
        )
      }

      if (name === 'th' && children.length === 0) {
        return <td />
      }
    }
    return undefined
  },
}

export function DisplayHTML({ html }: { html: string }) {
  return <>{parse(html, options)}</>
}
