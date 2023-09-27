import { IDSExpandable } from '@frontend/ids-react-ts'
import parse, { DOMNode, Element, domToReact } from 'html-react-parser'
import { createElement } from 'react'
import { CertificateContent } from '../../../../schema/certificate.schema'

const options = {
  replace: (domNode: DOMNode) => {
    if (domNode instanceof Element) {
      const { name, children } = domNode
      const match = name.match(/^h(\d)$/)
      if (match) {
        return createElement(match[0], { className: `ids-heading-${match[1]}` }, domToReact(children))
      }
      if (name === 'table') {
        return <table className="ids-table">{domToReact(children)}</table>
      }
    }
    return undefined
  },
}

export function CertificateBody({ content }: { content: CertificateContent[] }) {
  return (
    <>
      {content.map(({ heading, body }) => {
        const parsedBody = parse(body, options)
        return (
          <section key={heading} className="md:mb-10">
            <IDSExpandable className="md:hidden" headline={heading}>
              {parsedBody}
            </IDSExpandable>
            <div className="hidden md:block">
              <h2 className="ids-heading-2">{heading}</h2>
              {parsedBody}
            </div>
          </section>
        )
      })}
    </>
  )
}
