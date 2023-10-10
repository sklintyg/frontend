/* eslint-disable react/no-array-index-key */
import { IDSIconExternal, IDSLink } from '@frontend/ids-react-ts'
import parse, { DOMNode, attributesToProps, domToReact } from 'html-react-parser'
import { createElement, useMemo } from 'react'
import { MobileTable } from './MobileTable'
import { isElement } from './utils/isElement'

const getOptions = (isMobile: boolean) => ({
  replace: (domNode: DOMNode) => {
    if (isElement(domNode)) {
      const { name, attribs, children } = domNode
      const props = attributesToProps(attribs)
      const match = name.match(/^h(\d)$/)

      if (match) {
        return createElement(match[0], { className: `ids-heading-${match[1]}` }, domToReact(children))
      }

      if (name === 'table') {
        const elements = children.filter(isElement)
        return isMobile ? (
          <MobileTable header={elements.find((node) => node.name === 'thead')} body={elements.find((node) => node.name === 'tbody')} />
        ) : (
          <table className="ids-table">{domToReact(children)}</table>
        )
      }

      if (name === 'a') {
        return (
          <IDSLink underlined>
            <a {...props}>{domToReact(children)}</a>
            {attribs.target === '_blank' && <IDSIconExternal slot="append-icon" size="s" />}
          </IDSLink>
        )
      }
    }
    return undefined
  },
})

export function DisplayHTML({ html, mobile = false }: { html: string; mobile?: boolean }) {
  const options = useMemo(() => getOptions(mobile), [mobile])
  return <>{parse(html, options)}</>
}
