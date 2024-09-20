import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router'

export const useGoBackEffect = () => {
  const history = useHistory()
  const isForeignReferrer = () => document.referrer && !document.referrer.includes(window.location.host)

  const handleGoBack = useCallback(() => {
    if (isForeignReferrer()) {
      window.location.replace('/search')
    } else {
      history.goBack()
    }
  }, [history])

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.location.replace(window.location.pathname)
      unlisten()
    })
    return unlisten
  }, [history])

  return handleGoBack
}
