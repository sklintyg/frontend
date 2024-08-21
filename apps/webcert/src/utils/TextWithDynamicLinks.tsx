import React from 'react'
import WCDynamicLink from './WCDynamicLink'
import { sanitizeText } from './sanitizeText'

interface Props {
  text: string
}

const TextWithDynamicLinks: React.FC<Props> = ({ text }) => {
  const formatText = (text: string) => {
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

  return <>{text.includes('<LINK:') ? formatText(text) : <span dangerouslySetInnerHTML={sanitizeText(text)}></span>}</>
}

export default TextWithDynamicLinks
