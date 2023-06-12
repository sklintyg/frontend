import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { IDSContainer, IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { uuidv4 } from '../../components/Error/util/errorUtils'
import { api } from '../../store/api'
import { setErrorCode, setRoutingErrorId } from '../../store/slices/error.slice'
import { PageHero } from '../../components/PageHero/PageHero'
import { TooltipIcon } from '../../components/TooltipIcon/TooltipIcon'
import { DisplayRoutingError } from '../../components/Error/DisplayRoutingError'
import { ErrorCode } from '../../components/Error/ErrorCode'

const ReasonParamErrorCodeMap = new Map<string, ErrorCode>([
  ['login.failed', ErrorCode.LOGIN_FAILED],
  ['login.hsaerror', ErrorCode.LOGIN_HSA_ERROR],
  ['login.medarbetaruppdrag', ErrorCode.LOGIN_MEDARBETARUPPDRAG_SAKNAS],
  ['login.saknar-hsa-rehabroll', ErrorCode.LOGIN_SAKNAR_HSA_REHABROLL],
])

export function ErrorPage() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [displayCopyMessage, setDisplayCopyMessage] = useState(false)
  const { current: errorId } = useRef(uuidv4())
  const { routingErrorId } = useAppSelector((state) => state.error)
  const { errorCode } = useAppSelector((state) => state.error)

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search)
      const reason = params.get('reason') ?? ''
      const generatedErrorCode = ReasonParamErrorCodeMap.get(reason) as ErrorCode
      dispatch(
        api.endpoints.logError.initiate({
          errorData: {
            errorId,
            errorCode: generatedErrorCode,
            message: reason,
            stackTrace: null,
          },
        })
      )
      dispatch(setErrorCode(generatedErrorCode))
      dispatch(setRoutingErrorId(errorId))
    }
  }, [dispatch, location.search])
  const handleCopyClick = () => {
    setDisplayCopyMessage(true)
    navigator.clipboard.writeText(routingErrorId)
  }
  return (
    <IDSContainer>
      <PageHero type="error" icon="attention">
        <DisplayRoutingError errorCode={errorCode} />
        <div className="flex justify-center">
          <p className="mr-2 font-bold">FEL-ID:</p>
          {routingErrorId}
          <TooltipIcon
            description="Kopiera fel-id"
            name="copy-file"
            size="s"
            colorpreset={1}
            className="ml-2 inline cursor-pointer"
            onClick={handleCopyClick}
          />
        </div>
        {displayCopyMessage && <strong className="text-xs">Fel-id kopierat till urklipp.</strong>}
      </PageHero>
      <div className="text-center">
        <IDSLink>
          <IDSIcon name="chevron" />
          <Link to="/">Till startsidan</Link>
        </IDSLink>
      </div>
    </IDSContainer>
  )
}
