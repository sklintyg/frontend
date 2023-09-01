import { IDSBreadcrumbs, IDSCrumb } from '@frontend/ids-react-ts'
import { Link, Params, useMatches } from 'react-router-dom'

type Match = ReturnType<typeof useMatches>[number]
type MatchWithCrumb = Match & {
  handle: { crumb: (data: Params<string>) => string }
}

function hasCrumb(match: MatchWithCrumb | Match): match is MatchWithCrumb {
  return (match as MatchWithCrumb).handle !== undefined && typeof (match as MatchWithCrumb).handle.crumb === 'function'
}

export function Breadcrumbs() {
  const matches = useMatches()
  const matchesWithCrumbs = matches.filter(hasCrumb)
  const currentMatch = matchesWithCrumbs.at(-1)
  const current = currentMatch?.handle.crumb(currentMatch.params)

  return (
    <div className="mb-5">
      <IDSBreadcrumbs current={current} srlabel="Du är här" lead="Du är här:">
        {matchesWithCrumbs.slice(0, -1).map(({ handle, params, pathname }) => (
          <IDSCrumb key={pathname}>
            <Link to={pathname}>{handle.crumb(params)}</Link>
          </IDSCrumb>
        ))}
        {currentMatch && (
          <IDSCrumb key="mobile" mobile>
            <Link to={currentMatch.pathname}>{current}</Link>
          </IDSCrumb>
        )}
      </IDSBreadcrumbs>
    </div>
  )
}
