import { isEqual } from 'lodash-es'
import { useSelector } from 'react-redux'
import { Link } from 'react-scroll'
import styled from 'styled-components'
import InfoBox from '../../components/utils/InfoBox'
import { getShowValidationErrors, getValidationErrorSummary } from '../../store/certificate/certificateSelectors'

const ErrorLink = styled(Link)`
  cursor: pointer;

  &:first-letter {
    text-transform: capitalize;
  }
`

const CertificateValidation = () => {
  const isShowValidationError = useSelector(getShowValidationErrors)
  const validationErrors = useSelector(getValidationErrorSummary(), isEqual)

  if (!validationErrors || validationErrors.length === 0 || !isShowValidationError) return null

  return (
    <div data-testid="certificate-validation" className={`iu-pt-400 iu-pb-400 iu-mt-400 iu-bg-white iu-radius-sm contentPaperWrapper`}>
      <InfoBox type="error">
        <p>Utkastet saknar uppgifter i följande avsnitt:</p>
      </InfoBox>
      <div className={'iu-mt-300'}>
        {Array.from(new Set(validationErrors)).map((validation, i) => {
          return (
            <p key={i} className={'iu-mt-none'}>
              <ErrorLink
                role="link"
                className={'iu-color-error iu-fs-300'}
                duration={250}
                smooth
                offset={-20}
                containerId="questions-container"
                to={validation.id}
              >
                {validation.text}
              </ErrorLink>
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default CertificateValidation
