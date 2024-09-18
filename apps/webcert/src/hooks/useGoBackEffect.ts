import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router'

export const useGoBackEffect = () => {
  const history = useHistory()
  const [foreignCheck, setForeignCheck] = useState(true)
  const isForeignReferrer = () => document.referrer && !document.referrer.includes(window.location.host)

  const handleGoBack = useCallback(() => {
    if (foreignCheck && isForeignReferrer()) {
      window.location.replace('/search')
    } else {
      history.goBack()
    }
  }, [history, foreignCheck])

  useEffect(() => {
    const unlisten = history.listen(() => {
      setForeignCheck(false)
      unlisten()
    })
    return unlisten
  }, [history])

  return handleGoBack
}
