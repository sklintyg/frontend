import { useNavigate } from 'react-router-dom'

function fakeLogout() {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/logout', false)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.send()
}

export function useLogout() {
  const navigate = useNavigate()

  return {
    logout: () => {
      fakeLogout()
      navigate('/welcome')
    },
  }
}
