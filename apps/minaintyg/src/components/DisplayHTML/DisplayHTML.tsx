/* eslint-disable react/no-array-index-key */
import { IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import parse, { DOMNode, attributesToProps, domToReact } from 'html-react-parser'
import { createElement } from 'react'
import { MobileTable } from './MobileTable'
import { isElement } from './utils/isElement'

const options = {
  replace: (domNode: DOMNode) => {
    if (isElement(domNode)) {
      const { name, attribs, children } = domNode
      const props = attributesToProps(attribs)
      const match = name.match(/^h(\d)$/)

      if (match) {
        const [headingElement, headingLevel] = match
        return createElement(
          headingElement,
          { className: `ids-heading-${parseInt(headingLevel, 10) < 4 ? headingLevel : 4}` },
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

      if (name === 'a') {
        return (
          <IDSLink underlined>
            <a {...props}>{domToReact(children, options)}</a>
            {attribs.target === '_blank' && <IDSIconExternal slot="append-icon" size="s" />}
          </IDSLink>
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
