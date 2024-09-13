import { useHistory } from 'react-router'

export const useGoBack = () => {
  const history = useHistory()
  const isSithsSignReferrer = document.referrer.startsWith('https://esign')

  return () => {
    if (isSithsSignReferrer) {
      window.location.replace('/search')
    } else {
      history.goBack()
    }
  }
}
