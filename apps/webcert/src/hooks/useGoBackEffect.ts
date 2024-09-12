import { useHistory } from 'react-router'
import { useAppSelector } from '../store/store'
import { getPatientId } from '../store/srs/srsSelectors'

export const useGoBackEffect = () => {
  const history = useHistory()
  const patientId = useAppSelector((state) => getPatientId(state))
  const isAfterSithsSign = document.referrer.startsWith('https://esign')

  return () => {
    if (isAfterSithsSign) {
      if (patientId) {
        history.push(`/create/${encodeURIComponent(btoa(patientId))}`)
      } else {
        history.push('/search')
      }
      document.location.reload()
    } else {
      history.goBack()
    }
  }
}
