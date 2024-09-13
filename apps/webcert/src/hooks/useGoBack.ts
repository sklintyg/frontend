import { useHistory } from 'react-router'
import { useAppSelector } from '../store/store'
import { getPatientId } from '../store/srs/srsSelectors'

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
