import { Link } from 'react-router-dom'

export function StartPageLink() {
  return (
    <div className="text-center">
      <Link to="/" className="ids-icon-arrow-link ids-link--start-icon ids-link ids-link--color-1">
        Till startsidan
      </Link>
    </div>
  )
}
