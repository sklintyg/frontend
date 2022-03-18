import React from 'react'
import { useDispatch } from 'react-redux'
import { triggerLogoutNow } from '../../store/user/userActions'
import { Link } from 'react-router-dom'

interface Props {
  className: string
}

const Logout: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()

  const onClick = () => {
    dispatch(triggerLogoutNow)
  }

  return (
    <Link to={{ pathname: '/' }} onClick={onClick} className={className}>
      Logga ut
    </Link>
  )
}

export default Logout
