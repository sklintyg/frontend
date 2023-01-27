import { sanitizeText } from '@frontend/common'
import React from 'react'
import WCDynamicLink from './WCDynamicLink'

interface Props {
  text: string
}

const TextWithDynamicLinks: React.FC<Props> = ({ text }) => {
  const hasDynamicLink = (text?: string): boolean => {
    if (!text) {
      return false
    }
    return text.includes('<LINK:')
  }

  const formatText = (text: string) => {
    if (!text) {
      return ''
    }
    const splitText = text.split('<LINK:')
    if (splitText.length > 1) {
      let returnValue = <span dangerouslySetInnerHTML={sanitizeText(splitText[0])}></span>

      for (let i = 0; i < splitText.length - 1; i++) {
        const dynamicLinkKey = splitText[i + 1].split('>')[0]
        const textAfterLink = splitText[i + 1].substring(splitText[i + 1].indexOf('>') + 1)
        returnValue = (
          <>
            {returnValue}
            <WCDynamicLink linkKey={dynamicLinkKey} />
            <span dangerouslySetInnerHTML={sanitizeText(textAfterLink)}></span>
          </>
        )
      }
      return <>{returnValue}</>
    }
    return text
  }

  return <>{hasDynamicLink(text) ? formatText(text) : <span dangerouslySetInnerHTML={sanitizeText(text)}></span>}</>
}

export default TextWithDynamicLinks
