interface Props {
  text?: string
  size?: 'small' | 'large' | undefined
  className?: string
}

const Spinner = ({ text, size, className }: Props) => {
  return (
    <div>
      <div className={`ic-spinner ${className}`}>
        <div className="ic-spinner__bounce1"></div>
        <div className="ic-spinner__bounce2"></div>
        <div className="ic-spinner__bounce3"></div>
      </div>
      <p className={`${size === 'small' ? 'iu-fs-200' : 'iu-fs-500'} iu-pt-300`}>{text}</p>
    </div>
  )
}

export default Spinner
