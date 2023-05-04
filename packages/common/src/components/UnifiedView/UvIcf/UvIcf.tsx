import React from 'react'
import styled from 'styled-components'
import { ConfigUeIcf, ValueIcf } from '../../../types'
import { Badge } from '../Badge'

const IcfCode = styled.p`
  flex-shrink: 0;
`
const IcfCodeWrapper = styled.div`
  flex-wrap: wrap;
`

export const UvIcf: React.FC<{
  value: ValueIcf
  config: ConfigUeIcf
}> = ({ value, config }) => {
  const icfCodes = value.icfCodes as string[]
  const icfTextValue = value.text as string
  const collectionsLabel = config.collectionsLabel
  if ((icfCodes && icfCodes.length) || (icfTextValue && icfTextValue.length)) {
    return (
      <Badge>
        <div className={'iu-fs-200'}>
          {icfCodes && icfCodes.length > 0 && (
            <>
              <p>{collectionsLabel}</p>
              <IcfCodeWrapper className={'iu-flex iu-mb-400'}>
                {icfCodes.map((code, i) => (
                  <React.Fragment key={code}>
                    <IcfCode>{code}</IcfCode>
                    {i !== icfCodes.length - 1 && <span className="iu-ml-200 iu-mr-200">-</span>}
                  </React.Fragment>
                ))}
              </IcfCodeWrapper>
            </>
          )}
          <p>{icfTextValue}</p>
        </div>
      </Badge>
    )
  }
  return (
    <Badge>
      <p>Ej angivet</p>
    </Badge>
  )
}
