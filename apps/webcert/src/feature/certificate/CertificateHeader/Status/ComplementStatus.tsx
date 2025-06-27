import StatusWithIcon from '../../../../components/utils/StatusWithIcon'

const ComplementStatus = () => {
  return (
    <StatusWithIcon icon={'ErrorOutlineIcon'} additionalTextStyles={'iu-color-error'}>
      Försäkringskassan har begärt komplettering
    </StatusWithIcon>
  )
}

export default ComplementStatus
