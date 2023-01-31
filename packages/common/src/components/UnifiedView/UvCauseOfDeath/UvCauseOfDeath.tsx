import React from 'react'
import styled from 'styled-components'
import { ConfigUeCauseOfDeath, ValueCauseOfDeath } from '../../..'
import { Badge } from '../Badge'

const CauseOfDeathWrapper = styled.div`
  display: inline-block;
`

export const UvCauseOfDeath: React.FC<{ value: ValueCauseOfDeath; config: ConfigUeCauseOfDeath }> = ({ value, config }) => {
  const chosenSpec = config.causeOfDeath.specifications.find((item) => item.code === value.specification.code)
  const description = value.description?.text ?? 'Ej angivet'
  const debut = value.debut?.date ?? 'Ej angivet'
  const specification = chosenSpec?.label ?? 'Ej angivet'
  return (
    <>
      {config.label && <div className="iu-fl iu-fs-700 iu-mr-400 iu-pt-200">{config.label}</div>}

      <CauseOfDeathWrapper>
        <div>
          <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Beskrivning</p>
          <Badge>{description}</Badge>
        </div>
        <div className="iu-flex">
          <div className="iu-mr-600">
            <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Ungefärlig debut</p>
            <Badge>{debut}</Badge>
          </div>
          <div>
            <p className={'iu-fs-200 iu-fw-bold iu-pb-200 iu-pt-300'}>Specificera tillståndet</p>
            <Badge>{specification}</Badge>
          </div>
        </div>
      </CauseOfDeathWrapper>
    </>
  )
}
