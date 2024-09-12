import { useHistory } from 'react-router'
import { useAppSelector } from '../store/store'
import { getPatientId } from '../store/srs/srsSelectors'

export const useGoBack = () => {
  const history = useHistory()
  const patientId = useAppSelector((state) => getPatientId(state))
  const isSithsSignReferrer = document.referrer.startsWith('https://esign')

  return () => {
    if (isSithsSignReferrer) {
      if (patientId) {
        window.location.replace(`/create/${encodeURIComponent(btoa(patientId))}`)
      } else {
        window.location.replace('/search')
      }
    } else {
      history.goBack()
    }
  }
}
