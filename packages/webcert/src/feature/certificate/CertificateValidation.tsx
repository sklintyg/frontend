import * as React from 'react'
import { useSelector } from 'react-redux'
import { getShowValidationErrors, getValidationErrorSummary } from '../../store/certificate/certificateSelectors'
import { Link } from 'react-scroll'
import { InfoBox } from '@frontend/common'
import { css } from 'styled-components/macro'
import _ from 'lodash'

const linkStyles = css`
  cursor: pointer;

  &:first-letter {
    text-transform: capitalize;
  }
`

const CertificateValidation: React.FC = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getValidationErrorSummary(), _.isEqual)

  if (!validationErrors || validationErrors.length === 0 || !isShowValidationError) return null

  return (
    <div className={`iu-pt-400 iu-pb-400 iu-mt-400 iu-bg-white iu-radius-sm contentPaperWrapper`}>
      <InfoBox type="error">
        <p>Utkastet saknar uppgifter i följande avsnitt:</p>
      </InfoBox>
      <div className={'iu-mt-300'}>
        {Array.from(new Set(validationErrors)).map((validation, i) => {
          return (
            <p key={i} className={'iu-mt-none'}>
              <Link
                css={linkStyles}
                className={'iu-color-error iu-fs-300'}
                duration={250}
                smooth
                offset={-20}
                containerId="questions-container"
                to={`${validation.id}`}>
                {validation.text}
              </Link>
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default CertificateValidation
